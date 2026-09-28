

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import generateToken from "../utils/generateToken.js";
import User from "../models/User.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "An account with this email already exists.");
  }

  
  const user = await User.create({ name, email, password });

  
  const token = generateToken(user._id);

  res.status(201).json({
    message: "Account created successfully.",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.getAvatar(),
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  
  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new ApiError(401, "Incorrect email or password.");
  }

  
  const token = generateToken(user._id);

  res.json({
    message: "Logged in successfully.",
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.getAvatar(),
    },
  });
});

export const getMe = asyncHandler(async (req, res) => {
  
  const user = req.user;

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    avatar: user.getAvatar(),
  });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  
  const user = await User.findById(req.user._id);

  if (name) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;

  await user.save();

  res.json({
    message: "Profile updated.",
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.getAvatar(),
    },
  });
});
