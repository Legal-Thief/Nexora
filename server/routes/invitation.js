

import express from "express";
import { protect } from "../middleware/auth.js";
import {
  getInvitationByToken,
  acceptInvitation,
} from "../controllers/invitation.controller.js";

const router = express.Router();

router.get("/:token", getInvitationByToken);

router.post("/:token/accept", protect, acceptInvitation);

export default router;
