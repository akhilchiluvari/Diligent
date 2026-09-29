import React from 'react';
import { Bot, ShieldCheck, ShieldAlert, Cpu, Sparkles, Store, Sun, Moon, HelpCircle } from 'lucide-react';

export default function Navbar({ business, termsAccepted, onOpenLegal, activeProvider, theme, onToggleTheme, onOpenCopilot }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      backgroundColor: 'var(--bg-surface)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '10px 24px',
      transition: 'background-color 0.2s ease, border-color 0.2s ease'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Brand & Identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '9px',
            background: 'var(--accent-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
          }}>
            <Bot size={20} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
                DILIGENT
              </span>
              <span className="badge-clean badge-clean-accent">
                <Sparkles size={11} /> VC Platform
              </span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Autonomous Multi-Agent Retail OS & Business Consultant
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Store Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 12px',
            borderRadius: '8px',
            fontSize: '0.78rem',
            color: 'var(--text-primary)'
          }}>
            <Store size={13} color="var(--accent)" />
            <span style={{ fontWeight: 600 }}>{business?.name || 'Sri Balaji Smart Retail'}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>• Madhapur</span>
          </div>

          {/* Model Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--badge-blue-bg)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--badge-blue-text)',
            fontWeight: 600
          }}>
            <Cpu size={12} />
            <span>Groq 120B LPU</span>
          </div>

          {/* Swarm Sync */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--badge-emerald-bg)',
            border: '1px solid var(--border-subtle)',
            padding: '5px 10px',
            borderRadius: '8px',
            fontSize: '0.75rem',
            color: 'var(--badge-emerald-text)',
            fontWeight: 600
          }}>
            <div className="pulse-indicator" />
            <span>5 Agents Live</span>
          </div>

          {/* Ask Agent Header Trigger */}
          <button
            onClick={() => onOpenCopilot()}
            className="btn-agent-trigger"
            style={{ padding: '6px 12px', fontSize: '0.78rem' }}
          >
            <Sparkles size={13} />
            <span>Ask Copilot</span>
          </button>

          {/* Legal Compliance */}
          <button
            onClick={onOpenLegal}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '8px',
              border: termsAccepted ? '1px solid var(--badge-emerald-bg)' : '1px solid var(--badge-rose-bg)',
              backgroundColor: termsAccepted ? 'var(--badge-emerald-bg)' : 'var(--badge-rose-bg)',
              color: termsAccepted ? 'var(--badge-emerald-text)' : 'var(--badge-rose-text)',
              fontSize: '0.75rem',
              fontWeight: 600
            }}
          >
            {termsAccepted ? <ShieldCheck size={13} /> : <ShieldAlert size={13} />}
            <span>{termsAccepted ? 'Compliance Verified' : 'Sign Liability Waiver'}</span>
          </button>

          {/* Theme Toggle (Sun / Moon) */}
          <button
            onClick={onToggleTheme}
            style={{
              background: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: '6px 10px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun size={15} color="#fbbf24" /> : <Moon size={15} color="#6366f1" />}
          </button>
        </div>
      </div>
    </header>
  );
}
