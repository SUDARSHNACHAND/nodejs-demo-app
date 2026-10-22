import React from 'react';
import { BellRing, Check, Clock, X } from 'lucide-react';

export default function ActiveAlertBanner({ activeAlertTask, onComplete, onSnooze, onDismiss }) {
  if (!activeAlertTask) return null;

  return (
    <div className="glass-panel active-alert-banner" id="active-alert-banner" role="alert">
      <div className="alert-banner-left">
        <div className="alert-bell-pulse">
          <BellRing size={28} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
            <span className={`badge badge-${activeAlertTask.priority.toLowerCase()}`}>
              {activeAlertTask.priority} ALERT
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Scheduled for {activeAlertTask.alertTime}
            </span>
          </div>
          <strong style={{ fontSize: '1.1rem', color: '#ffffff' }}>
            {activeAlertTask.title}
          </strong>
          {activeAlertTask.notes && (
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginTop: '2px' }}>
              {activeAlertTask.notes}
            </p>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          className="btn btn-primary"
          onClick={() => onComplete(activeAlertTask.id)}
          id="alert-complete-btn"
        >
          <Check size={16} />
          <span>Mark Done</span>
        </button>

        <button
          className="btn btn-ghost"
          onClick={() => onSnooze(activeAlertTask.id, 5)}
          id="alert-snooze-btn"
          title="Snooze alert by 5 minutes"
        >
          <Clock size={16} />
          <span>Snooze +5m</span>
        </button>

        <button
          className="btn btn-ghost btn-icon"
          onClick={() => onDismiss(activeAlertTask.id)}
          id="alert-dismiss-btn"
          aria-label="Dismiss Alert"
          title="Dismiss Alert"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
