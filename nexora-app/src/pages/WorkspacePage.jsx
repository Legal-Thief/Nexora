import { useState } from 'react';
import useWorkspaceStore from '../store/workspaceStore';
import MemberList from '../components/workspace/MemberList';
import ProjectCard from '../components/workspace/ProjectCard';
import { Crown, Edit2, Trash2, Check, X, Info } from 'lucide-react';

export default function WorkspacePage() {
  const {
    activeWorkspace, projects, loading,
    updateWorkspace, deleteWorkspace,
  } = useWorkspaceStore();

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput]     = useState('');
  const [saving, setSaving]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!activeWorkspace) {
    return (
      <div className="p-8 min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
        Please select a workspace from the dashboard.
      </div>
    );
  }

  const handleRenameStart = () => {
    setNameInput(activeWorkspace.name);
    setEditingName(true);
  };

  const handleRenameSave = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try { await updateWorkspace(activeWorkspace._id, { name: nameInput.trim() }); }
    finally { setSaving(false); setEditingName(false); }
  };

  const handleDelete = async () => {
    await deleteWorkspace(activeWorkspace._id);
    setConfirmDelete(false);
  };

  return (
    <div className="p-8 min-h-screen bg-slate-950 text-slate-100 max-w-7xl mx-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"/>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-4xl font-bold border border-indigo-500/20">
              {activeWorkspace.name.charAt(0)}
            </div>
            <div>
              {editingName ? (
                <div className="flex items-center gap-2 mb-2">
                  <input
                    autoFocus value={nameInput}
                    onChange={e => setNameInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleRenameSave(); if (e.key === 'Escape') setEditingName(false); }}
                    className="bg-slate-800 border border-indigo-500 text-slate-100 text-xl font-bold px-3 py-1 rounded-lg focus:outline-none"
                  />
                  <button onClick={handleRenameSave} disabled={saving}
                    className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition disabled:opacity-50">
                    <Check size={16}/>
                  </button>
                  <button onClick={() => setEditingName(false)} disabled={saving}
                    className="p-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition">
                    <X size={16}/>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-slate-100">{activeWorkspace.name}</h1>
                  <button onClick={handleRenameStart}
                    className="p-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition"
                    title="Rename workspace">
                    <Edit2 size={16}/>
                  </button>
                </div>
              )}
              <p className="text-slate-400 max-w-xl">{activeWorkspace.description}</p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold border flex items-center gap-1.5
              ${activeWorkspace.plan === 'pro'
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
              {activeWorkspace.plan === 'pro' && <Crown size={16}/>}
              {activeWorkspace.plan.toUpperCase()} PLAN
            </span>

            {!confirmDelete ? (
              <button onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-1.5 rounded-lg transition">
                <Trash2 size={14}/> Delete Workspace
              </button>
            ) : (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-400">Are you sure?</span>
                <button onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition">Yes, delete</button>
                <button onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition">Cancel</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Workspace Projects</h2>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
              {[1,2].map(i => <div key={i} className="h-64 bg-slate-800 rounded-xl"/>)}
            </div>
          ) : projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map(project => <ProjectCard key={project._id} project={project}/>)}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl flex flex-col items-center">
              <Info className="text-slate-500 mb-3" size={32}/>
              <p className="text-slate-400">No projects in this workspace yet.</p>
            </div>
          )}
        </div>
        <div>
          <MemberList members={activeWorkspace.members}/>
        </div>
      </div>
    </div>
  );
}
