

import { Folder, Users, CheckSquare, Calendar } from "lucide-react";
import Avatar from "./Avatar.jsx";

function getStatusClass(status) {
  const map = {
    planning: "badge-planning",
    active: "badge-active",
    completed: "badge-completed",
    archived: "badge-archived",
  };
  return map[status] || "badge";
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function ProjectCard({ project, onClick, onEdit, onDelete }) {
  return (
    <div className="project-card" onClick={onClick}>
      
      <div className="project-card-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Folder size={18} color="white" />
          </div>
          <div>
            <h3 className="project-card-title">{project.title}</h3>
          </div>
        </div>
        <span className={`badge ${getStatusClass(project.status)}`}>
          {project.status}
        </span>
      </div>

      
      {project.description && (
        <p className="project-card-desc">{project.description}</p>
      )}

      
      <div className="project-card-footer">
        <div className="project-card-meta">
          
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <CheckSquare size={13} />
            {project.completedCount || 0}/{project.taskCount || 0} tasks
          </span>

          
          <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Users size={13} />
            {project.members?.length || 0}
          </span>

          
          {project.deadline && (
            <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Calendar size={13} />
              {formatDate(project.deadline)}
            </span>
          )}
        </div>

        
        <div className="avatar-group">
          {(project.members || []).slice(0, 4).map((member) => (
            <Avatar
              key={member.user._id}
              user={member.user}
              size="sm"
            />
          ))}
        </div>
      </div>

      
      <div
        style={{ display: "flex", gap: 8, borderTop: "1px solid var(--border)", paddingTop: 12 }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="secondary-button" style={{ flex: 1, padding: "7px" }} onClick={onClick}>
          Open
        </button>
        {onEdit && (
          <button className="secondary-button" style={{ padding: "7px 14px" }} onClick={onEdit}>
            Edit
          </button>
        )}
        {onDelete && (
          <button className="danger-button" style={{ padding: "7px 14px" }} onClick={onDelete}>
            Delete
          </button>
        )}
      </div>
    </div>
  );
}

export default ProjectCard;
