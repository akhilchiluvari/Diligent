import React from 'react';
import { ArrowRight, Sparkles, Play, Barcode } from 'lucide-react';

export default function HeroSection({ onOpenCopilot, onNavigateToLoop, onTriggerConsensus, stats }) {
  return (
    <section style={{
      textAlign: 'center',
      padding: '60px 20px 40px 20px',
      maxWidth: '900px',
      margin: '0 auto'
    }}>
      {/* Small Badge matching Image 1: ✧ YOUR AI GROWTH TEAM */}
      <div style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        border: '1px solid var(--border-medium)',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '9999px',
        padding: '5px 14px',
        fontSize: '0.72rem',
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: 'var(--accent-terracotta)',
        marginBottom: '24px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)'
      }}>
        <span>✧</span>
        <span>YOUR AI OPERATIONAL TEAM</span>
      </div>

      {/* Main Headline (Newsreader Serif matching Image 1) */}
      <h1 className="font-serif-headline" style={{
        fontSize: 'clamp(2.8rem, 6vw, 4.2rem)',
        lineHeight: 1.12,
        color: 'var(--text-primary)',
        marginBottom: '20px'
      }}>
        AI teammates <br />
        for retail scaling{' '}
        <span style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '38px',
          height: '38px',
          borderRadius: '8px',
          backgroundColor: 'var(--accent-terracotta)',
          color: '#ffffff',
          verticalAlign: 'middle',
          marginLeft: '4px'
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </span>
      </h1>

      {/* Subtitle */}
      <p style={{
        fontSize: '1.08rem',
        color: 'var(--text-secondary)',
        lineHeight: 1.6,
        maxWidth: '680px',
        margin: '0 auto 32px auto'
      }}>
        Diligent helps Indian SMBs eliminate stockouts, liquidate dead inventory with evidence, optimize division shifts, and turn every daily POS scan into a compounding business brain.
      </p>

      {/* Action Buttons matching Image 1 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        <button
          onClick={onTriggerConsensus}
          className="btn-terracotta"
          style={{ padding: '12px 28px', fontSize: '0.95rem' }}
        >
          <span>Convene Virtual Board</span>
          <ArrowRight size={16} />
        </button>

        <button
          onClick={onNavigateToLoop}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.92rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 14px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-terracotta)'}
          onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
        >
          <span>See operational loop</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </section>
  );
}
