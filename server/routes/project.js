

import express from "express";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  projectValidator,
  addProjectMemberValidator,
} from "../validators/project.validator.js";
import {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
  getProjectMembers,
  addProjectMember,
  removeProjectMember,
  getProjectActivity,
} from "../controllers/project.controller.js";

const router = express.Router();

router.post("/workspaces/:workspaceId/projects", protect, projectValidator, validate, createProject);
router.get("/workspaces/:workspaceId/projects", protect, getProjects);

router.get("/projects/:id", protect, getProject);
router.put("/projects/:id", protect, projectValidator, validate, updateProject);
router.delete("/projects/:id", protect, deleteProject);
router.get("/projects/:id/activity", protect, getProjectActivity);

router.get("/projects/:id/members", protect, getProjectMembers);
router.post("/projects/:id/members", protect, addProjectMemberValidator, validate, addProjectMember);
router.delete("/projects/:id/members/:userId", protect, removeProjectMember);

export default router;
