

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import Invitation from "../models/Invitation.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";

const findWorkspaceAndCheckMember = async (workspaceId, userId) => {
  const workspace = await Workspace.findById(workspaceId)
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar");

  if (!workspace) throw new ApiError(404, "Workspace not found.");

  const member = workspace.members.find(
    (m) => m.user._id.toString() === userId.toString()
  );
  if (!member) throw new ApiError(403, "You are not a member of this workspace.");

  return { workspace, memberRole: member.role };
};

export const createWorkspace = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  
  const workspace = await Workspace.create({
    name,
    description,
    owner: req.user._id,
    members: [{ user: req.user._id, role: "owner" }],
  });

  
  await workspace.populate("members.user", "name email avatar");
  await workspace.populate("owner", "name email avatar");

  res.status(201).json({
    message: "Workspace created.",
    workspace,
  });
});

export const getWorkspaces = asyncHandler(async (req, res) => {
  const workspaces = await Workspace.find({ "members.user": req.user._id })
    .populate("owner", "name email avatar")
    .populate("members.user", "name email avatar")
    .sort({ createdAt: -1 });

  res.json({ workspaces });
});

export const getWorkspace = asyncHandler(async (req, res) => {
  const { workspace } = await findWorkspaceAndCheckMember(
    req.params.id,
    req.user._id
  );

  res.json({ workspace });
});

export const updateWorkspace = asyncHandler(async (req, res) => {
  const { workspace, memberRole } = await findWorkspaceAndCheckMember(
    req.params.id,
    req.user._id
  );

  
  if (!["owner", "admin"].includes(memberRole)) {
    throw new ApiError(403, "Only owners and admins can update this workspace.");
  }

  const { name, description } = req.body;
  if (name) workspace.name = name;
  if (description !== undefined) workspace.description = description;

  await workspace.save();

  res.json({ message: "Workspace updated.", workspace });
});

export const deleteWorkspace = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found.");

  
  if (workspace.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Only the workspace owner can delete it.");
  }

  
  const projects = await Project.find({ workspace: workspace._id }).select("_id");
  const projectIds = projects.map((p) => p._id);

  await Task.deleteMany({ project: { $in: projectIds } });
  await Project.deleteMany({ workspace: workspace._id });
  await Invitation.deleteMany({ workspace: workspace._id });
  await workspace.deleteOne();

  res.json({ message: "Workspace deleted." });
});

export const inviteMember = asyncHandler(async (req, res) => {
  const { workspace, memberRole } = await findWorkspaceAndCheckMember(
    req.params.id,
    req.user._id
  );

  
  if (!["owner", "admin"].includes(memberRole)) {
    throw new ApiError(403, "Only owners and admins can invite members.");
  }

  const { email } = req.body;

  
  const userToInvite = await User.findOne({ email });
  if (!userToInvite) {
    throw new ApiError(404, "No user found with that email. They must register first.");
  }

  
  const alreadyMember = workspace.members.some(
    (m) => m.user._id.toString() === userToInvite._id.toString()
  );
  if (alreadyMember) {
    throw new ApiError(409, "This user is already a member of the workspace.");
  }

  
  workspace.members.push({ user: userToInvite._id, role: "member" });
  await workspace.save();
  await workspace.populate("members.user", "name email avatar");

  
  await Notification.create({
    recipient: userToInvite._id,
    actor: req.user._id,
    type: "general",
    message: `${req.user.name} added you to workspace "${workspace.name}".`,
    link: "/app/dashboard",
  });

  res.json({ message: `${userToInvite.name} added to workspace.`, workspace });
});

export const removeMember = asyncHandler(async (req, res) => {
  const { workspace, memberRole } = await findWorkspaceAndCheckMember(
    req.params.id,
    req.user._id
  );

  
  if (!["owner", "admin"].includes(memberRole)) {
    throw new ApiError(403, "Only owners and admins can remove members.");
  }

  const targetUserId = req.params.userId;

  
  if (targetUserId === req.user._id.toString()) {
    throw new ApiError(400, "You cannot remove yourself. Transfer ownership first.");
  }

  const memberIndex = workspace.members.findIndex(
    (m) => m.user._id.toString() === targetUserId
  );
  if (memberIndex === -1) throw new ApiError(404, "Member not found.");

  const targetMember = workspace.members[memberIndex];
  if (targetMember.role === "owner") {
    throw new ApiError(403, "Cannot remove the workspace owner.");
  }

  workspace.members.splice(memberIndex, 1);
  await workspace.save();

  res.json({ message: "Member removed.", workspace });
});

export const updateMemberRole = asyncHandler(async (req, res) => {
  const { workspace, memberRole } = await findWorkspaceAndCheckMember(
    req.params.id,
    req.user._id
  );

  
  if (memberRole !== "owner") {
    throw new ApiError(403, "Only the workspace owner can change member roles.");
  }

  const { role } = req.body;
  const targetUserId = req.params.userId;

  const member = workspace.members.find(
    (m) => m.user._id.toString() === targetUserId
  );
  if (!member) throw new ApiError(404, "Member not found.");
  if (member.role === "owner") throw new ApiError(400, "Cannot change the owner's role.");

  member.role = role;
  await workspace.save();

  
  await Notification.create({
    recipient: targetUserId,
    actor: req.user._id,
    type: "role_changed",
    message: `Your role in "${workspace.name}" was changed to ${role}.`,
    link: "/app/settings",
  });

  res.json({ message: "Member role updated.", workspace });
});
