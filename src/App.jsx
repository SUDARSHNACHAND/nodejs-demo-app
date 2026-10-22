import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import StatsBar from './components/StatsBar';
import ActiveAlertBanner from './components/ActiveAlertBanner';
import TaskFilter from './components/TaskFilter';
import TaskCard from './components/TaskCard';
import NewTaskModal from './components/NewTaskModal';
import TaskAlertModal from './components/TaskAlertModal';
import CiCdInfoModal from './components/CiCdInfoModal';
import { audioAlert } from './utils/audioAlert';
import { GitBranch, ShieldCheck, Box, RefreshCw, Bell, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'taskpulse_daily_tasks_v1';

const getInitialTasks = () => {
  const now = new Date();
  const formatTime = (addMins) => {
    const d = new Date(now.getTime() + addMins * 60000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return [
    {
      id: 'task-1',
      title: 'Verify GitHub Actions CI/CD Workflow (.github/workflows/main.yml)',
      priority: 'CRITICAL',
      category: 'Coding',
      alertTime: formatTime(5),
      notes: 'Ensure automated test -> build -> DockerHub push steps execute cleanly on push to main.',
      completed: false,
      triggered: false,
    },
    {
      id: 'task-2',
      title: 'Deploy Docker Container to DockerHub Registry',
      priority: 'HIGH',
      category: 'Work',
      alertTime: formatTime(15),
      notes: 'Tag image with latest and Git commit SHA. Verify secrets injection.',
      completed: false,
      triggered: false,
    },
    {
      id: 'task-3',
      title: 'Hydration & 20-20-20 Screen Rest Alert',
      priority: 'MEDIUM',
      category: 'Health',
      alertTime: formatTime(35),
      notes: 'Drink 300ml water and relax eyes to maintain peak cognitive focus.',
      completed: false,
      triggered: false,
    },
    {
      id: 'task-4',
      title: 'Run Automated Vitest Suite & Bundle Health Check',
      priority: 'HIGH',
      category: 'Coding',
      alertTime: formatTime(55),
      notes: 'Execute npm test and check code coverage before committing changes.',
      completed: false,
      triggered: false,
    },
  ];
};

export default function App() {
  const [tasks, setTasks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed reading from localStorage', e);
    }
    return getInitialTasks();
  });

  const [activeFilter, setActiveFilter] = useState('all');
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isNewTaskOpen, setIsNewTaskOpen] = useState(false);
  const [isCiCdModalOpen, setIsCiCdModalOpen] = useState(false);
  const [activeAlertTask, setActiveAlertTask] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (e) {
      console.warn('Failed saving to localStorage', e);
    }
  }, [tasks]);

  // Alert Timer Monitor
  useEffect(() => {
    const checkAlerts = () => {
      const now = new Date();
      const currentHHMM = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}`;

      tasks.forEach((task) => {
        if (!task.completed && !task.triggered && task.alertTime === currentHHMM) {
          // Trigger Alert!
          triggerTaskAlert(task);

          // Mark task as triggered for this cycle
          setTasks((prev) =>
            prev.map((t) => (t.id === task.id ? { ...t, triggered: true } : t))
          );
        }
      });
    };

    checkAlerts();
    const interval = setInterval(checkAlerts, 6000);
    return () => clearInterval(interval);
  }, [tasks]);

  const triggerTaskAlert = (task) => {
    setActiveAlertTask(task);
    setIsAlertModalOpen(true);

    if (task.priority === 'CRITICAL') {
      audioAlert.playChime('urgent');
    } else {
      audioAlert.playChime('default');
    }

    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(`⏰ Task Alert: ${task.title}`, {
          body: `Priority: ${task.priority} | Scheduled: ${task.alertTime}`,
          icon: '/alarm-clock.svg',
        });
      } catch (e) {}
    }
  };

  // Instant Test Alert for quick demo
  const handleTriggerTestAlert = () => {
    const testTask = tasks.find((t) => !t.completed) || {
      id: 'test-preview',
      title: '🚨 Test Task Alert: Deploy CI/CD Pipeline to DockerHub',
      priority: 'CRITICAL',
      alertTime: 'Now',
      category: 'Coding',
      notes: 'This simulated alert verifies the audio chime, pulsating visual banner, and instant action modal.',
    };
    triggerTaskAlert(testTask);
  };

  // Task Actions
  const handleToggleComplete = (taskId) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
    if (activeAlertTask && activeAlertTask.id === taskId) {
      setActiveAlertTask(null);
      setIsAlertModalOpen(false);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    if (activeAlertTask && activeAlertTask.id === taskId) {
      setActiveAlertTask(null);
      setIsAlertModalOpen(false);
    }
  };

  const handleSnooze = (taskId, minutes = 5) => {
    const now = new Date();
    const snoozeTime = new Date(now.getTime() + minutes * 60000);
    const newHHMM = `${String(snoozeTime.getHours()).padStart(2, '0')}:${String(
      snoozeTime.getMinutes()
    ).padStart(2, '0')}`;

    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId ? { ...t, alertTime: newHHMM, triggered: false } : t
      )
    );

    if (activeAlertTask && activeAlertTask.id === taskId) {
      setActiveAlertTask(null);
      setIsAlertModalOpen(false);
    }
  };

  const handleAddTask = (newTaskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      ...newTaskData,
      completed: false,
      triggered: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleResetDefaults = () => {
    if (window.confirm('Reset all daily tasks to defaults?')) {
      const initial = getInitialTasks();
      setTasks(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
  };

  // Filtered Tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      // Search
      const matchesSearch =
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.notes && t.notes.toLowerCase().includes(searchQuery.toLowerCase()));
      if (!matchesSearch) return false;

      // Category
      if (activeCategory !== 'All' && t.category !== activeCategory) {
        return false;
      }

      // Filter Tab
      if (activeFilter === 'pending') return !t.completed;
      if (activeFilter === 'critical')
        return !t.completed && (t.priority === 'CRITICAL' || t.priority === 'HIGH');
      if (activeFilter === 'completed') return t.completed;

      return true;
    });
  }, [tasks, searchQuery, activeCategory, activeFilter]);

  return (
    <div className="app-container">
      {/* Top Navigation */}
      <Navbar
        onOpenNewTask={() => setIsNewTaskOpen(true)}
        onTriggerTestAlert={handleTriggerTestAlert}
        onOpenCiCdModal={() => setIsCiCdModalOpen(true)}
      />

      {/* Active Glowing Alert Banner (if alert triggered) */}
      <ActiveAlertBanner
        activeAlertTask={activeAlertTask}
        onComplete={handleToggleComplete}
        onSnooze={handleSnooze}
        onDismiss={() => setActiveAlertTask(null)}
      />

      {/* Metric Cards Overview */}
      <StatsBar tasks={tasks} streak={7} />

      {/* Controls & Search */}
      <TaskFilter
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
      />

      {/* Tasks Grid */}
      {filteredTasks.length === 0 ? (
        <div className="glass-panel empty-state">
          <div className="empty-state-icon">
            <Bell size={44} />
          </div>
          <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No tasks found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '18px' }}>
            Try adjusting your search criteria or create a new daily task alert.
          </p>
          <button
            className="btn btn-primary"
            onClick={() => setIsNewTaskOpen(true)}
          >
            Create Daily Task
          </button>
        </div>
      ) : (
        <div className="tasks-grid" id="tasks-container">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDeleteTask}
              onSnooze={handleSnooze}
              isAlerting={activeAlertTask && activeAlertTask.id === task.id}
            />
          ))}
        </div>
      )}

      {/* CI/CD Quick Info Footer Banner */}
      <div className="glass-panel cicd-footer-banner">
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(99, 102, 241, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--primary)',
            }}
          >
            <GitBranch size={22} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.95rem', fontWeight: '700', color: '#fff' }}>
              CI/CD Pipeline: GitHub Actions ➔ DockerHub
            </h4>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <span className="cicd-badge-tech">workflow: .github/workflows/main.yml</span>
              <span className="cicd-badge-tech">runtime: Node 20 + Docker</span>
              <span className="cicd-badge-tech">status: Pipeline Ready</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="btn btn-ghost"
            onClick={handleResetDefaults}
            title="Reset sample tasks"
            style={{ fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} />
            <span>Reset Demo Tasks</span>
          </button>

          <button
            className="btn btn-primary"
            onClick={() => setIsCiCdModalOpen(true)}
            id="open-pipeline-modal-btn"
          >
            <Box size={16} />
            <span>View CI/CD Details</span>
          </button>
        </div>
      </div>

      {/* Creation Modal */}
      <NewTaskModal
        isOpen={isNewTaskOpen}
        onClose={() => setIsNewTaskOpen(false)}
        onAddTask={handleAddTask}
      />

      {/* High Alert Modal */}
      <TaskAlertModal
        activeAlertTask={activeAlertTask}
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        onComplete={handleToggleComplete}
        onSnooze={handleSnooze}
      />

      {/* CI/CD Architecture Modal */}
      <CiCdInfoModal
        isOpen={isCiCdModalOpen}
        onClose={() => setIsCiCdModalOpen(false)}
      />
    </div>
  );
}
