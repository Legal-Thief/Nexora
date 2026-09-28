

import { useState, useEffect } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { Plus, Folder } from 'lucide-react';
import ProjectCard from '../components/ProjectCard.jsx';
import Modal from '../components/Modal.jsx';
import { getProjects, createProject, updateProject, deleteProject } from '../api/project.js';

function ProjectsPage() {
  const { currentWorkspace } = useOutletContext() || {};
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editProject, setEditProject] = useState(null);   
  const [deleteProjectId, setDeleteProjectId] = useState(null);

  
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formStatus, setFormStatus] = useState('planning');
  const [formDeadline, setFormDeadline] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  
  useEffect(() => {
    if (!currentWorkspace) return;
    loadProjects();
  }, [currentWorkspace?._id]);

  const loadProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await getProjects(currentWorkspace._id);
      setProjects(res.data.projects || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load projects.');
    } finally {
      setLoading(false);
    }
  };

  
  const openCreateModal = () => {
    setFormTitle('');
    setFormDescription('');
    setFormStatus('planning');
    setFormDeadline('');
    setFormError('');
    setShowCreateModal(true);
  };

  
  const openEditModal = (project) => {
    setEditProject(project);
    setFormTitle(project.title);
    setFormDescription(project.description || '');
    setFormStatus(project.status);
    setFormDeadline(project.deadline ? project.deadline.slice(0, 10) : '');
    setFormError('');
  };

  
  const handleCreate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const res = await createProject(currentWorkspace._id, {
        title: formTitle,
        description: formDescription,
        status: formStatus,
        deadline: formDeadline || null,
      });
      setProjects([res.data.project, ...projects]);
      setShowCreateModal(false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create project.');
    } finally {
      setFormLoading(false);
    }
  };

  
  const handleUpdate = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormLoading(true);
    try {
      const res = await updateProject(editProject._id, {
        title: formTitle,
        description: formDescription,
        status: formStatus,
        deadline: formDeadline || null,
      });
      setProjects(projects.map((p) =>
        p._id === editProject._id ? res.data.project : p
      ));
      setEditProject(null);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to update project.');
    } finally {
      setFormLoading(false);
    }
  };

  
  const handleDelete = async () => {
    if (!deleteProjectId) return;
    try {
      await deleteProject(deleteProjectId);
      setProjects(projects.filter((p) => p._id !== deleteProjectId));
      setDeleteProjectId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete project.');
    }
  };

  
  const ProjectForm = ({ onSubmit, submitLabel }) => (
    <form onSubmit={onSubmit}>
      <div className="modal-body">
        {formError && <div className="error-message">{formError}</div>}

        <div className="form-group">
          <label className="form-label">Project Title *</label>
          <input
            type="text"
            className="input"
            placeholder="e.g. E-commerce Website"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            required
            maxLength={100}
            autoFocus
          />
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            className="input"
            placeholder="What is this project about?"
            value={formDescription}
            onChange={(e) => setFormDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select
              className="input"
              value={formStatus}
              onChange={(e) => setFormStatus(e.target.value)}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              className="input"
              value={formDeadline}
              onChange={(e) => setFormDeadline(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer">
        <button
          type="button"
          className="secondary-button"
          onClick={() => {
            setShowCreateModal(false);
            setEditProject(null);
          }}
        >
          Cancel
        </button>
        <button type="submit" className="primary-button" disabled={formLoading}>
          {formLoading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  );

  if (!currentWorkspace) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon"><Folder size={28} /></div>
        <h3 className="empty-state-title">No workspace selected</h3>
        <p className="empty-state-desc">Select or create a workspace from the sidebar.</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      
      <div className="page-header">
        <div>
          <h1 className="page-title">Projects</h1>
          <p className="page-subtitle">
            {projects.length} project{projects.length !== 1 ? 's' : ''} in {currentWorkspace.name}
          </p>
        </div>
        <button className="primary-button" onClick={openCreateModal}>
          <Plus size={16} /> New Project
        </button>
      </div>

      
      {error && <div className="error-message">{error}</div>}

      
      {loading ? (
        <div className="page-loading"><div className="spinner" /></div>
      ) : projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon"><Folder size={28} /></div>
          <h3 className="empty-state-title">No projects yet</h3>
          <p className="empty-state-desc">
            Create your first project to start organizing tasks.
          </p>
          <button className="primary-button" onClick={openCreateModal}>
            <Plus size={16} /> Create Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project) => (
            <ProjectCard
              key={project._id}
              project={project}
              onClick={() => navigate(`/app/projects/${project._id}`)}
              onEdit={() => openEditModal(project)}
              onDelete={() => setDeleteProjectId(project._id)}
            />
          ))}
        </div>
      )}

      
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Project"
      >
        <ProjectForm onSubmit={handleCreate} submitLabel="Create Project" />
      </Modal>

      
      <Modal
        isOpen={!!editProject}
        onClose={() => setEditProject(null)}
        title="Edit Project"
      >
        <ProjectForm onSubmit={handleUpdate} submitLabel="Save Changes" />
      </Modal>

      
      <Modal
        isOpen={!!deleteProjectId}
        onClose={() => setDeleteProjectId(null)}
        title="Delete Project"
      >
        <div className="modal-body">
          <p style={{ color: 'var(--text)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Are you sure you want to delete this project? All tasks inside it will also
            be permanently deleted. <strong>This action cannot be undone.</strong>
          </p>
        </div>
        <div className="modal-footer">
          <button className="secondary-button" onClick={() => setDeleteProjectId(null)}>
            Cancel
          </button>
          <button className="danger-button" onClick={handleDelete}>
            Delete Project
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ProjectsPage;
