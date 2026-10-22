import React from 'react';
import { Check, Clock, Trash2, Volume2, Tag, Calendar } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioAlert } from '../utils/audioAlert';

export default function TaskCard({
  task,
  onToggleComplete,
  onDelete,
  onSnooze,
  isAlerting,
}) {
  const handleToggle = () => {
    if (!task.completed) {
      audioAlert.playChime('success');
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b'],
        });
      } catch (e) {
        // Safe fallback in test environment
      }
    }
    onToggleComplete(task.id);
  };

  const handlePreviewSound = (e) => {
    e.stopPropagation();
    if (task.priority === 'CRITICAL') {
      audioAlert.playChime('urgent');
    } else {
      audioAlert.playChime('default');
    }
  };

  // Helper to format remaining time or due label
  const getRemainingLabel = () => {
    if (task.completed) return 'Completed';
    if (!task.alertTime) return 'No Alert';

    const [hours, minutes] = task.alertTime.split(':').map(Number);
    const now = new Date();
    const alertDate = new Date();
    alertDate.setHours(hours, minutes, 0, 0);

    const diffMs = alertDate.getTime() - now.getTime();
    if (diffMs <= 0) {
      return 'Alert Triggered';
    }

    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) {
      return `Alert in ${diffMins}m`;
    }
    const diffHours = Math.floor(diffMins / 60);
    const remainingMins = diffMins % 60;
    return `Alert in ${diffHours}h ${remainingMins}m`;
  };

  const remainingLabel = getRemainingLabel();
  const isUrgent = remainingLabel === 'Alert Triggered' || remainingLabel.includes('m') && !remainingLabel.includes('h');

  return (
    <div
      className={`glass-panel task-card ${task.completed ? 'is-completed' : ''} ${
        isAlerting ? 'is-alerting' : ''
      }`}
      id={`task-card-${task.id}`}
    >
      <div>
        <div className="task-header">
          <button
            className="task-checkbox-btn"
            onClick={handleToggle}
            id={`task-toggle-${task.id}`}
            aria-label={task.completed ? 'Mark uncompleted' : 'Mark completed'}
          >
            <div
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '6px',
                border: task.completed ? 'none' : '2px solid rgba(255, 255, 255, 0.3)',
                background: task.completed ? 'var(--emerald)' : 'rgba(255, 255, 255, 0.04)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {task.completed && <Check size={16} color="#ffffff" strokeWidth={3} />}
            </div>
          </button>

          <div style={{ flex: 1, marginLeft: '10px' }}>
            <h3 className="task-title">{task.title}</h3>
          </div>

          <span className={`badge badge-${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>
        </div>

        {task.notes && <p className="task-notes">{task.notes}</p>}

        <div className="task-meta-row">
          <div className={`countdown-box ${isUrgent && !task.completed ? 'urgent' : ''}`}>
            <Clock size={14} />
            <span>{task.alertTime}</span>
            <span style={{ opacity: 0.6 }}>•</span>
            <span>{remainingLabel}</span>
          </div>

          {task.category && (
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <Tag size={11} />
              {task.category}
            </span>
          )}
        </div>
      </div>

      <div className="task-actions">
        <div className="task-action-btns">
          {!task.completed && (
            <>
              <button
                className="btn btn-ghost"
                style={{ padding: '4px 10px', fontSize: '0.78rem' }}
                onClick={() => onSnooze(task.id, 5)}
                title="Snooze alert by 5 minutes"
                id={`task-snooze-${task.id}`}
              >
                +5m Snooze
              </button>

              <button
                className="btn btn-ghost btn-icon"
                style={{ width: '32px', height: '32px' }}
                onClick={handlePreviewSound}
                title="Preview alert chime"
                id={`task-sound-${task.id}`}
              >
                <Volume2 size={15} color="var(--cyan)" />
              </button>
            </>
          )}
        </div>

        <button
          className="btn btn-ghost btn-icon"
          style={{ width: '32px', height: '32px', color: '#fb7185' }}
          onClick={() => onDelete(task.id)}
          title="Delete task"
          id={`task-delete-${task.id}`}
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
