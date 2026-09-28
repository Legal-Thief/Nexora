

import { Calendar, AlertCircle } from "lucide-react";
import Avatar from "./Avatar.jsx";

function getPriorityClass(priority) {
  const map = {
    low: "badge-low",
    medium: "badge-medium",
    high: "badge-high",
    urgent: "badge-urgent",
  };
  return map[priority] || "badge";
}

function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function TaskCard({ task, onClick }) {
  const overdue = isOverdue(task.deadline) && task.status !== "done";

  return (
    <div className="task-card" onClick={onClick}>
      
      {task.labels && task.labels.length > 0 && (
        <div className="task-card-labels">
          {task.labels.slice(0, 3).map((label, i) => (
            <span key={i} className="task-label">{label}</span>
          ))}
        </div>
      )}

      
      <p className="task-card-title">{task.title}</p>

      
      <div className="task-card-meta">
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          
          <span className={`badge ${getPriorityClass(task.priority)}`} style={{ fontSize: "0.7rem", padding: "2px 8px" }}>
            {task.priority}
          </span>

          
          {task.deadline && (
            <span
              style={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                fontSize: "0.75rem",
                color: overdue ? "#ef4444" : "var(--text-muted)",
              }}
            >
              {overdue ? <AlertCircle size={12} /> : <Calendar size={12} />}
              {formatDate(task.deadline)}
            </span>
          )}
        </div>

        
        {task.assignee && (
          <Avatar user={task.assignee} size="sm" />
        )}
      </div>
    </div>
  );
}

export default TaskCard;
