import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import Task from "../models/Task.js";
import Activity from "../models/Activity.js";

const getWorkspaceMemberRole = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId);
  if (!workspace) throw new ApiError(404, "Workspace not found.");

  const member = workspace.members.find(
    (m) => m.user.toString() === userId.toString(),
  );
  if (!member)
    throw new ApiError(403, "You are not a member of this workspace.");

  return member.role;
};

export const createProject = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;
  const { title, description, status, deadline } = req.body;

  const wsRole = await getWorkspaceMemberRole(workspaceId, req.user._id);
  if (!["owner", "admin"].includes(wsRole)) {
    throw new ApiError(403, "Only owners and admins can create projects.");
  }

  const project = await Project.create({
    title,
    description,
    status: status || "planning",
    deadline: deadline || null,
    workspace: workspaceId,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "manager" }],
  });

  await project.populate("owner", "name email avatar");
  await project.populate("members.user", "name email avatar");

  res.status(201).json({
    message: "Project created.",
    project,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const { workspaceId } = req.params;

  await getWorkspaceMemberRole(workspaceId, req.user._id);

  const projects = await Project.find({ workspace: workspaceId })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar")
    .sort({ createdAt: -1 });

  const projectsWithTaskCount = await Promise.all(
    projects.map(async (project) => {
      const taskCount = await Task.countDocuments({ project: project._id });
      const completedCount = await Task.countDocuments({
        project: project._id,
        status: "done",
      });
      return {
        ...project.toObject(),
        taskCount,
        completedCount,
      };
    }),
  );

  res.json({ projects: projectsWithTaskCount });
});

export const getProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!project) throw new ApiError(404, "Project not found.");

  await getWorkspaceMemberRole(project.workspace, req.user._id);

  res.json({ project });
});

export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found.");

  const wsRole = await getWorkspaceMemberRole(project.workspace, req.user._id);
  const projectMember = project.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  );
  const isProjectManager = projectMember?.role === "manager";

  if (!["owner", "admin"].includes(wsRole) && !isProjectManager) {
    throw new ApiError(
      403,
      "Only project managers and workspace owners/admins can edit projects.",
    );
  }

  const { title, description, status, deadline } = req.body;
  if (title) project.title = title;
  if (description !== undefined) project.description = description;
  if (status) project.status = status;
  if (deadline !== undefined) project.deadline = deadline;

  await project.save();
  await project.populate("owner", "name email avatar");
  await project.populate("members.user", "name email avatar");

  res.json({ message: "Project updated.", project });
});

export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found.");

  const wsRole = await getWorkspaceMemberRole(project.workspace, req.user._id);
  if (!["owner", "admin"].includes(wsRole)) {
    throw new ApiError(
      403,
      "Only workspace owners and admins can delete projects.",
    );
  }

  await Task.deleteMany({ project: project._id });

  await Activity.deleteMany({ project: project._id });
  await project.deleteOne();

  res.json({ message: "Project deleted." });
});

export const getProjectMembers = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id).populate(
    "members.user",
    "name email avatar",
  );

  if (!project) throw new ApiError(404, "Project not found.");

  await getWorkspaceMemberRole(project.workspace, req.user._id);

  res.json({ members: project.members });
});

export const addProjectMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found.");

  const wsRole = await getWorkspaceMemberRole(project.workspace, req.user._id);
  const myProjectRole = project.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  )?.role;

  if (!["owner", "admin"].includes(wsRole) && myProjectRole !== "manager") {
    throw new ApiError(
      403,
      "Only project managers and workspace owners/admins can add members.",
    );
  }

  const { userId, role } = req.body;

  await getWorkspaceMemberRole(project.workspace, userId);

  const alreadyMember = project.members.some(
    (m) => m.user.toString() === userId,
  );
  if (alreadyMember)
    throw new ApiError(409, "User is already a project member.");

  project.members.push({ user: userId, role: role || "developer" });
  await project.save();
  await project.populate("members.user", "name email avatar");

  res.json({ message: "Member added to project.", members: project.members });
});

export const removeProjectMember = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found.");

  const wsRole = await getWorkspaceMemberRole(project.workspace, req.user._id);
  const myProjectRole = project.members.find(
    (m) => m.user.toString() === req.user._id.toString(),
  )?.role;

  if (!["owner", "admin"].includes(wsRole) && myProjectRole !== "manager") {
    throw new ApiError(
      403,
      "Only project managers and workspace owners/admins can remove members.",
    );
  }

  const targetUserId = req.params.userId;
  if (targetUserId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot remove yourself from the project.");
  }

  const idx = project.members.findIndex(
    (m) => m.user.toString() === targetUserId,
  );
  if (idx === -1) throw new ApiError(404, "User is not a project member.");

  project.members.splice(idx, 1);
  await project.save();

  res.json({ message: "Member removed from project." });
});

export const getProjectActivity = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found.");

  await getWorkspaceMemberRole(project.workspace, req.user._id);

  const activities = await Activity.find({ project: req.params.id })
    .populate("user", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(30);

  res.json({ activities });
});
