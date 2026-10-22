import React, { useState, useEffect } from 'react';
import { Bell, BellRing, Volume2, VolumeX, Plus, Zap, ShieldCheck } from 'lucide-react';
import { audioAlert } from '../utils/audioAlert';

export default function Navbar({ onOpenNewTask, onTriggerTestAlert, onOpenCiCdModal }) {
  const [timeStr, setTimeStr] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [notificationStatus, setNotificationStatus] = useState('default');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setNotificationStatus(Notification.permission);
    }
  }, []);

  const handleToggleMute = () => {
    const muted = audioAlert.toggleMute();
    setIsMuted(muted);
  };

  const handleRequestNotification = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const perm = await Notification.requestPermission();
        setNotificationStatus(perm);
        if (perm === 'granted') {
          new Notification('TaskPulse Alerts Enabled! 🎯', {
            body: 'You will receive personal task alerts directly on your desktop.',
            icon: '/alarm-clock.svg',
          });
        }
      } catch (e) {
        console.warn('Notification permission error:', e);
      }
    }
  };

  return (
    <header className="navbar glass-panel" id="main-navbar">
      <div className="brand-section">
        <div className="brand-icon-wrapper" aria-label="TaskPulse Logo">
          <BellRing size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">TaskPulse</h1>
          <p className="brand-subtitle">Personal DailyTask Alert Engine</p>
        </div>
      </div>

      <div className="nav-actions">
        <div className="live-clock-badge" id="live-clock-badge" title="Live System Time">
          <span className="live-indicator-dot" />
          <span>{timeStr || '00:00:00'}</span>
        </div>

        <button
          className="btn btn-ghost btn-icon"
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute alert sound' : 'Mute alert sound'}
          id="toggle-sound-btn"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={18} color="#f43f5e" /> : <Volume2 size={18} color="#06b6d4" />}
        </button>

        {notificationStatus !== 'granted' && (
          <button
            className="btn btn-ghost"
            onClick={handleRequestNotification}
            title="Enable Browser Push Notifications"
            id="enable-notifications-btn"
          >
            <Bell size={16} />
            <span style={{ fontSize: '0.82rem' }}>Allow Alerts</span>
          </button>
        )}

        <button
          className="btn btn-alert"
          onClick={onTriggerTestAlert}
          id="test-alert-btn"
          title="Simulate Instant Task Alert"
        >
          <Zap size={16} />
          <span>Test Alert</span>
        </button>

        <button
          className="btn btn-primary"
          onClick={onOpenNewTask}
          id="add-task-btn"
        >
          <Plus size={18} />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
}
