

import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Notification from "../models/Notification.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ recipient: req.user._id })
    .populate("actor", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(50); 

  
  const unreadCount = notifications.filter((n) => !n.read).length;

  res.json({ notifications, unreadCount });
});

export const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    recipient: req.user._id, 
  });

  if (!notification) throw new ApiError(404, "Notification not found.");

  notification.read = true;
  await notification.save();

  res.json({ message: "Notification marked as read.", notification });
});

export const markAllRead = asyncHandler(async (req, res) => {
  await Notification.updateMany(
    { recipient: req.user._id, read: false },
    { read: true }
  );

  res.json({ message: "All notifications marked as read." });
});

export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findOneAndDelete({
    _id: req.params.id,
    recipient: req.user._id,
  });

  if (!notification) throw new ApiError(404, "Notification not found.");

  res.json({ message: "Notification deleted." });
});
