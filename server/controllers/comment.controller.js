

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Comment from "../models/Comment.js";
import Task from "../models/Task.js";
import Workspace from "../models/Workspace.js";
import Notification from "../models/Notification.js";

const checkTaskAccess = async (taskId, userId) => {
  const task = await Task.findById(taskId).populate("project");
  if (!task) throw new ApiError(404, "Task not found.");

  const workspace = await Workspace.findById(task.project.workspace);
  if (!workspace) throw new ApiError(404, "Workspace not found.");

  const isMember = workspace.members.some(
    (m) => m.user.toString() === userId.toString()
  );
  if (!isMember) throw new ApiError(403, "Access denied.");

  return { task, workspace };
};

export const addComment = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  const { content } = req.body;

  const { task } = await checkTaskAccess(taskId, req.user._id);

  const comment = await Comment.create({
    content,
    author: req.user._id,
    task: taskId,
  });

  await comment.populate("author", "name email avatar");

  const projectId = task.project._id.toString();

  
  if (task.assignee && task.assignee.toString() !== req.user._id.toString()) {
    await Notification.create({
      recipient: task.assignee,
      actor: req.user._id,
      type: "comment_added",
      message: `${req.user.name} commented on "${task.title}".`,
      link: `/app/projects/${projectId}`,
    });
  }

  
  if (
    task.createdBy &&
    task.createdBy.toString() !== req.user._id.toString() &&
    task.createdBy.toString() !== task.assignee?.toString()
  ) {
    await Notification.create({
      recipient: task.createdBy,
      actor: req.user._id,
      type: "comment_added",
      message: `${req.user.name} commented on "${task.title}".`,
      link: `/app/projects/${projectId}`,
    });
  }

  res.status(201).json({ message: "Comment added.", comment });
});

export const getComments = asyncHandler(async (req, res) => {
  const { taskId } = req.params;

  await checkTaskAccess(taskId, req.user._id);

  const comments = await Comment.find({ task: taskId })
    .populate("author", "name email avatar")
    .sort({ createdAt: 1 }); 

  res.json({ comments });
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new ApiError(404, "Comment not found.");

  
  if (comment.author.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own comments.");
  }

  comment.content = req.body.content;
  await comment.save();
  await comment.populate("author", "name email avatar");

  res.json({ message: "Comment updated.", comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id).populate({
    path: "task",
    populate: { path: "project" },
  });

  if (!comment) throw new ApiError(404, "Comment not found.");

  const isAuthor = comment.author.toString() === req.user._id.toString();

  
  let isPrivileged = false;
  if (!isAuthor) {
    const workspace = await Workspace.findById(comment.task.project.workspace);
    const member = workspace?.members.find(
      (m) => m.user.toString() === req.user._id.toString()
    );
    isPrivileged = ["owner", "admin"].includes(member?.role);
  }

  if (!isAuthor && !isPrivileged) {
    throw new ApiError(403, "You can only delete your own comments.");
  }

  await comment.deleteOne();

  res.json({ message: "Comment deleted." });
});
