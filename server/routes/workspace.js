

import express from "express";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import {
  workspaceValidator,
  inviteMemberValidator,
  updateRoleValidator,
} from "../validators/workspace.validator.js";
import {
  createWorkspace,
  getWorkspaces,
  getWorkspace,
  updateWorkspace,
  deleteWorkspace,
  inviteMember,
  removeMember,
  updateMemberRole,
} from "../controllers/workspace.controller.js";
import { getWorkspaceAnalytics } from "../controllers/analytics.controller.js";
import { createInvitation, getInvitations, cancelInvitation } from "../controllers/invitation.controller.js";

const router = express.Router();

router.use(protect);

router.post("/", workspaceValidator, validate, createWorkspace);
router.get("/", getWorkspaces);
router.get("/:id", getWorkspace);
router.put("/:id", workspaceValidator, validate, updateWorkspace);
router.delete("/:id", deleteWorkspace);

router.post("/:id/invite", inviteMemberValidator, validate, inviteMember);
router.delete("/:id/members/:userId", removeMember);
router.put("/:id/members/:userId/role", updateRoleValidator, validate, updateMemberRole);

router.get("/:id/analytics", getWorkspaceAnalytics);

router.post("/:id/invitations", createInvitation);
router.get("/:id/invitations", getInvitations);
router.delete("/:id/invitations/:invId", cancelInvitation);

export default router;
