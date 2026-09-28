

import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "task_created",
        "task_updated",
        "task_moved",
        "task_deleted",
        "comment_added",
        "member_added",
      ],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

activitySchema.index({ project: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
