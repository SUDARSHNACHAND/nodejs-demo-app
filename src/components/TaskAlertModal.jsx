import React from 'react';
import { BellRing, Check, Clock, X, AlertOctagon } from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioAlert } from '../utils/audioAlert';

export default function TaskAlertModal({ activeAlertTask, onClose, onComplete, onSnooze }) {
  if (!activeAlertTask) return null;

  const handleComplete = () => {
    audioAlert.playChime('success');
    try {
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'],
      });
    } catch (e) {}
    onComplete(activeAlertTask.id);
    onClose();
  };

  const handleSnooze = (minutes) => {
    onSnooze(activeAlertTask.id, minutes);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-panel modal-content"
        style={{
          border: '2px solid rgba(244, 63, 94, 0.7)',
          boxShadow: '0 0 50px rgba(244, 63, 94, 0.45)',
          textAlign: 'center',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
          <button
            className="btn btn-ghost btn-icon"
            onClick={onClose}
            aria-label="Close Alert Modal"
          >
            <X size={18} />
          </button>
        </div>

        <div
          style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: 'rgba(244, 63, 94, 0.15)',
            border: '2px solid rgba(244, 63, 94, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            animation: 'liveDot 1s infinite alternate',
          }}
        >
          <BellRing size={34} color="#f43f5e" />
        </div>

        <div style={{ marginBottom: '8px' }}>
          <span className={`badge badge-${activeAlertTask.priority.toLowerCase()}`}>
            🚨 {activeAlertTask.priority} ALERT TRIGGERED
          </span>
        </div>

        <h2 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '8px', color: '#fff' }}>
          {activeAlertTask.title}
        </h2>

        {activeAlertTask.notes && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '20px' }}>
            {activeAlertTask.notes}
          </p>
        )}

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--cyan)',
            marginBottom: '24px',
          }}
        >
          <Clock size={15} />
          <span>Scheduled Time: {activeAlertTask.alertTime}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <button
            className="btn btn-primary"
            style={{ padding: '12px', fontSize: '0.95rem' }}
            onClick={handleComplete}
            id="modal-complete-task-btn"
          >
            <Check size={18} />
            <span>Mark Complete</span>
          </button>

          <button
            className="btn btn-ghost"
            style={{ padding: '12px', fontSize: '0.95rem' }}
            onClick={() => handleSnooze(5)}
            id="modal-snooze-5-btn"
          >
            <Clock size={18} />
            <span>Snooze +5 Mins</span>
          </button>
        </div>
      </div>
    </div>
  );
}
