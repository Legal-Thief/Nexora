

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Task from "../models/Task.js";
import Project from "../models/Project.js";
import Workspace from "../models/Workspace.js";
import Notification from "../models/Notification.js";
import Activity from "../models/Activity.js";

const checkProjectAccess = async (projectId, userId) => {
  const project = await Project.findById(projectId);
  if (!project) throw new ApiError(404, "Project not found.");

  const workspace = await Workspace.findById(project.workspace);
  if (!workspace) throw new ApiError(404, "Workspace not found.");

  const isMember = workspace.members.some(
    (m) => m.user.toString() === userId.toString()
  );
  if (!isMember) throw new ApiError(403, "Access denied.");

  return { project, workspace };
};

const logActivity = async (userId, project, action, message) => {
  try {
    await Activity.create({
      user: userId,
      project: project._id,
      workspace: project.workspace,
      action,
      message,
    });
  } catch (err) {
    
    console.warn("Activity log failed:", err.message);
  }
};

export const createTask = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { title, description, status, priority, assignee, deadline, labels } = req.body;

  const { project, workspace } = await checkProjectAccess(projectId, req.user._id);

  const task = await Task.create({
    title,
    description,
    status: status || "todo",
    priority: priority || "medium",
    assignee: assignee || null,
    project: projectId,
    workspace: workspace._id,
    createdBy: req.user._id,
    deadline: deadline || null,
    labels: labels || [],
  });

  
  await task.populate("assignee", "name email avatar");
  await task.populate("createdBy", "name email avatar");

  
  if (assignee && assignee !== req.user._id.toString()) {
    await Notification.create({
      recipient: assignee,
      actor: req.user._id,
      type: "task_assigned",
      message: `${req.user.name} assigned you the task "${title}".`,
      link: `/app/projects/${projectId}`,
    });
  }

  await logActivity(req.user._id, project, "task_created", `${req.user.name} created task "${title}".`);

  res.status(201).json({ message: "Task created.", task });
});

export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  await checkProjectAccess(projectId, req.user._id);

  const tasks = await Task.find({ project: projectId })
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 });

  res.json({ tasks });
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id)
    .populate("assignee", "name email avatar")
    .populate("createdBy", "name email avatar")
    .populate("project", "title");

  if (!task) throw new ApiError(404, "Task not found.");

  await checkProjectAccess(task.project._id, req.user._id);

  res.json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found.");

  const { project } = await checkProjectAccess(task.project, req.user._id);

  const previousAssignee = task.assignee?.toString();
  const previousStatus = task.status;

  
  const { title, description, status, priority, assignee, deadline, labels } = req.body;
  if (title !== undefined)       task.title = title;
  if (description !== undefined) task.description = description;
  if (status !== undefined)      task.status = status;
  if (priority !== undefined)    task.priority = priority;
  if (assignee !== undefined)    task.assignee = assignee || null;
  if (deadline !== undefined)    task.deadline = deadline || null;
  if (labels !== undefined)      task.labels = labels;

  await task.save();

  await task.populate("assignee", "name email avatar");
  await task.populate("createdBy", "name email avatar");

  
  const newAssignee = task.assignee?._id?.toString();
  if (newAssignee && newAssignee !== previousAssignee && newAssignee !== req.user._id.toString()) {
    await Notification.create({
      recipient: newAssignee,
      actor: req.user._id,
      type: "task_assigned",
      message: `${req.user.name} assigned you the task "${task.title}".`,
      link: `/app/projects/${task.project}`,
    });
  }

  
  let action = "task_updated";
  let logMessage = `${req.user.name} updated task "${task.title}".`;

  if (status && status !== previousStatus) {
    action = "task_moved";
    const statusLabels = { todo: "To Do", in_progress: "In Progress", review: "Review", done: "Done" };
    logMessage = `${req.user.name} moved "${task.title}" to ${statusLabels[status] || status}.`;
  }

  await logActivity(req.user._id, project, action, logMessage);

  res.json({ message: "Task updated.", task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found.");

  const { project } = await checkProjectAccess(task.project, req.user._id);

  const taskTitle = task.title;

  await task.deleteOne();

  await logActivity(req.user._id, project, "task_deleted", `${req.user.name} deleted task "${taskTitle}".`);

  res.json({ message: "Task deleted." });
});
