import { useState } from 'react';
import TaskCard from './TaskCard';
import { Plus } from 'lucide-react';

const columnConfig = {
  TODO:        { dot: 'bg-slate-400',    header: 'border-slate-400/30',   bg: 'bg-slate-400/5'   },
  IN_PROGRESS: { dot: 'bg-blue-400',     header: 'border-blue-400/30',    bg: 'bg-blue-400/5'    },
  REVIEW:      { dot: 'bg-violet-400',   header: 'border-violet-400/30',  bg: 'bg-violet-400/5'  },
  DONE:        { dot: 'bg-emerald-400',  header: 'border-emerald-400/30', bg: 'bg-emerald-400/5' },
};

export default function KanbanColumn({
  columnKey, label, tasks,
  onTaskClick, onDrop, onDragStart, onDragEnd,
}) {
  const [isOver, setIsOver] = useState(false);
  const cfg = columnConfig[columnKey] || columnConfig.TODO;

  const handleDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!isOver) setIsOver(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsOver(false); };
  const handleDrop      = (e) => { e.preventDefault(); setIsOver(false); onDrop(columnKey); };

  return (
    <div className="flex flex-col w-[300px] xl:w-[320px] shrink-0">

      <div className={`flex items-center justify-between mb-3 px-1 pb-3 border-b ${cfg.header}`}>
        <div className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${cfg.dot} ring-2 ring-current ring-offset-2 ring-offset-slate-950`} />
          <h3 className="font-semibold text-slate-200 text-sm tracking-wide">{label}</h3>
        </div>
        <span className="bg-slate-800 border border-slate-700 text-slate-400 text-xs py-0.5 px-2.5 rounded-full font-medium tabular-nums">
          {tasks.length}
        </span>
      </div>

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          flex-1 min-h-[520px] rounded-xl p-2 flex flex-col transition-all duration-150
          ${isOver
            ? 'bg-indigo-500/5 ring-2 ring-indigo-500/40 ring-dashed'
            : `bg-slate-900/40 border border-slate-800/60 ${cfg.bg}`
          }
        `}
      >
        <div className="flex flex-col gap-2.5 flex-1">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onClick={onTaskClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))}
        </div>

        {tasks.length === 0 && !isOver && (
          <div className="flex-1 flex flex-col items-center justify-center py-8 opacity-40">
            <div className={`w-8 h-8 rounded-full ${cfg.dot} opacity-20 mb-2`} />
            <p className="text-slate-500 text-xs">Drop tasks here</p>
          </div>
        )}

        <button
          className="mt-3 w-full py-2 flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded-lg transition-all text-xs font-medium border border-transparent hover:border-slate-700"
        >
          <Plus size={13} />
          Add task
        </button>
      </div>
    </div>
  );
}
