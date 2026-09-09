import React from 'react';
import { Crown, Shield, User } from 'lucide-react';

export default function MemberList({ members }) {
  if (!members || members.length === 0) return null;

  const getRoleIcon = (role) => {
    switch(role) {
      case 'owner': return <Crown size={14} className="mr-1.5 text-amber-400" />;
      case 'admin': return <Shield size={14} className="mr-1.5 text-indigo-400" />;
      default: return <User size={14} className="mr-1.5 text-slate-400" />;
    }
  };

  const getRoleBadgeColor = (role) => {
    switch(role) {
      case 'owner': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'admin': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  return (
    <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <h3 className="font-semibold text-slate-100">Team Members</h3>
        <span className="bg-slate-800 text-slate-300 text-xs px-2 py-1 rounded-md font-medium">
          {members.length} Total
        </span>
      </div>
      
      <div className="divide-y divide-slate-800/50">
        {members.map(member => (
          <div key={member._id || member.id || member.email} className="flex items-center justify-between p-4 hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-sm border border-indigo-500/30">
                {member.name ? member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : '?'}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-200">{member.name}</p>
                <p className="text-xs text-slate-500">{member.email}</p>
              </div>
            </div>
            
            <div className={`flex items-center px-2.5 py-1 rounded-md border text-xs font-medium capitalize ${getRoleBadgeColor(member.role)}`}>
              {getRoleIcon(member.role)}
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

