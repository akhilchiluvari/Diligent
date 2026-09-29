import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, Sparkles, Play } from 'lucide-react';

export default function OperatingJourney({ onOpenCopilotWithContext, onTriggerConsensus }) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);

  const steps = [
    {
      num: '01',
      agent: 'DILI',
      agentShort: 'Di',
      title: 'Understand',
      desc: 'Dili continuously digests your store catalog, customer basket histories, and billing telemetry, building a persistent foundation that every other teammate works from.',
      cardTitle: 'STORE PROFILE by Dili',
      cardMetrics: [
        { label: 'Business Model', val: 'Hybrid Supermart & Consumer Electronics' },
        { label: 'Monitored Pipeline', val: '10 catalog SKUs across 3 active shifts' },
        { label: 'Telemetry Engine', val: 'Groq 120B LPU + Edge Barcode Ingestion' },
        { label: 'Liability Status', val: 'Compliance waiver verified & logged' }
      ]
    },
    {
      num: '02',
      agent: 'INDY',
      agentShort: 'In',
      title: 'Audit & Velocity',
      desc: 'Indy analyzes SKU-level turnover velocity on every POS scan. It catches stockouts before shelves empty and identifies trapped working capital in dead inventory.',
      cardTitle: 'STOCK VELOCITY SNAPSHOT by Indy',
      cardMetrics: [
        { label: 'Critical Alert', val: 'Amul Butter 500g at 8 units (Threshold: 20)' },
        { label: 'Depletion Rate', val: '10.4 units/day (18h runway remaining)' },
        { label: 'Trapped Capital', val: '₹1,48,200 illiquid across 4 dead SKUs' },
        { label: 'Action Proposed', val: 'Auto-draft PO-2026-0899 for 120 units' }
      ]
    },
    {
      num: '03',
      agent: 'STRAT',
      agentShort: 'St',
      title: 'Consensus & Roadmap',
      desc: 'Strat acts as the Virtual Board of Directors, convening the agent swarm to author a 30-60-90 day scaling plan and capital reallocation matrix to elevate revenue tiers.',
      cardTitle: 'SCALING DIRECTIVE by Strat',
      cardMetrics: [
        { label: 'GMV Target', val: 'Transition from ₹15L/mo to ₹35L/mo' },
        { label: 'Liquidation Gain', val: 'Recover ₹1.15L from slow lamps & jugs' },
        { label: 'Reinvestment', val: 'Scale boAt audio at 43% gross margin' },
        { label: 'Projected Growth', val: '+28.5% Gross Revenue Boost' }
      ]
    },
    {
      num: '04',
      agent: 'MAYA',
      agentShort: 'Ma',
      title: 'Marketing & Distribution',
      desc: 'Maya authors hyper-localized campaigns tied directly to store inventory—pushing dynamic Headless CMS banners, WhatsApp VIP broadcasts, and 15s Instagram reels.',
      cardTitle: 'CAMPAIGN MATRIX by Maya',
      cardMetrics: [
        { label: 'Active Campaign', val: 'Madhapur Tech & Festive Flash Clearance' },
        { label: 'Target Item', val: 'Nordic Smart LED Desk Lamp (25% off)' },
        { label: 'Channels', val: 'Instagram Feed/Reel + WhatsApp Broadcast' },
        { label: 'Local Flavor', val: 'Tailored for Cyber Towers tech commuters' }
      ]
    },
    {
      num: '05',
      agent: 'LEX',
      agentShort: 'Le',
      title: 'Safeguard & Execute',
      desc: 'Lex enforces strict legal liability abstraction and presents a human-in-the-loop confirmation modal before any price change, distributor order, or broadcast is executed.',
      cardTitle: 'COMPLIANCE GATEWAY by Lex',
      cardMetrics: [
        { label: 'Legal Waiver', val: '100% Operational Liability Assumption' },
        { label: 'Approval Mode', val: 'Human-in-the-Loop Gateway Enforced' },
        { label: 'Audit Trail', val: 'Immutable event logged with client IP' },
        { label: 'Safety Check', val: 'Merchant authorized before live mutation' }
      ]
    }
  ];

  const current = steps[activeStepIndex];

  return (
    <div style={{ margin: '50px 0' }}>
      {/* Subtitle & Headline matching reference Image 2 */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          color: 'var(--accent-terracotta)',
          marginBottom: '6px'
        }}>
          THE OPERATING JOURNEY
        </div>
        <h2 className="font-serif-headline" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          One loop, run every day.
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '680px' }}>
          From initial barcode scan to compounding earnings, every operational decision moves through the same evidence-backed multi-agent loop, with your approval at every gate.
        </p>
      </div>

      {/* Interactive Step Navigator */}
      <div className="card-clean" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(280px, 340px) 1fr',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Left Step Timeline */}
        <div style={{
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '20px'
        }}>
          {steps.map((st, i) => {
            const isActive = i === activeStepIndex;
            return (
              <div
                key={i}
                onClick={() => setActiveStepIndex(i)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '10px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0, 0, 0, 0.05)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isActive ? 'var(--accent-terracotta)' : '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  fontFamily: 'Newsreader, serif',
                  flexShrink: 0
                }}>
                  {st.agentShort}
                </div>

                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>
                    {st.num} • {st.agent}
                  </div>
                  <div style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    color: isActive ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                    fontFamily: 'Newsreader, serif'
                  }}>
                    {st.title}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Active Step Details */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
          <div>
            <div style={{ fontSize: '0.74rem', fontWeight: 700, letterSpacing: '0.06em', color: 'var(--accent-terracotta)', marginBottom: '4px' }}>
              STEP {current.num} • {current.agent}
            </div>
            <h3 className="font-serif-headline" style={{ fontSize: '2rem', color: 'var(--text-primary)', marginBottom: '12px' }}>
              {current.title}
            </h3>
            <p style={{ fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '24px' }}>
              {current.desc}
            </p>

            {/* Browser Preview Card (● ● ● Header) */}
            <div className="card-clean" style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--border-medium)'
            }}>
              <div className="browser-header">
                <div className="browser-dot" />
                <div className="browser-dot" />
                <div className="browser-dot" />
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-tertiary)', marginLeft: '6px', letterSpacing: '0.05em' }}>
                  {current.cardTitle}
                </span>
              </div>

              <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {current.cardMetrics.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{m.label}</span>
                    <span style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: '65%', textAlign: 'right' }}>
                      {m.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              onClick={onTriggerConsensus}
              className="btn-terracotta"
            >
              <Play size={14} fill="#ffffff" />
              <span>Convene Full Swarm Loop</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
