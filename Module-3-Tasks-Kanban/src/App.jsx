import { BrowserRouter, Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { useEffect } from 'react';
import useTaskStore from './store/taskStore';
import ProjectBoard from './pages/ProjectBoard';
import { LayoutDashboard, Kanban } from 'lucide-react';

// ─── Nexora Navbar ────────────────────────────────────────────────────────────
// Matches Module 2's navbar design: dark bg, indigo brand, active indigo pill.
function NavBar() {
  const { tasks } = useTaskStore();
  const doneTasks  = tasks.filter(t => t.status === 'DONE').length;
  const totalTasks = tasks.length;

  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`;

  return (
    <nav className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm">
      {/* Left — branding + links */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <Kanban size={14} className="text-white" />
          </div>
          <span className="text-slate-100 font-bold text-sm tracking-tight">Nexora</span>
          <span className="text-slate-600 text-xs font-medium ml-0.5">/ Tasks</span>
        </div>

        <div className="flex items-center gap-1">
          <NavLink to="/board" className={linkClass}>
            <LayoutDashboard size={14} />
            Kanban Board
          </NavLink>
        </div>
      </div>

      {/* Right — task progress pill */}
      {totalTasks > 0 && (
        <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-slate-300 font-medium">{doneTasks}</span>
            <span className="text-slate-500">/ {totalTasks} done</span>
          </div>
          <div className="w-20 h-1 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full transition-all duration-500"
              style={{ width: `${totalTasks ? (doneTasks / totalTasks) * 100 : 0}%` }}
            />
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const { fetchTasks } = useTaskStore();
  useEffect(() => { fetchTasks('proj_001'); }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 flex flex-col">
        <NavBar />
        <div className="flex-1">
          <Routes>
            <Route path="/"      element={<Navigate to="/board" replace />} />
            <Route path="/board" element={<ProjectBoard />} />
            <Route path="*"      element={<Navigate to="/board" replace />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
