import React, { useState } from 'react';
import { X, Plus, Clock, Tag, AlertCircle } from 'lucide-react';

export default function NewTaskModal({ isOpen, onClose, onAddTask }) {
  if (!isOpen) return null;

  // Compute a default alert time (e.g. 15 minutes from now)
  const getDefaultTime = (addMinutes = 15) => {
    const d = new Date(Date.now() + addMinutes * 60000);
    const hh = String(d.getHours()).padStart(2, '0');
    const mm = String(d.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  const [title, setTitle] = useState('');
  const [alertTime, setAlertTime] = useState(getDefaultTime(15));
  const [priority, setPriority] = useState('HIGH');
  const [category, setCategory] = useState('Work');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please provide a task title');
      return;
    }
    if (!alertTime) {
      setError('Please select an alert time');
      return;
    }

    onAddTask({
      title: title.trim(),
      alertTime,
      priority,
      category,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="glass-panel modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Create Daily Task Alert</h2>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close Modal"
            id="modal-close-btn"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '8px',
              color: '#fb7185',
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px',
            }}
          >
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} id="new-task-form">
          <div className="form-group">
            <label className="form-label" htmlFor="task-title-input">
              Task Title *
            </label>
            <input
              id="task-title-input"
              className="form-input"
              type="text"
              placeholder="e.g. Verify GitHub Actions Pipeline Deployment"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="task-priority-select">
                Priority
              </label>
              <select
                id="task-priority-select"
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="CRITICAL" style={{ background: '#0f172a' }}>🚨 CRITICAL</option>
                <option value="HIGH" style={{ background: '#0f172a' }}>🔥 HIGH</option>
                <option value="MEDIUM" style={{ background: '#0f172a' }}>⚡ MEDIUM</option>
                <option value="LOW" style={{ background: '#0f172a' }}>☕ LOW</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="task-category-select">
                Category
              </label>
              <select
                id="task-category-select"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Work" style={{ background: '#0f172a' }}>💼 Work</option>
                <option value="Coding" style={{ background: '#0f172a' }}>💻 Coding</option>
                <option value="Health" style={{ background: '#0f172a' }}>💧 Health & Wellness</option>
                <option value="Personal" style={{ background: '#0f172a' }}>🎯 Personal</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-time-input">
              Daily Alert Time (HH:MM) *
            </label>
            <input
              id="task-time-input"
              className="form-input"
              type="time"
              value={alertTime}
              onChange={(e) => setAlertTime(e.target.value)}
            />
            {/* Quick Presets */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setAlertTime(getDefaultTime(2))}
              >
                +2 Mins
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setAlertTime(getDefaultTime(10))}
              >
                +10 Mins
              </button>
              <button
                type="button"
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                onClick={() => setAlertTime(getDefaultTime(30))}
              >
                +30 Mins
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-notes-input">
              Notes / Key Details (Optional)
            </label>
            <textarea
              id="task-notes-input"
              className="form-textarea"
              rows={3}
              placeholder="Add checklist items, links, or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              id="cancel-new-task-btn"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              id="submit-new-task-btn"
            >
              <Plus size={16} />
              <span>Create Task & Set Alert</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
