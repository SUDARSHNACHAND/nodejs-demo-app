import React from 'react';
import { CheckCircle2, Clock, Flame, ListTodo, AlertTriangle } from 'lucide-react';

export default function StatsBar({ tasks, streak = 5 }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const activeAlerts = tasks.filter((t) => !t.completed).length;
  const critical = tasks.filter((t) => !t.completed && (t.priority === 'CRITICAL' || t.priority === 'HIGH')).length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="stats-grid" id="stats-overview-grid">
      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.15)', color: '#818cf8' }}>
          <ListTodo size={24} />
        </div>
        <div>
          <div className="stat-value">{total}</div>
          <div className="stat-label">Total Daily Tasks</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(6, 182, 212, 0.15)', color: '#22d3ee' }}>
          <Clock size={24} />
        </div>
        <div>
          <div className="stat-value">{activeAlerts}</div>
          <div className="stat-label">Pending Alerts</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(244, 63, 94, 0.15)', color: '#fb7185' }}>
          <AlertTriangle size={24} />
        </div>
        <div>
          <div className="stat-value">{critical}</div>
          <div className="stat-label">High / Critical Alerts</div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399' }}>
          <CheckCircle2 size={24} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span className="stat-value">{completed}</span>
            <span style={{ fontSize: '0.82rem', fontFamily: 'var(--font-mono)', color: 'var(--emerald)' }}>
              {percentage}%
            </span>
          </div>
          <div className="stat-label">Tasks Completed</div>
          <div style={{ marginTop: '6px', height: '4px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '4px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${percentage}%`,
                height: '100%',
                background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                transition: 'width 0.4s ease',
              }}
            />
          </div>
        </div>
      </div>

      <div className="glass-panel stat-card">
        <div className="stat-icon-wrapper" style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24' }}>
          <Flame size={24} />
        </div>
        <div>
          <div className="stat-value">{streak} Days</div>
          <div className="stat-label">Focus Streak 🔥</div>
        </div>
      </div>
    </div>
  );
}
