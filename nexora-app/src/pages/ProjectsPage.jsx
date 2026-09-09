import { useState } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import ProjectCard from '../components/workspace/ProjectCard';
import { Search, Plus, X } from 'lucide-react';

// ─── Inline Create/Edit Project Modal ────────────────────────────────────────
function ProjectModal({ initial, onClose, onSave }) {
  const isEdit = Boolean(initial);
  const [form, setForm] = useState({
    name:        initial?.name        || '',
    description: initial?.description || '',
    emoji:       initial?.emoji       || '📌',
    status:      initial?.status      || 'active',
    deadline:    initial?.deadline ? initial.deadline.slice(0,10) : '',
  });
  const [saving, setSaving]   = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Project name is required.'); return; }
    setSaving(true);
    try {
      await onSave({ ...form, deadline: form.deadline || null });
      onClose();
    } catch (err) { setError(err.message); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}

          <div className="flex gap-3">
            <div className="w-20">
              <label className="block text-sm text-slate-400 mb-1.5">Emoji</label>
              <input type="text" value={form.emoji} maxLength={2}
                onChange={e => setForm(f => ({ ...f, emoji: e.target.value }))}
                className="w-full text-2xl text-center bg-slate-800 border border-slate-700 rounded-lg px-2 py-2 focus:outline-none focus:border-indigo-500"/>
            </div>
            <div className="flex-1">
              <label className="block text-sm text-slate-400 mb-1.5">Project Name <span className="text-red-400">*</span></label>
              <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Marketing Campaign"
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"/>
            </div>
          </div>

          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What is this project about?"
              rows={2}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Status</label>
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition">
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-1.5">Deadline</label>
              <input type="date" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"/>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition">
              {saving ? (isEdit ? 'Saving…' : 'Creating…') : (isEdit ? 'Save Changes' : 'Create Project')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Projects Page ────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const {
    activeWorkspace, projects, loading,
    createProject, updateProject, deleteProject,
  } = useWorkspaceStore();

  const [filter, setFilter]           = useState('all');
  const [search, setSearch]           = useState('');
  const [showModal, setShowModal]     = useState(false);
  const [editTarget, setEditTarget]   = useState(null);   // project being edited
  const [deleteTarget, setDeleteTarget] = useState(null); // project _id pending delete

  if (!activeWorkspace) {
    return (
      <div className="p-8 min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please select a workspace from the dashboard to view its projects.
      </div>
    );
  }

  const filteredProjects = projects.filter(p => {
    const matchesFilter = filter === 'all' || p.status === filter;
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleCreate = (data) => createProject(data);
  const handleEdit   = (data) => updateProject(editTarget._id, data);
  const handleDelete = async (id) => { await deleteProject(id); setDeleteTarget(null); };

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-100 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-slate-400">Manage projects for <span className="text-slate-200 font-medium">{activeWorkspace.name}</span></p>
        </div>
        <button onClick={() => { setEditTarget(null); setShowModal(true); }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition flex items-center gap-2 shadow-lg shadow-indigo-500/20">
          <Plus size={18}/> New Project
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        <div className="flex space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 w-full sm:w-auto">
          {['all','active','completed','paused'].map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium capitalize transition flex-1 sm:flex-none ${
                filter === s
                  ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-transparent'
              }`}>
              {s}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
          <input type="text" placeholder="Search projects…" value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 transition placeholder-slate-600"/>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-64 bg-slate-800 rounded-xl"/>)}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <ProjectCard key={project._id} project={project}
              onEdit={() => { setEditTarget(project); setShowModal(true); }}
              onDelete={() => setDeleteTarget(project._id)}/>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center">
          <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-slate-500"/>
          </div>
          <h3 className="text-lg font-medium text-slate-200 mb-1">No projects found</h3>
          <p className="text-slate-500 max-w-sm mx-auto">
            {(filter !== 'all' || search !== '')
              ? 'Try adjusting your search or clearing the status filter.'
              : 'Create your first project to get started.'}
          </p>
          {(filter !== 'all' || search !== '') && (
            <button onClick={() => { setFilter('all'); setSearch(''); }}
              className="mt-6 text-indigo-400 hover:text-indigo-300 text-sm font-medium">
              Clear all filters
            </button>
          )}
        </div>
      )}

      {/* Create / Edit Modal */}
      {showModal && (
        <ProjectModal
          initial={editTarget}
          onClose={() => { setShowModal(false); setEditTarget(null); }}
          onSave={editTarget ? handleEdit : handleCreate}
        />
      )}

      {/* Delete Confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-sm shadow-2xl text-center">
            <h3 className="text-lg font-bold text-slate-100 mb-2">Delete project?</h3>
            <p className="text-slate-400 text-sm mb-6">This will permanently remove the project and cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteTarget)}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

