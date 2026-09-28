

import express from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import validate from "../middleware/validate.js";
import { protect } from "../middleware/auth.js";
import {
  register,
  login,
  getMe,
  updateProfile,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.get("/me", protect, getMe);

router.put("/profile", protect, updateProfile);

export default router;
