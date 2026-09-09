import { CalendarDays, AlertTriangle } from 'lucide-react';

// ─── Priority config ──────────────────────────────────────────────────────────
const priorityConfig = {
  urgent: {
    border:  'border-l-red-500',
    badge:   'bg-red-500/10 text-red-400 border-red-500/20',
    label:   'Urgent',
  },
  high: {
    border:  'border-l-amber-500',
    badge:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
    label:   'High',
  },
  medium: {
    border:  'border-l-blue-500',
    badge:   'bg-blue-500/10 text-blue-400 border-blue-500/20',
    label:   'Medium',
  },
  low: {
    border:  'border-l-slate-600',
    badge:   'bg-slate-500/10 text-slate-400 border-slate-600/20',
    label:   'Low',
  },
};

const getInitials = (name) =>
  name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '?';

// ─── Avatar colour by user ID (deterministic) ─────────────────────────────────
const avatarColors = {
  user_001: 'bg-indigo-600',
  user_002: 'bg-violet-600',
  user_003: 'bg-emerald-700',
  user_004: 'bg-amber-700',
};

// ──────────────────────────────────────────────────────────────────────────────
// TaskCard
// Logic: identical (draggable, onClick). Only visual markup changed.
// ──────────────────────────────────────────────────────────────────────────────

export default function TaskCard({ task, onClick, onDragStart, onDragEnd }) {
  const cfg = priorityConfig[task.priority] || priorityConfig.low;

  const handleDragStart = (e) => {
    // Required for Firefox DnD compatibility
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(task._id);
  };

  const isOverdue =
    task.deadline &&
    new Date(task.deadline) < new Date() &&
    task.status !== 'DONE';

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={onDragEnd}
      onClick={() => onClick(task)}
      className={`
        group relative bg-slate-900 rounded-xl p-3.5 cursor-grab active:cursor-grabbing
        border border-slate-800 border-l-4 ${cfg.border}
        hover:border-slate-700 hover:shadow-lg hover:shadow-black/20
        hover:-translate-y-0.5 active:translate-y-0
        transition-all duration-150 select-none
      `}
    >
      {/* ── Labels ─────────────────────────────────────────────────── */}
      {task.labels && task.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2.5">
          {task.labels.map((label) => (
            <span
              key={label}
              className="text-[10px] uppercase font-semibold tracking-wider bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded-md"
            >
              {label}
            </span>
          ))}
        </div>
      )}

      {/* ── Title ──────────────────────────────────────────────────── */}
      <h4 className="text-slate-100 text-sm font-medium leading-snug line-clamp-2 mb-3 group-hover:text-white transition-colors">
        {task.title}
      </h4>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between mt-auto">

        {/* Assignee avatar */}
        <div>
          {task.assignee ? (
            <div
              className={`w-6 h-6 rounded-full ${avatarColors[task.assignee._id] || 'bg-slate-700'} flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-slate-900`}
              title={task.assignee.name}
            >
              {getInitials(task.assignee.name)}
            </div>
          ) : (
            <div
              className="w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] text-slate-500 ring-2 ring-slate-900"
              title="Unassigned"
            >
              —
            </div>
          )}
        </div>

        {/* Right side: deadline + priority badge */}
        <div className="flex items-center gap-2">
          {/* Urgent flag */}
          {task.priority === 'urgent' && (
            <AlertTriangle size={12} className="text-red-400 shrink-0" />
          )}

          {/* Deadline */}
          {task.deadline && (
            <div
              className={`flex items-center gap-1 text-[11px] font-medium ${
                isOverdue ? 'text-red-400' : 'text-slate-500'
              }`}
            >
              <CalendarDays size={11} className="shrink-0" />
              <span>
                {new Date(task.deadline).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          )}

          {/* Priority badge (non-urgent only — urgent already flagged above) */}
          {task.priority !== 'urgent' && (
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border ${cfg.badge} hidden group-hover:inline-flex transition-all`}>
              {cfg.label}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
