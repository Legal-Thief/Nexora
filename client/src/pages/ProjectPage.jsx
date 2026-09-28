

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, ArrowLeft, Clock, Trash2, Edit2, Send } from 'lucide-react';
import TaskCard from '../components/TaskCard.jsx';
import Modal from '../components/Modal.jsx';
import Avatar from '../components/Avatar.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { getProject } from '../api/project.js';
import {
  getTasks, createTask, updateTask, deleteTask,
  getComments, addComment, deleteComment,
} from '../api/task.js';

const COLUMNS = [
  { id: 'todo',        label: 'TO DO',       className: 'col-todo' },
  { id: 'in_progress', label: 'IN PROGRESS', className: 'col-in-progress' },
  { id: 'review',      label: 'REVIEW',      className: 'col-review' },
  { id: 'done',        label: 'DONE',        className: 'col-done' },
];

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function ProjectPage() {
  const { id: projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);

  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState('todo');
  const [createTitle, setCreateTitle] = useState('');
  const [createDescription, setCreateDescription] = useState('');
  const [createPriority, setCreatePriority] = useState('medium');
  const [createAssignee, setCreateAssignee] = useState('');
  const [createDeadline, setCreateDeadline] = useState('');
  const [createLabels, setCreateLabels] = useState('');
  const [createLoading, setCreateLoading] = useState(false);

  
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editStatus, setEditStatus] = useState('');
  const [editPriority, setEditPriority] = useState('');
  const [editAssignee, setEditAssignee] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editLabels, setEditLabels] = useState('');
  const [editLoading, setEditLoading] = useState(false);

  
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);

  
  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [projectRes, tasksRes] = await Promise.all([
        getProject(projectId),
        getTasks(projectId),
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load project.');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  
  const openTask = async (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
    setEditMode(false);
    setCommentText('');
    try {
      const res = await getComments(task._id);
      setComments(res.data.comments || []);
    } catch (err) {
      setComments([]);
    }
  };

  const closeTaskModal = () => {
    setShowTaskModal(false);
    setSelectedTask(null);
    setEditMode(false);
  };

  
  const openCreateModal = (status) => {
    setCreateStatus(status);
    setCreateTitle('');
    setCreateDescription('');
    setCreatePriority('medium');
    setCreateAssignee('');
    setCreateDeadline('');
    setCreateLabels('');
    setShowCreateModal(true);
  };

  
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setCreateLoading(true);
    try {
      const labels = createLabels.split(',').map((l) => l.trim()).filter(Boolean);
      const res = await createTask(projectId, {
        title: createTitle,
        description: createDescription,
        status: createStatus,
        priority: createPriority,
        assignee: createAssignee || null,
        deadline: createDeadline || null,
        labels,
      });
      
      setTasks((prev) => [res.data.task, ...prev]);
      setShowCreateModal(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create task.');
    } finally {
      setCreateLoading(false);
    }
  };

  
  const startEdit = () => {
    setEditTitle(selectedTask.title);
    setEditDescription(selectedTask.description || '');
    setEditStatus(selectedTask.status);
    setEditPriority(selectedTask.priority);
    setEditAssignee(selectedTask.assignee?._id || '');
    setEditDeadline(selectedTask.deadline ? selectedTask.deadline.slice(0, 10) : '');
    setEditLabels((selectedTask.labels || []).join(', '));
    setEditMode(true);
  };

  
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      const labels = editLabels.split(',').map((l) => l.trim()).filter(Boolean);
      const res = await updateTask(selectedTask._id, {
        title: editTitle,
        description: editDescription,
        status: editStatus,
        priority: editPriority,
        assignee: editAssignee || null,
        deadline: editDeadline || null,
        labels,
      });
      const updatedTask = res.data.task;
      
      setTasks((prev) => prev.map((t) => (t._id === updatedTask._id ? updatedTask : t)));
      setSelectedTask(updatedTask);
      setEditMode(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update task.');
    } finally {
      setEditLoading(false);
    }
  };

  
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await updateTask(taskId, { status: newStatus });
      const updatedTask = res.data.task;
      setTasks((prev) => prev.map((t) => (t._id === taskId ? updatedTask : t)));
      setSelectedTask(updatedTask);
    } catch (err) {
      alert('Failed to update task status.');
    }
  };

  
  const handleDeleteTask = async () => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await deleteTask(selectedTask._id);
      setTasks((prev) => prev.filter((t) => t._id !== selectedTask._id));
      closeTaskModal();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete task.');
    }
  };

  
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setCommentLoading(true);
    try {
      const res = await addComment(selectedTask._id, commentText);
      
      setComments((prev) => [...prev, res.data.comment]);
      setCommentText('');
    } catch (err) {
      alert('Failed to add comment.');
    } finally {
      setCommentLoading(false);
    }
  };

  
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      alert('Failed to delete comment.');
    }
  };

  
  const getTasksForColumn = (status) => tasks.filter((t) => t.status === status);

  const projectMembers = project?.members || [];

  

  if (loading) {
    return <div className="page-loading"><div className="spinner" /></div>;
  }

  if (error) {
    return (
      <div>
        <div className="error-message">{error}</div>
        <button className="secondary-button" onClick={() => navigate('/app/projects')}>
          <ArrowLeft size={16} /> Back to Projects
        </button>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      <div className="page-header">
        <div>
          <button
            className="icon-button"
            onClick={() => navigate('/app/projects')}
            style={{ marginBottom: 8 }}
            title="Back to projects"
          >
            <ArrowLeft size={16} />
          </button>
          <h1 className="page-title">{project?.title}</h1>
          {project?.description && (
            <p className="page-subtitle">{project.description}</p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={`badge badge-${project?.status}`}>{project?.status}</span>
          {project?.deadline && (
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={13} /> Due {formatDate(project.deadline)}
            </span>
          )}
        </div>
      </div>

      
      <div className="kanban-board">
        {COLUMNS.map((column) => {
          const columnTasks = getTasksForColumn(column.id);
          return (
            <div key={column.id} className={`kanban-column ${column.className}`}>
              
              <div className="kanban-column-header">
                <span className="kanban-column-title">{column.label}</span>
                <span className="kanban-column-count">{columnTasks.length}</span>
              </div>

              
              <div className="kanban-column-body">
                {columnTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onClick={() => openTask(task)}
                  />
                ))}
              </div>

              
              <button
                className="kanban-add-button"
                onClick={() => openCreateModal(column.id)}
              >
                <Plus size={14} /> Add task
              </button>
            </div>
          );
        })}
      </div>

      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Task"
      >
        <form onSubmit={handleCreateTask}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="input"
                placeholder="What needs to be done?"
                value={createTitle}
                onChange={(e) => setCreateTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="input"
                rows={2}
                placeholder="Optional details"
                value={createDescription}
                onChange={(e) => setCreateDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select className="input" value={createPriority} onChange={(e) => setCreatePriority(e.target.value)}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Assignee</label>
                <select className="input" value={createAssignee} onChange={(e) => setCreateAssignee(e.target.value)}>
                  <option value="">Unassigned</option>
                  {projectMembers.map((m) => (
                    <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Deadline</label>
                <input
                  type="date"
                  className="input"
                  value={createDeadline}
                  onChange={(e) => setCreateDeadline(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Labels (comma-separated)</label>
                <input
                  className="input"
                  placeholder="bug, feature, design"
                  value={createLabels}
                  onChange={(e) => setCreateLabels(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="secondary-button" onClick={() => setShowCreateModal(false)}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={createLoading}>
              {createLoading ? 'Creating...' : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      
      {selectedTask && (
        <Modal
          isOpen={showTaskModal}
          onClose={closeTaskModal}
          title={editMode ? 'Edit Task' : 'Task Details'}
          size="large"
        >
          {editMode ? (
            
            <form onSubmit={handleSaveEdit}>
              <div className="modal-body">
                <div className="form-group">
                  <label className="form-label">Title *</label>
                  <input
                    className="input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                    autoFocus
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea
                    className="input"
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="form-group">
                    <label className="form-label">Status</label>
                    <select className="input" value={editStatus} onChange={(e) => setEditStatus(e.target.value)}>
                      <option value="todo">To Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Done</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority</label>
                    <select className="input" value={editPriority} onChange={(e) => setEditPriority(e.target.value)}>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Assignee</label>
                    <select className="input" value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)}>
                      <option value="">Unassigned</option>
                      {projectMembers.map((m) => (
                        <option key={m.user._id} value={m.user._id}>{m.user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Deadline</label>
                    <input
                      type="date"
                      className="input"
                      value={editDeadline}
                      onChange={(e) => setEditDeadline(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Labels (comma-separated)</label>
                  <input
                    className="input"
                    placeholder="bug, feature, design"
                    value={editLabels}
                    onChange={(e) => setEditLabels(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="secondary-button" onClick={() => setEditMode(false)}>
                  Cancel
                </button>
                <button type="submit" className="primary-button" disabled={editLoading}>
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            
            <div className="modal-body">
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text)', flex: 1, lineHeight: 1.3 }}>
                  {selectedTask.title}
                </h3>
                <div style={{ display: 'flex', gap: 6, marginLeft: 12 }}>
                  <button className="icon-button" onClick={startEdit} title="Edit task">
                    <Edit2 size={15} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={handleDeleteTask}
                    title="Delete task"
                    style={{ color: '#ef4444' }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              
              {selectedTask.description && (
                <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: 16 }}>
                  {selectedTask.description}
                </p>
              )}

              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                    Status
                  </div>
                  <select
                    className="input"
                    style={{ padding: '6px 8px', fontSize: '0.825rem' }}
                    value={selectedTask.status}
                    onChange={(e) => handleStatusChange(selectedTask._id, e.target.value)}
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                    Priority
                  </div>
                  <span className={`badge badge-${selectedTask.priority}`}>
                    {selectedTask.priority}
                  </span>
                </div>

                
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                    Assignee
                  </div>
                  {selectedTask.assignee ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Avatar user={selectedTask.assignee} size="sm" />
                      <span style={{ fontSize: '0.825rem', color: 'var(--text)' }}>
                        {selectedTask.assignee.name}
                      </span>
                    </div>
                  ) : (
                    <span style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Unassigned</span>
                  )}
                </div>

                
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 4, textTransform: 'uppercase' }}>
                    Deadline
                  </div>
                  <span style={{ fontSize: '0.825rem', color: 'var(--text)' }}>
                    {selectedTask.deadline ? formatDate(selectedTask.deadline) : 'No deadline'}
                  </span>
                </div>
              </div>

              
              {selectedTask.labels?.length > 0 && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600, marginBottom: 6, textTransform: 'uppercase' }}>
                    Labels
                  </div>
                  <div className="task-card-labels">
                    {selectedTask.labels.map((label, i) => (
                      <span key={i} className="task-label">{label}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="divider" />

              
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>
                Comments ({comments.length})
              </div>

              
              <div className="comment-list">
                {comments.length === 0 ? (
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    No comments yet. Be the first!
                  </p>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="comment-item">
                      <Avatar user={comment.author} size="sm" />
                      <div className="comment-body">
                        <div className="comment-author">
                          {comment.author?.name}
                          <span className="comment-time">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="comment-content">{comment.content}</div>

                        
                        {comment.author?._id === user?._id && (
                          <div className="comment-actions">
                            <button
                              className="icon-button"
                              style={{ padding: '2px 4px' }}
                              onClick={() => handleDeleteComment(comment._id)}
                              title="Delete comment"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              
              <form onSubmit={handleAddComment} className="comment-input-area" style={{ marginTop: 12 }}>
                <Avatar user={user} size="sm" />
                <input
                  className="input"
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ flex: 1 }}
                />
                <button
                  type="submit"
                  className="primary-button"
                  style={{ padding: '9px 14px' }}
                  disabled={!commentText.trim() || commentLoading}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

export default ProjectPage;
