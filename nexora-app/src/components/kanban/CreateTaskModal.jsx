/**
 * CreateTaskModal.jsx â€” Module 3
 *
 * Modal form for creating a new task.
 * Calls taskStore.createTask() â†’ taskService.createTask() â†’ localStorage.
 *
 * Props:
 *   projectId â€” the project to create the task in
 *   onClose   â€” close handler
 *
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 * UI REDESIGN: Nexora SaaS dark theme.
 * ZERO changes to state, handlers, or logic.
 * â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
 */

import { useState } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { ASSIGNEES } from '../../constants/kanban';
import { useTaskStore } from '../../store/taskStore';

// â”€â”€â”€ Shared input style â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const inputCls =
  'w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition placeholder-slate-600';

const FieldLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
    {children} {required && <span className="text-red-400 normal-case">*</span>}
  </label>
);

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export default function CreateTaskModal({ projectId, onClose }) {
  const { createTask } = useTaskStore();

  const [form, setForm] = useState({
    title:       '',
    description: '',
    priority:    'medium',
    deadline:    '',
    assigneeId:  '',
    labels:      '',
  });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  // â”€â”€ Handler (unchanged) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) { setError('Task title is required.'); return; }
    setError('');
    setSaving(true);
    try {
      const assignee = ASSIGNEES.find((a) => a._id === form.assigneeId) || null;
      const labels   = form.labels
        .split(',')
        .map((l) => l.trim().toLowerCase())
        .filter(Boolean);

      await createTask(projectId, {
        title:       form.title.trim(),
        description: form.description.trim(),
        priority:    form.priority,
        deadline:    form.deadline || null,
        assignee,
        labels,
      });
      onClose();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  // â”€â”€ Render â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg shadow-2xl shadow-black/50 overflow-hidden">

        {/* â”€â”€ Header â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-1.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <Plus size={16} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">New Task</h2>
              <p className="text-xs text-slate-500 mt-0.5">Added to the <span className="font-mono text-slate-600">TODO</span> column</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-500 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* â”€â”€ Form â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-400 text-sm px-3 py-2.5 rounded-xl">
              <AlertCircle size={15} className="shrink-0" /> {error}
            </div>
          )}

          {/* Title */}
          <div>
            <FieldLabel required>Title</FieldLabel>
            <input
              autoFocus
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Implement authentication flow"
              className={inputCls}
            />
          </div>

          {/* Description */}
          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe what needs to be done..."
              rows={3}
              className={`${inputCls} resize-none`}
            />
          </div>

          {/* Priority + Assignee */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Priority</FieldLabel>
              <select
                value={form.priority}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                className={inputCls}
              >
                <option value="urgent">ðŸ”´ Urgent</option>
                <option value="high">ðŸŸ  High</option>
                <option value="medium">ðŸŸ¡ Medium</option>
                <option value="low">âšª Low</option>
              </select>
            </div>
            <div>
              <FieldLabel>Assignee</FieldLabel>
              <select
                value={form.assigneeId}
                onChange={e => setForm(f => ({ ...f, assigneeId: e.target.value }))}
                className={inputCls}
              >
                <option value="">Unassigned</option>
                {ASSIGNEES.map(a => (
                  <option key={a._id} value={a._id}>{a.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Deadline + Labels */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel>Deadline</FieldLabel>
              <input
                type="date"
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className={inputCls}
              />
            </div>
            <div>
              <FieldLabel>Labels</FieldLabel>
              <input
                type="text"
                value={form.labels}
                onChange={e => setForm(f => ({ ...f, labels: e.target.value }))}
                placeholder="frontend, bug, api"
                className={inputCls}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-800 pt-2" />

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-sm font-medium transition border border-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2"
            >
              <Plus size={15} />
              {saving ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

