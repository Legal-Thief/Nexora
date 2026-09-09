import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, Kanban, Users, Calendar, CheckCircle2 } from 'lucide-react';

const statusColors = {
  active:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  paused:    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  completed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
};

export default function ProjectCard({ project, onEdit, onDelete }) {
  const navigate = useNavigate();
  const pct = project.tasksTotal > 0
    ? Math.round((project.tasksDone / project.tasksTotal) * 100)
    : 0;

  return (
    <div className="group bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-slate-700 hover:shadow-lg hover:shadow-black/20 transition-all duration-200 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">{project.emoji || '📌'}</span>
          <div className="min-w-0">
            <h3 className="font-semibold text-slate-100 truncate">{project.name}</h3>
            <p className="text-xs text-slate-500 truncate mt-0.5">{project.description}</p>
          </div>
        </div>
        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${statusColors[project.status] || statusColors.active}`}>
          {project.status}
        </span>
      </div>

      {/* Progress */}
      <div>
        <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
          <span className="flex items-center gap-1">
            <CheckCircle2 size={11} className="text-emerald-500" />
            {project.tasksDone} / {project.tasksTotal} tasks
          </span>
          <span className="font-semibold text-slate-400">{pct}%</span>
        </div>
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-slate-500">
        <span className="flex items-center gap-1.5">
          <Users size={12} />
          {project.members?.length || 0} members
        </span>
        {project.deadline && (
          <span className="flex items-center gap-1.5">
            <Calendar size={12} />
            {new Date(project.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-1 border-t border-slate-800/60">
        {/* Open Board — primary integration link */}
        <button
          onClick={() => navigate(`/board/${project._id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600/10 hover:bg-indigo-600 text-indigo-400 hover:text-white rounded-lg text-xs font-semibold border border-indigo-500/20 hover:border-indigo-600 transition-all"
        >
          <Kanban size={13} />
          Open Board
        </button>

        {onEdit && (
          <button
            onClick={() => onEdit(project)}
            className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
            title="Edit project"
          >
            <Edit2 size={14} />
          </button>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(project._id)}
            className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
            title="Delete project"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
