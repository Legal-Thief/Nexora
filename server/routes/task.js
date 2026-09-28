

import express from "express";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  createTaskValidator,
  updateTaskValidator,
} from "../validators/task.validator.js";
import { commentValidator } from "../validators/comment.validator.js";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
} from "../controllers/task.controller.js";
import {
  addComment,
  getComments,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.post("/projects/:projectId/tasks", protect, createTaskValidator, validate, createTask);
router.get("/projects/:projectId/tasks", protect, getTasks);

router.get("/tasks/:id", protect, getTask);
router.put("/tasks/:id", protect, updateTaskValidator, validate, updateTask);
router.delete("/tasks/:id", protect, deleteTask);

router.post("/tasks/:taskId/comments", protect, commentValidator, validate, addComment);
router.get("/tasks/:taskId/comments", protect, getComments);
router.put("/comments/:id", protect, commentValidator, validate, updateComment);
router.delete("/comments/:id", protect, deleteComment);

export default router;
