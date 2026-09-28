

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getWorkspaceAnalytics = asyncHandler(async (req, res) => {
  const workspace = await Workspace.findById(req.params.id);
  if (!workspace) throw new ApiError(404, "Workspace not found.");

  
  const isMember = workspace.members.some(
    (m) => m.user.toString() === req.user._id.toString()
  );
  if (!isMember) throw new ApiError(403, "Access denied.");

  
  const totalProjects = await Project.countDocuments({ workspace: workspace._id });

  
  const tasks = await Task.find({ workspace: workspace._id });
  const totalTasks = tasks.length;

  
  const tasksByStatus = {
    todo: 0,
    in_progress: 0,
    review: 0,
    done: 0,
  };

  
  const tasksByPriority = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0,
  };

  const now = new Date();
  let overdueTasks = 0;

  tasks.forEach((task) => {
    
    if (tasksByStatus[task.status] !== undefined) {
      tasksByStatus[task.status]++;
    }

    
    if (tasksByPriority[task.priority] !== undefined) {
      tasksByPriority[task.priority]++;
    }

    
    if (task.deadline && task.status !== "done" && new Date(task.deadline) < now) {
      overdueTasks++;
    }
  });

  const completedTasks = tasksByStatus.done;
  const completionPercent = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  const memberCount = workspace.members.length;

  res.json({
    totalProjects,
    totalTasks,
    completedTasks,
    overdueTasks,
    completionPercent,
    memberCount,
    tasksByStatus,
    tasksByPriority,
  });
});
