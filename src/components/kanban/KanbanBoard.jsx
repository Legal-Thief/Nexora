import { useTaskStore } from '../../store/taskStore';
import KanbanColumn from './KanbanColumn';
import { COLUMNS, COLUMN_LABELS } from '../../constants/kanban';

export default function KanbanBoard({ onTaskClick }) {
  const {
    draggedTaskId,
    setDraggedTask,
    updateTaskStatus,
    getTasksByColumn,
  } = useTaskStore();

  const handleDragStart = (taskId) => setDraggedTask(taskId);
  const handleDragEnd   = ()       => setDraggedTask(null);
  const handleDrop      = (columnKey) => {
    if (draggedTaskId) {
      updateTaskStatus(draggedTaskId, columnKey);
      setDraggedTask(null);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-x-auto pb-6">
        <div className="flex gap-5 min-w-max h-full">
          {COLUMNS.map((columnKey) => (
            <KanbanColumn
              key={columnKey}
              columnKey={columnKey}
              label={COLUMN_LABELS[columnKey]}
              tasks={getTasksByColumn(columnKey)}
              onTaskClick={onTaskClick}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
