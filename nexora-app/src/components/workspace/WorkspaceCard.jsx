import React from 'react';
import { Users, Crown } from 'lucide-react';

export default function WorkspaceCard({ workspace, onClick, isActive }) {
  if (!workspace) return null;

  return (
    <div 
      onClick={onClick}
      className={`relative p-6 rounded-xl border cursor-pointer transition-all duration-200 
        ${isActive 
          ? 'bg-slate-900 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.1)]' 
          : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
        }`}
    >
      {isActive && (
        <div className="absolute top-0 right-0 p-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
        </div>
      )}
      
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center text-xl font-bold border border-indigo-500/20">
          {workspace.name.charAt(0)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-slate-100 truncate">{workspace.name}</h3>
          <p className="text-sm text-slate-400 truncate">{workspace.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <Users size={16} />
          <span>{workspace.members.length} Members</span>
        </div>
        
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
          workspace.plan === 'pro' 
            ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
            : 'bg-slate-800 text-slate-300 border-slate-700'
        }`}>
          {workspace.plan === 'pro' && <Crown size={12} className="inline mr-1 mb-0.5" />}
          {workspace.plan.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

