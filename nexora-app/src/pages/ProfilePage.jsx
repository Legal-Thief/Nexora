import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Edit2, LogOut, Save, X, ShieldCheck } from 'lucide-react';
import { resetNexoraData } from '../lib/resetDemo';
import useAuthStore from '../store/authStore';

export default function ProfilePage() {
  const { user, updateProfile, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="text-slate-400">Not logged in</div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateProfile({ name: editName });
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name) =>
    name.split(' ').map((n) => n[0]).join('').toUpperCase().substring(0, 2);

  // workspaceRole badge colour
  const roleBadge = {
    owner:  'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
    admin:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
    member: 'bg-slate-700/50 text-slate-300 border-slate-600/50',
  };

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Your Profile</h1>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
          <div className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
              {/* Avatar */}
              <div className="w-24 h-24 rounded-full bg-indigo-600 flex items-center justify-center text-3xl font-bold text-white shrink-0 overflow-hidden">
                {user.profilePicture ? (
                  <img src={user.profilePicture} alt={user.name} className="w-full h-full rounded-full object-cover" />
                ) : (
                  getInitials(user.name)
                )}
              </div>

              {/* Info */}
              <div className="flex-1 text-center md:text-left space-y-4 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="bg-slate-800 border border-slate-700 text-white px-3 py-1.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                          onClick={handleSave}
                          disabled={loading}
                          className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Save size={16} />
                        </button>
                        <button
                          onClick={() => { setIsEditing(false); setEditName(user.name); }}
                          disabled={loading}
                          className="p-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center md:justify-start gap-3">
                        <h2 className="text-2xl font-semibold text-white">{user.name}</h2>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-slate-400 hover:text-white transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                      </div>
                    )}
                    <div className="flex items-center justify-center md:justify-start gap-2 text-slate-400">
                      <User size={16} />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  {/* Role badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-sm capitalize self-center md:self-start ${roleBadge[user.workspaceRole] || roleBadge.member}`}>
                    <ShieldCheck size={14} />
                    {user.workspaceRole}
                  </div>
                </div>

                {/* Account Details */}
                <div className="pt-6 border-t border-slate-800">
                  <h3 className="text-sm font-medium text-slate-300 mb-3">Account Details</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-slate-500">User ID</div>
                      <div className="text-slate-300 font-mono mt-1 text-xs">{user._id}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Workspace Role</div>
                      <div className="text-slate-300 mt-1 capitalize">{user.workspaceRole}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Project Role</div>
                      <div className="text-slate-300 mt-1 capitalize">{user.projectRole?.replace('_', ' ')}</div>
                    </div>
                    <div>
                      <div className="text-slate-500">Joined</div>
                      <div className="text-slate-300 mt-1">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-800/50 p-4 border-t border-slate-800 flex items-center justify-between">
            <button
              onClick={() => { resetNexoraData(); window.location.reload(); }}
              className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-slate-300 hover:bg-slate-700 rounded-lg transition-colors text-xs font-medium"
              title="Clears nexora_users, nexora_credentials, nexora_token from localStorage"
            >
              ↺ Reset Demo Data
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors font-medium text-sm"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


