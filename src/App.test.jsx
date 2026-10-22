import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App';

// Mock Web Audio API
class AudioContextMock {
  constructor() {
    this.state = 'running';
    this.currentTime = 0;
    this.destination = {};
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime: vi.fn(),
        exponentialRampToValueAtTime: vi.fn(),
      },
      connect: vi.fn(),
    };
  }
  resume() {
    return Promise.resolve();
  }
}

global.AudioContext = AudioContextMock;
global.webkitAudioContext = AudioContextMock;

describe('TaskPulse App - Personal DailyTask Alert Engine', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the header title and key navigation elements', () => {
    render(<App />);
    expect(screen.getByText('TaskPulse')).toBeInTheDocument();
    expect(screen.getByText(/Personal DailyTask Alert Engine/i)).toBeInTheDocument();
    expect(screen.getByText('New Task')).toBeInTheDocument();
    expect(screen.getByText('Test Alert')).toBeInTheDocument();
  });

  it('renders initial metrics cards', () => {
    render(<App />);
    expect(screen.getByText('Total Daily Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending Alerts')).toBeInTheDocument();
    expect(screen.getByText(/Focus Streak/i)).toBeInTheDocument();
  });

  it('filters task list when search query is entered', () => {
    render(<App />);
    const searchInput = screen.getByPlaceholderText(/Search task title or notes/i);
    fireEvent.change(searchInput, { target: { value: 'Hydration' } });

    expect(screen.getByText(/Hydration & 20-20-20 Screen Rest Alert/i)).toBeInTheDocument();
    expect(screen.queryByText(/Verify GitHub Actions CI\/CD Workflow/i)).not.toBeInTheDocument();
  });

  it('triggers test alert and displays the active alert modal/banner', () => {
    render(<App />);
    const testAlertBtn = screen.getByText('Test Alert');
    fireEvent.click(testAlertBtn);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/Snooze \+5m/i)).toBeInTheDocument();
  });

  it('allows adding a new task through the modal', () => {
    render(<App />);
    const newTaskBtn = screen.getByText('New Task');
    fireEvent.click(newTaskBtn);

    expect(screen.getByText('Create Daily Task Alert')).toBeInTheDocument();

    const titleInput = screen.getByLabelText(/Task Title \*/i);
    fireEvent.change(titleInput, { target: { value: 'Complete Elevate Lab CI/CD Project' } });

    const submitBtn = screen.getByText(/Create Task & Set Alert/i);
    fireEvent.click(submitBtn);

    expect(screen.getByText('Complete Elevate Lab CI/CD Project')).toBeInTheDocument();
  });

  it('opens and displays the CI/CD pipeline architecture modal', () => {
    render(<App />);
    const viewCicdBtn = screen.getByText(/View CI\/CD Details/i);
    fireEvent.click(viewCicdBtn);

    expect(screen.getByText(/CI\/CD Pipeline Architecture/i)).toBeInTheDocument();
    expect(screen.getByText('DOCKERHUB_USERNAME')).toBeInTheDocument();
    expect(screen.getByText('DOCKERHUB_TOKEN')).toBeInTheDocument();
  });
});
