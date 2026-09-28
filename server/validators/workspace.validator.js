

import { body, param } from "express-validator";

export const workspaceValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Workspace name is required")
    .isLength({ max: 50 })
    .withMessage("Name cannot exceed 50 characters"),
];

export const inviteMemberValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please enter a valid email"),
];

export const updateRoleValidator = [
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "member"])
    .withMessage("Role must be admin or member"),
];
