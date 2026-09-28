

import "dotenv/config";
import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";
import errorHandler from "./middleware/error.js";

import authRoutes         from "./routes/auth.js";
import workspaceRoutes    from "./routes/workspace.js";
import projectRoutes      from "./routes/project.js";
import taskRoutes         from "./routes/task.js";
import notificationRoutes from "./routes/notification.js";
import invitationRoutes   from "./routes/invitation.js";

const app = express();

connectDB();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Nexora server is running." });
});

app.use("/api/auth",          authRoutes);
app.use("/api/workspaces",    workspaceRoutes);
app.use("/api",               projectRoutes);   
app.use("/api",               taskRoutes);      
app.use("/api/notifications", notificationRoutes);
app.use("/api/invitations",   invitationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Nexora server running on http://localhost:${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
