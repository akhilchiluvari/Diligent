import React from 'react';
import { Bot, ShieldCheck, ShieldAlert, Cpu, Sparkles, Store, Activity } from 'lucide-react';

export default function Navbar({ business, termsAccepted, onOpenLegal, activeProvider }) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-color)',
      backgroundColor: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      padding: '12px 24px'
    }}>
      <div style={{
        maxWidth: '1440px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        {/* Brand & Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #0284c7 0%, #7c3aed 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(2, 132, 199, 0.4)'
          }}>
            <Bot size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                DILIGENT
              </span>
              <span className="badge-purple">
                <Sparkles size={11} /> Multi-Agent Swarm
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Autonomous Business Consultant & Operational Engine for SMBs
            </p>
          </div>
        </div>

        {/* Business Selector & Edge Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Store Info Pill */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid var(--border-color)',
            padding: '6px 14px',
            borderRadius: '9999px',
            fontSize: '0.8rem'
          }}>
            <Store size={14} color="#38bdf8" />
            <span style={{ fontWeight: 600 }}>{business?.name || 'Sri Balaji Smart Retail'}</span>
            <span style={{ color: 'var(--text-muted)' }}>• Madhapur, Hyderabad</span>
          </div>

          {/* AI Inference Provider Badge */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '0.78rem',
            color: '#38bdf8'
          }}>
            <Cpu size={13} />
            <span><strong>Inference:</strong> {activeProvider?.provider || 'Grok LPU Architecture'}</span>
          </div>

          {/* Swarm Liveness */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            fontSize: '0.78rem',
            color: '#34d399'
          }}>
            <div className="pulse-dot" />
            <span>5 Agents Synced</span>
          </div>

          {/* Legal Compliance Waiver Button */}
          <button
            onClick={onOpenLegal}
            style={{
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: termsAccepted ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(244, 63, 94, 0.4)',
              backgroundColor: termsAccepted ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
              color: termsAccepted ? '#34d399' : '#fb7185',
              fontSize: '0.78rem',
              fontWeight: 600
            }}
          >
            {termsAccepted ? <ShieldCheck size={14} /> : <ShieldAlert size={14} />}
            <span>{termsAccepted ? 'Liability Waiver Signed' : 'Sign Liability Waiver'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
