import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Search, SlidersHorizontal, CheckCircle2, CircleDot, Clock, Kanban, ArrowLeft, User } from 'lucide-react';
import KanbanBoard     from '../components/kanban/KanbanBoard';
import TaskModal       from '../components/kanban/TaskModal';
import CreateTaskModal from '../components/kanban/CreateTaskModal';
import { useTaskStore } from '../store/taskStore';
import useWorkspaceStore from '../store/workspaceStore';
import { ASSIGNEES } from '../constants/kanban';

export default function BoardPage() {
  const { projectId: paramProjectId } = useParams();
  const PROJECT_ID = paramProjectId || 'proj_001';

  const { fetchTasks, loading, tasks, filters, setFilters, clearFilters } = useTaskStore();
  const { projects } = useWorkspaceStore();
  const navigate = useNavigate();

  const [selectedTask,  setSelectedTask]  = useState(null);
  const [showCreate,    setShowCreate]    = useState(false);

  useEffect(() => { fetchTasks(PROJECT_ID); }, [PROJECT_ID]);

  const project = projects.find(p => p._id === PROJECT_ID);

  const completedCount    = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount   = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const totalCount        = tasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">
      <div className="flex-1 flex flex-col p-6 lg:p-8 max-w-[1600px] mx-auto w-full">

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shrink-0">
              <Kanban className="text-indigo-400" size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                {paramProjectId && (
                  <button
                    onClick={() => navigate('/projects')}
                    className="flex items-center gap-1 text-slate-500 hover:text-slate-300 text-xs transition"
                  >
                    <ArrowLeft size={12} /> Projects
                  </button>
                )}
              </div>
              <h1 className="text-2xl font-bold text-slate-100 leading-tight">
                {project ? project.name : 'Kanban Board'}
              </h1>
              <p className="text-slate-400 text-sm mt-0.5">
                {project?.description || (
                  <span className="font-mono text-slate-500 text-xs">{PROJECT_ID}</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus size={16} /> New Task
          </button>
        </div>

        {!loading && totalCount > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              { label: 'Total Tasks',  value: totalCount,       icon: CircleDot,    color: 'text-slate-400',   bg: 'bg-slate-500/10' },
              { label: 'In Progress',  value: inProgressCount,  icon: Clock,        color: 'text-blue-400',    bg: 'bg-blue-500/10' },
              { label: 'Completed',    value: completedCount,   icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Completion',   value: `${completionPercent}%`, icon: null,  color: 'text-indigo-400',  bg: 'bg-indigo-500/10', isProgress: true, percent: completionPercent },
            ].map(({ label, value, icon: Icon, color, bg, isProgress, percent }) => (
              <div key={label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${bg} shrink-0`}>
                  {Icon
                    ? <Icon size={18} className={color} />
                    : <span className={`text-sm font-bold ${color}`}>%</span>
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  {isProgress && (
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-700" style={{ width: `${percent}%` }} />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-3 mb-6 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text" placeholder="Search tasks…"
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition placeholder-slate-600"
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-slate-500 shrink-0" />
            <select
              value={filters.priority}
              onChange={e => setFilters({ priority: e.target.value })}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition cursor-pointer"
            >
              <option value="">All priorities</option>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟠 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">⚪ Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <User size={14} className="text-slate-500 shrink-0" />
            <select
              value={filters.assignee}
              onChange={e => setFilters({ assignee: e.target.value })}
              className="bg-slate-800 border border-slate-700 text-slate-300 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition cursor-pointer"
            >
              <option value="">All assignees</option>
              {ASSIGNEES.map(a => (
                <option key={a._id} value={a._id}>👤 {a.name}</option>
              ))}
            </select>
          </div>

          {(filters.search || filters.priority || filters.assignee) && (
            <button onClick={clearFilters} className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition font-medium">
              ✕ Clear
            </button>
          )}
        </div>

        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-indigo-500" />
              <p className="text-slate-500 text-sm">Loading tasks…</p>
            </div>
          ) : (
            <KanbanBoard onTaskClick={task => setSelectedTask(task)} />
          )}
        </div>
      </div>

      {selectedTask && <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
      {showCreate && <CreateTaskModal projectId={PROJECT_ID} onClose={() => setShowCreate(false)} />}
    </div>
  );
}
