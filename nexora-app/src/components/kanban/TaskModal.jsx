import { useEffect, useState } from 'react';
import { X, CalendarDays, Clock, User, Edit2, Save, Trash2, AlertCircle } from 'lucide-react';
import { COLUMN_LABELS, ASSIGNEES } from '../../constants/kanban';
import { useTaskStore } from '../../store/taskStore';

// â”€â”€â”€ Style maps â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const priorityBadge = {
  urgent: 'bg-red-500/10 text-red-400 border border-red-500/20',
  high:   'bg-amber-500/10 text-amber-400 border border-amber-500/20',
  medium: 'bg-blue-500/10 text-blue-400 border border-blue-500/20',
  low:    'bg-slate-500/10 text-slate-400 border border-slate-600/20',
};

const statusBadge = {
  TODO:        'bg-slate-500/15 text-slate-300 border border-slate-600/30',
  IN_PROGRESS: 'bg-blue-500/15 text-blue-300 border border-blue-500/30',
  REVIEW:      'bg-violet-500/15 text-violet-300 border border-violet-500/30',
  DONE:        'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
};

// â”€â”€â”€ Reusable field label â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const FieldLabel = ({ children }) => (
  <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5">
    {children}
  </div>
);

// â”€â”€â”€ Select input style â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const selectCls = 'w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition cursor-pointer';

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function TaskModal({ task, onClose }) {
  const { updateTaskStatus, updateTask, deleteTask } = useTaskStore();

  const [editing,       setEditing]       = useState(false);
  const [saving,        setSaving]        = useState(false);
  const [deleting,      setDeleting]      = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error,         setError]         = useState('');

  const [form, setForm] = useState({
    title:       task?.title       || '',
    description: task?.description || '',
    priority:    task?.priority    || 'medium',
    status:      task?.status      || 'TODO',
    deadline:    task?.deadline ? task.deadline.slice(0, 10) : '',
    assigneeId:  task?.assignee?._id || '',
  });

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!task) return null;

  // Sync form when task changes externally
  useEffect(() => {
    setForm({
      title:       task.title       || '',
      description: task.description || '',
      priority:    task.priority    || 'medium',
      status:      task.status      || 'TODO',
      deadline:    task.deadline ? task.deadline.slice(0, 10) : '',
      assigneeId:  task.assignee?._id || '',
    });
  }, [task]);

  // â”€â”€ Handlers (unchanged) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleStatusChange = async (e) => { await updateTaskStatus(task._id, e.target.value); };

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    setError('');
    setSaving(true);
    try {
      const assignee = ASSIGNEES.find((a) => a._id === form.assigneeId) || null;
      await updateTask(task._id, {
        title:       form.title.trim(),
        description: form.description.trim(),
        priority:    form.priority,
        status:      form.status,
        deadline:    form.deadline || null,
        assignee,
      });
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try { await deleteTask(task._id); onClose(); }
    catch (err) { setError(err.message); setDeleting(false); }
  };

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[92vh] overflow-y-auto shadow-2xl shadow-black/50 flex flex-col">

        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800">
          <div className="flex-1 pr-4 min-w-0">
            {/* Badges row */}
            <div className="flex items-center flex-wrap gap-2 mb-3">
              <span className="font-mono text-[10px] text-slate-600 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                {task._id}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${priorityBadge[task.priority]}`}>
                {task.priority?.toUpperCase()}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[task.status]}`}>
                {COLUMN_LABELS[task.status]}
              </span>
            </div>

            {/* Title â€” view or edit */}
            {editing ? (
              <input
                autoFocus
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                className="w-full text-xl font-bold bg-slate-800 border border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 text-slate-100 px-3 py-2 rounded-xl focus:outline-none transition"
              />
            ) : (
              <h2 className="text-xl font-bold text-slate-100 leading-snug">{task.title}</h2>
            )}
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1 shrink-0">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)}
                  className="p-2 text-slate-500 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition"
                  title="Edit task">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setConfirmDelete(true)}
                  className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                  title="Delete task">
                  <Trash2 size={16} />
                </button>
              </>
            ) : (
              <>
                <button onClick={handleSave} disabled={saving}
                  className="p-2 text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition disabled:opacity-40"
                  title="Save changes">
                  <Save size={16} />
                </button>
                <button onClick={() => { setEditing(false); setError(''); }}
                  className="p-2 text-slate-500 hover:bg-slate-800 rounded-lg transition"
                  title="Cancel edit">
                  <X size={16} />
                </button>
              </>
            )}
            <div className="w-px h-5 bg-slate-700 mx-1" />
            <button onClick={onClose}
              className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition">
              <X size={18} />
            </button>
          </div>
        </div>

        {/* â”€â”€ Error banner â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {error && (
          <div className="mx-6 mt-4 flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2.5 rounded-xl">
            <AlertCircle size={15} className="shrink-0" /> {error}
          </div>
        )}

        {/* â”€â”€ Body â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="p-6 flex-1 flex flex-col md:flex-row gap-8">

          {/* Main column */}
          <div className="flex-1 min-w-0 space-y-6">
            {/* Description */}
            <div>
              <FieldLabel>Description</FieldLabel>
              {editing ? (
                <textarea
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={5}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 resize-none transition"
                />
              ) : (
                <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {task.description || (
                    <span className="text-slate-600 italic">No description provided.</span>
                  )}
                </p>
              )}
            </div>

            {/* Labels */}
            {task.labels && task.labels.length > 0 && (
              <div>
                <FieldLabel>Labels</FieldLabel>
                <div className="flex flex-wrap gap-2">
                  {task.labels.map((label) => (
                    <span key={label}
                      className="bg-slate-800 border border-slate-700 text-slate-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-full md:w-56 space-y-5 shrink-0">

            {/* Status */}
            <div>
              <FieldLabel>Status</FieldLabel>
              <select
                value={editing ? form.status : task.status}
                onChange={editing
                  ? e => setForm(f => ({ ...f, status: e.target.value }))
                  : handleStatusChange}
                className={selectCls}
              >
                {Object.entries(COLUMN_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            {/* Priority (edit mode only) */}
            {editing && (
              <div>
                <FieldLabel>Priority</FieldLabel>
                <select
                  value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  className={selectCls}
                >
                  {['urgent','high','medium','low'].map(p => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Assignee */}
            <div>
              <FieldLabel>Assignee</FieldLabel>
              {editing ? (
                <select
                  value={form.assigneeId}
                  onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}
                  className={selectCls}
                >
                  <option value="">Unassigned</option>
                  {ASSIGNEES.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              ) : (
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <div className="w-6 h-6 rounded-full bg-indigo-600/80 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                    {task.assignee
                      ? task.assignee.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
                      : <User size={12} />
                    }
                  </div>
                  <span className="font-medium">{task.assignee?.name || 'Unassigned'}</span>
                </div>
              )}
            </div>

            {/* Deadline */}
            <div>
              <FieldLabel>Deadline</FieldLabel>
              {editing ? (
                <input
                  type="date"
                  value={form.deadline}
                  onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition"
                />
              ) : (
                <div className="flex items-center gap-2 text-slate-300 text-sm">
                  <CalendarDays size={14} className="text-slate-500 shrink-0" />
                  <span className="font-medium">
                    {task.deadline
                      ? new Date(task.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })
                      : <span className="text-slate-600">No deadline</span>
                    }
                  </span>
                </div>
              )}
            </div>

            {/* Created */}
            <div>
              <FieldLabel>Created</FieldLabel>
              <div className="flex items-center gap-2 text-slate-400 text-sm">
                <Clock size={14} className="text-slate-500 shrink-0" />
                <span>{new Date(task.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

          </div>
        </div>

        {/* â”€â”€ Delete confirmation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        {confirmDelete && (
          <div className="mx-6 mb-6 p-4 bg-red-500/8 border border-red-500/25 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-red-300">Permanently delete this task? This cannot be undone.</p>
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setConfirmDelete(false)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete task'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

