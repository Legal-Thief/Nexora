

import { body } from "express-validator";

export const projectValidator = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Project title is required")
    .isLength({ max: 100 })
    .withMessage("Title cannot exceed 100 characters"),

  body("description")
    .optional()
    .isLength({ max: 1000 })
    .withMessage("Description cannot exceed 1000 characters"),

  body("status")
    .optional()
    .isIn(["planning", "active", "completed", "archived"])
    .withMessage("Status must be planning, active, completed, or archived"),
];

export const addProjectMemberValidator = [
  body("userId")
    .notEmpty()
    .withMessage("User ID is required"),

  body("role")
    .optional()
    .isIn(["manager", "developer", "designer", "qa"])
    .withMessage("Invalid project role"),
];
