import React from 'react';
import { X, GitBranch, Terminal, Shield, CheckCircle2, Box, ArrowRight } from 'lucide-react';

export default function CiCdInfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="glass-panel modal-content"
        style={{ maxWidth: '680px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(99, 102, 241, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary)',
              }}
            >
              <GitBranch size={20} />
            </div>
            <div>
              <h2 className="modal-title" style={{ fontSize: '1.2rem' }}>CI/CD Pipeline Architecture</h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                GitHub Actions ➔ Node.js ➔ DockerHub
              </span>
            </div>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {/* Pipeline Workflow Visualizer */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(0, 0, 0, 0.4)',
            padding: '16px',
            borderRadius: '12px',
            border: '1px solid var(--border-subtle)',
            marginBottom: '20px',
            overflowX: 'auto',
            gap: '8px',
          }}
        >
          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>TRIGGER</div>
            <div style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.9rem' }}>
              git push main
            </div>
          </div>
          <ArrowRight size={16} color="var(--text-faint)" />

          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STAGE 1</div>
            <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.9rem' }}>
              Test & Lint
            </div>
          </div>
          <ArrowRight size={16} color="var(--text-faint)" />

          <div style={{ textAlign: 'center', minWidth: '100px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STAGE 2</div>
            <div style={{ fontWeight: '700', color: '#a78bfa', fontSize: '0.9rem' }}>
              Vite Build
            </div>
          </div>
          <ArrowRight size={16} color="var(--text-faint)" />

          <div style={{ textAlign: 'center', minWidth: '110px' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>STAGE 3</div>
            <div style={{ fontWeight: '700', color: '#34d399', fontSize: '0.9rem' }}>
              DockerHub Push
            </div>
          </div>
        </div>

        {/* Deliverables summary */}
        <div style={{ marginBottom: '20px' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
            Required GitHub Secrets:
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--cyan)',
              }}
            >
              DOCKERHUB_USERNAME
            </div>
            <div
              style={{
                padding: '10px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--cyan)',
              }}
            >
              DOCKERHUB_TOKEN
            </div>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: '700', marginBottom: '8px', color: '#fff' }}>
            Local Docker Verification:
          </h4>
          <pre
            style={{
              padding: '14px',
              background: '#040711',
              borderRadius: '8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.82rem',
              color: '#34d399',
              overflowX: 'auto',
              border: '1px solid var(--border-subtle)',
            }}
          >
{`# 1. Build Docker image
docker build -t personal-dailytask-alert .

# 2. Run container locally
docker run -p 8080:80 personal-dailytask-alert

# 3. View at http://localhost:8080`}
          </pre>
        </div>

        <div style={{ marginTop: '24px', textAlign: 'right' }}>
          <button className="btn btn-primary" onClick={onClose}>
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
