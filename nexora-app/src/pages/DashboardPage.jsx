import { resetNexoraData } from '../lib/resetDemo';
import { useEffect, useState } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import WorkspaceCard from '../components/workspace/WorkspaceCard';
import ProjectCard from '../components/workspace/ProjectCard';
import { Briefcase, Users, LayoutGrid, Plus, X } from 'lucide-react';

// ─── Inline Create-Workspace Modal ───────────────────────────────────────────
function CreateWorkspaceModal({ onClose, onSave }) {
  const [form, setForm] = useState({ name: '', description: '', plan: 'free' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('Workspace name is required.'); return; }
    setSaving(true);
    try { await onSave(form); onClose(); }
    catch (err) { setError(err.message); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-slate-100">Create Workspace</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"><X size={18}/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">{error}</p>}
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Workspace Name <span className="text-red-400">*</span></label>
            <input
              type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="e.g. Product Team"
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Description</label>
            <textarea
              value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="What is this workspace for?"
              rows={3}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition resize-none"
            />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1.5">Plan</label>
            <select value={form.plan} onChange={e => setForm(f => ({ ...f, plan: e.target.value }))}
              className="w-full bg-slate-800 border border-slate-700 text-slate-100 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition">
              <option value="free">Free</option>
              <option value="pro">Pro</option>
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-sm font-medium transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white rounded-lg text-sm font-medium transition">
              {saving ? 'Creating…' : 'Create Workspace'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const {
    workspaces, activeWorkspace, projects, loading,
    fetchWorkspaces, setActiveWorkspace, createWorkspace,
  } = useWorkspaceStore();

  const [showCreateWs, setShowCreateWs] = useState(false);

  useEffect(() => { fetchWorkspaces(); }, []);

  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const totalMembers        = activeWorkspace?.members?.length || 0;

  if (loading && workspaces.length === 0) {
    return (
      <div className="p-8 min-h-screen bg-slate-950 text-slate-100">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-slate-800 rounded w-48 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-slate-800 rounded-xl"/>)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-100">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Nexora</h1>
          <p className="text-slate-400">Select a workspace to view its projects.</p>
        </div>
        <button
          onClick={() => setShowCreateWs(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-lg shadow-indigo-500/20"
        >
          <Plus size={16}/> New Workspace
        </button>
      </div>

      {/* Workspaces */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
          <Briefcase className="text-indigo-400"/> Your Workspaces
        </h2>
        {workspaces.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-dashed border-slate-700 rounded-xl">
            <p className="text-slate-400 mb-4">No workspaces yet.</p>
            <button onClick={() => setShowCreateWs(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition">
              Create your first workspace
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map(ws => (
              <WorkspaceCard key={ws._id} workspace={ws}
                isActive={activeWorkspace?._id === ws._id}
                onClick={() => setActiveWorkspace(ws)}/>
            ))}
          </div>
        )}
      </div>

      {/* Active Workspace Stats + Projects */}
      {activeWorkspace && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[
              { label: 'Total Projects',     value: projects.length,      icon: LayoutGrid, color: 'indigo' },
              { label: 'Active Projects',    value: activeProjectsCount,  icon: Briefcase,  color: 'emerald' },
              { label: 'Workspace Members',  value: totalMembers,         icon: Users,      color: 'amber' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 p-6 rounded-xl flex items-center gap-4">
                <div className={`p-3 bg-${color}-500/10 text-${color}-400 rounded-lg`}><Icon size={24}/></div>
                <div>
                  <p className="text-sm text-slate-400">{label}</p>
                  <p className="text-2xl font-bold text-slate-100">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <LayoutGrid className="text-indigo-400"/> Recent Projects
            </h2>
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
                {[1,2,3].map(i => <div key={i} className="h-64 bg-slate-800 rounded-xl"/>)}
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.slice(0, 3).map(project => <ProjectCard key={project._id} project={project}/>)}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl">
                <p className="text-slate-400">No projects in this workspace yet.</p>
              </div>
            )}
          </div>
        </>
      )}
      {/* Reset Demo Data strip */}
      <div className="mt-12 pt-6 border-t border-slate-800/50 flex justify-end">
        <button
          onClick={() => { resetNexoraData(); window.location.reload(); }}
          className="text-xs text-slate-600 hover:text-slate-400 transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
          title="Removes nexora_workspaces and nexora_projects from localStorage"
        >
          ↺ Reset Demo Data
        </button>
      </div>


      {showCreateWs && (
        <CreateWorkspaceModal
          onClose={() => setShowCreateWs(false)}
          onSave={(data) => createWorkspace(data)}
        />
      )}
    </div>
  );
}


