/**
 * ProjectBoard.jsx — Module 3
 *
 * Main page for the Kanban board.
 * Houses the board header, filter bar, KanbanBoard, and both modals.
 *
 * ──────────────────────────────────────────────
 * UI REDESIGN: Nexora SaaS dark theme.
 * ZERO changes to functionality, handlers, props, store, or routing.
 * ──────────────────────────────────────────────
 */

import { resetNexoraData } from '../lib/resetDemo';
import { useEffect, useState } from 'react';
import KanbanBoard from '../components/KanbanBoard';
import TaskModal from '../components/TaskModal';
import CreateTaskModal from '../components/CreateTaskModal';
import { useTaskStore } from '../store/taskStore';
import { Plus, Search, SlidersHorizontal, CheckCircle2, CircleDot, Clock, LayoutDashboard } from 'lucide-react';

const PROJECT_ID = 'proj_001';

export default function ProjectBoard() {
  const { fetchTasks, loading, tasks, filters, setFilters, clearFilters } = useTaskStore();
  const [selectedTask, setSelectedTask]     = useState(null);
  const [showCreateTask, setShowCreateTask] = useState(false);

  useEffect(() => { fetchTasks(PROJECT_ID); }, []);

  const handleTaskClick = (task) => setSelectedTask(task);

  const completedCount    = tasks.filter(t => t.status === 'DONE').length;
  const inProgressCount   = tasks.filter(t => t.status === 'IN_PROGRESS').length;
  const totalCount        = tasks.length;
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex flex-col">

      {/* ── Page content wrapper ──────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col p-6 lg:p-8 max-w-[1600px] mx-auto w-full">

        {/* ── Page Header ───────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          {/* Title block */}
          <div className="flex items-start gap-4">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl shrink-0">
              <LayoutDashboard className="text-indigo-400" size={22} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-100 leading-tight">
                Nexora v2.0 — Kanban Board
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Project <span className="font-mono text-slate-500 text-xs">{PROJECT_ID}</span>
              </p>
            </div>
          </div>

          {/* New Task CTA */}
          <button
            onClick={() => setShowCreateTask(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20 shrink-0"
          >
            <Plus size={16} />
            New Task
          </button>
        </div>

        {/* ── Summary Cards ─────────────────────────────────────────────── */}
        {!loading && totalCount > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: 'Total Tasks',
                value: totalCount,
                icon: CircleDot,
                color: 'text-slate-400',
                bg: 'bg-slate-500/10',
              },
              {
                label: 'In Progress',
                value: inProgressCount,
                icon: Clock,
                color: 'text-blue-400',
                bg: 'bg-blue-500/10',
              },
              {
                label: 'Completed',
                value: completedCount,
                icon: CheckCircle2,
                color: 'text-emerald-400',
                bg: 'bg-emerald-500/10',
              },
              {
                label: 'Completion',
                value: `${completionPercent}%`,
                icon: null,
                color: 'text-indigo-400',
                bg: 'bg-indigo-500/10',
                isProgress: true,
                percent: completionPercent,
              },
            ].map(({ label, value, icon: Icon, color, bg, isProgress, percent }) => (
              <div
                key={label}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center gap-3"
              >
                <div className={`p-2 rounded-lg ${bg} shrink-0`}>
                  {Icon ? (
                    <Icon size={18} className={color} />
                  ) : (
                    <span className={`text-sm font-bold ${color}`}>%</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                  <p className={`text-xl font-bold ${color}`}>{value}</p>
                  {isProgress && (
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500 rounded-full transition-all duration-700"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Filter Bar ────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3 mb-6 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks…"
              value={filters.search}
              onChange={e => setFilters({ search: e.target.value })}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg pl-8 pr-3 py-2 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition placeholder-slate-600"
            />
          </div>

          {/* Priority filter */}
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

          {/* Clear */}
          {(filters.search || filters.priority) && (
            <button
              onClick={clearFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 px-3 py-1.5 rounded-lg transition font-medium"
            >
              ✕ Clear filters
            </button>
          )}
        </div>

        {/* ── Board ─────────────────────────────────────────────────────── */}
        <div className="flex-1 min-h-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-4">
              <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-700 border-t-indigo-500" />
              <p className="text-slate-500 text-sm">Loading tasks…</p>
            </div>
          ) : (
            <KanbanBoard onTaskClick={handleTaskClick} />
          )}
        </div>

        {/* ── Reset Demo Data ───────────────────────────────────────────── */}
        <div className="flex justify-end mt-8 pt-4 border-t border-slate-800/40">
          <button
            onClick={() => { resetNexoraData(); window.location.reload(); }}
            className="text-xs text-slate-600 hover:text-slate-400 transition px-3 py-1.5 rounded-lg hover:bg-slate-800"
            title="Removes nexora_tasks from localStorage — page reloads with seed data"
          >
            ↺ Reset Demo Data
          </button>
        </div>
      </div>

      {/* ── Modals ────────────────────────────────────────────────────────── */}
      {selectedTask && (
        <TaskModal task={selectedTask} onClose={() => setSelectedTask(null)} />
      )}
      {showCreateTask && (
        <CreateTaskModal
          projectId={PROJECT_ID}
          onClose={() => setShowCreateTask(false)}
        />
      )}
    </div>
  );
}
