

import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import User from "../models/User.js";

const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized. Please log in.");
  }

  
  const token = authHeader.split(" ")[1];

  
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
  const user = await User.findById(decoded.id).select("-password");

  if (!user) {
    throw new ApiError(401, "User not found.");
  }

  
  req.user = user;

  
  next();
});

export { protect };
