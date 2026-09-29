import React, { useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';

export default function TeammatesShowcase({ onOpenCopilotWithContext, stats }) {
  const [selectedTeammateId, setSelectedTeammateId] = useState('dili');

  const teammates = [
    {
      id: 'dili',
      short: 'Di',
      name: 'Dili',
      role: 'ORCHESTRATOR • BUSINESS CONTEXT & ROUTING',
      tagline: 'Orchestrator',
      summary: 'Decomposes your queries, maintains store context, and routes work to specialized teammates.',
      input: 'Operator chat queries, merchant voice notes, store performance ledgers',
      output: 'Synthesized executive briefings, cross-agent consensus, and daily operational directives',
      boundary: 'Routes tasks across the swarm and never mutates financial accounts or inventory without explicit merchant approval.',
      artifactTitle: 'STORE OVERVIEW & SYNTHESIS by Dili',
      artifactData: [
        { label: 'Enterprise', val: stats?.businessName || 'Sri Balaji Smart Retail' },
        { label: 'Location', val: 'Madhapur, HITEC City, Hyderabad' },
        { label: 'Active Pipeline', val: `${stats?.productsCount || 10} SKUs monitored across 3 divisions` },
        { label: 'Swarm Status', val: '7 Teammates synchronized on Groq 120B' }
      ]
    },
    {
      id: 'indy',
      short: 'In',
      name: 'Indy',
      role: 'BILLING & REAL-TIME BARCODE INVENTORY',
      tagline: 'Billing & stock velocity',
      summary: 'Natively ingests POS barcode scans, tracks turnover velocity, and flags stockouts before they hit shelves.',
      input: 'Hardware barcode scans (serial-to-web), distributor carton manifests, minimum thresholds',
      output: 'SKU turnover velocities, low-stock reorder recommendations, dead-stock capital audits',
      boundary: 'Generates purchase orders in draft status. Will never transmit supplier payments without cashier/manager PIN.',
      artifactTitle: 'INVENTORY VELOCITY AUDIT by Indy',
      artifactData: [
        { label: 'Critical Alert', val: 'Amul Butter 500g at 8 units (Threshold: 20)' },
        { label: 'Dead Stock Locked', val: `₹${stats?.deadStockValue?.toLocaleString('en-IN') || '1,48,200'} across 4 stagnant SKUs` },
        { label: 'Top Velocity', val: 'boAt Rockerz 255 Pro+ (6.1 units/day)' },
        { label: 'Reorder Queue', val: 'PO-2026-0899 drafted for 120 units' }
      ]
    },
    {
      id: 'cera',
      short: 'Ce',
      name: 'Cera',
      role: 'SALES & CUSTOMER CRM RETENTION',
      tagline: 'Customer LTV & churn',
      summary: 'Analyzes customer transaction histories, detects churn hazards, and formulates automated win-back offers.',
      input: 'POS ticket logs, customer mobile numbers, frequency intervals, basket sizes',
      output: 'Cohort segmentation, churn hazard alerts (e.g. 20-day lapses), front-line cashier upsell scripts',
      boundary: 'Prepares personalized discounts and promotional scripts. Requires merchant approval before firing mass WhatsApp broadcasts.',
      artifactTitle: 'CUSTOMER RETENTION COHORT by Cera',
      artifactData: [
        { label: 'Active Retention', val: '78% 30-day repeat customer rate' },
        { label: 'High Churn Risk', val: 'Meera Joshi (Score: 0.64, 20-day lapse)' },
        { label: 'VIP Spenders', val: 'Ananya Rao (₹58,900 LTV, Platinum Club)' },
        { label: 'Upsell Playbook', val: 'boAt Earphones + SoundWave Companion' }
      ]
    },
    {
      id: 'strat',
      short: 'St',
      name: 'Strat',
      role: 'VIRTUAL BOARD CHAIR & CAPITAL SCALING',
      tagline: 'Capital allocation & scaling',
      summary: 'Synthesizes telemetry across all teammates to author concrete 30-60-90 day roadmaps for SMB tier elevation.',
      input: 'Inventory velocity, gross profit margins, workforce payroll, supplier credit terms',
      output: 'Capital reallocation matrices (liquidating slow stock into high-margin fast movers), quarterly growth roadmaps',
      boundary: 'Provides advisory guidance only. Merchant assumes full legal and financial responsibility under compliance waiver.',
      artifactTitle: 'SMB SCALING BLUEPRINT by Strat',
      artifactData: [
        { label: 'Executive Target', val: 'Scale GMV from ₹15L/mo to ₹35L/mo' },
        { label: 'Capital Recovery', val: 'Liquidate 48 lamps at 25% off to unlock ₹1.15L' },
        { label: 'Reinvestment', val: 'Channel ₹1.15L into boAt audio at 43% margin' },
        { label: 'Projected Gain', val: '+28.5% Gross Revenue Boost' }
      ]
    },
    {
      id: 'maya',
      short: 'Ma',
      name: 'Maya',
      role: 'WEB & MARKETING HEADLESS CMS ENGINE',
      tagline: 'Campaigns & social copy',
      summary: 'Connects directly to store inventory to generate localized Instagram reels, WhatsApp VIP broadcasts, and CMS banners.',
      input: 'Slow-moving SKUs, promotional margin tolerances, local festival calendar (Hyderabad tech corridor)',
      output: 'High-converting Instagram captions, 15s video reels hooks, ready-to-broadcast WhatsApp copy, web banners',
      boundary: 'Authors marketing copy and prepares headless CMS webhooks. Stays in draft mode until merchant authorization.',
      artifactTitle: 'MULTI-CHANNEL CAMPAIGN by Maya',
      artifactData: [
        { label: 'Active Theme', val: 'Madhapur Tech & Festive Flash Clearance' },
        { label: 'Featured Product', val: 'Nordic Smart LED Desk Lamp (25% off)' },
        { label: 'Target Audience', val: 'HITEC City & Gachibowli tech professionals' },
        { label: 'Channel Assets', val: 'Instagram Post, WhatsApp VIP, CMS Banner' }
      ]
    },
    {
      id: 'worka',
      short: 'Wo',
      name: 'Worka',
      role: 'WORKFORCE & DIVISION COORDINATION',
      tagline: 'Staff shifts & division sync',
      summary: 'Tracks individual associate sales, optimizes counter shift schedules, and maps team expansion plans.',
      input: 'Cashier checkout volumes, employee rosters, peak store footfall curves (Cyber Towers commuter spikes)',
      output: 'Division productivity benchmarks, commission incentives, hiring expansion blueprints',
      boundary: 'Suggests roster adjustments and incentive structures. Does not modify employment contracts.',
      artifactTitle: 'DIVISION COORDINATION by Worka',
      artifactData: [
        { label: 'Staff Headcount', val: '4 associates across 3 operational divisions' },
        { label: 'Top Performer', val: 'Pooja Sharma (₹2,48,500 sales, 96% score)' },
        { label: 'Shift Directive', val: 'Move Rahul Varma to 17:30 - 21:30 peak hours' },
        { label: 'Hiring Priority', val: '1 Weekend Cashier + 1 WhatsApp Delivery Runner' }
      ]
    },
    {
      id: 'lex',
      short: 'Le',
      name: 'Lex',
      role: 'LEGAL GATEWAY & LIABILITY COMPLIANCE',
      tagline: 'Strict liability abstraction',
      summary: 'Guarantees platform provider legal insulation and ensures human-in-the-loop review before executing real-world actions.',
      input: 'Agent consensus proposals, Terms & Conditions waiver agreements, operator IP timestamps',
      output: 'Immutable audit logs, liability disclaimer verification, safeguard authorization tokens',
      boundary: 'Blocks any autonomous store modification if merchant liability disclaimer has not been executed.',
      artifactTitle: 'COMPLIANCE AUDIT by Lex',
      artifactData: [
        { label: 'Waiver Status', val: 'Legally Binding Advisory Disclaimer Signed' },
        { label: 'Governing Law', val: 'Hyderabad, Telangana - IT Act 2000' },
        { label: 'Liability Level', val: '100% Merchant Operational Assumption' },
        { label: 'Safeguard Mode', val: 'Human-in-the-Loop Gateway Enforced' }
      ]
    }
  ];

  const currentTeammate = teammates.find(t => t.id === selectedTeammateId) || teammates[0];

  return (
    <div style={{ margin: '40px 0' }}>
      {/* Editorial Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h2 className="font-serif-headline" style={{ fontSize: '2.5rem', color: 'var(--text-primary)', marginBottom: '8px' }}>
          Seven teammates. One payroll line.
        </h2>
        <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto' }}>
          Each teammate has a job, defined inputs and outputs, and a hard approval boundary. Pick one to see what they actually produce.
        </p>
      </div>

      {/* Main Split Showcase Card (Matching Reference Image 3) */}
      <div className="card-clean" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 300px) 1fr',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '480px'
      }}>
        {/* Left Column: Teammates List */}
        <div style={{
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '12px'
        }}>
          {teammates.map(t => {
            const isSelected = t.id === selectedTeammateId;
            return (
              <div
                key={t.id}
                onClick={() => setSelectedTeammateId(t.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 14px',
                  borderRadius: '10px',
                  marginBottom: '6px',
                  cursor: 'pointer',
                  backgroundColor: isSelected ? 'var(--bg-surface)' : 'transparent',
                  boxShadow: isSelected ? '0 2px 8px rgba(0, 0, 0, 0.06)' : 'none',
                  border: isSelected ? '1px solid var(--border-medium)' : '1px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {/* Pill Avatar Icon */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: isSelected ? 'var(--accent-terracotta)' : '#1e293b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  fontFamily: 'Newsreader, serif'
                }}>
                  {t.short}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    color: isSelected ? 'var(--accent-terracotta)' : 'var(--text-primary)'
                  }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>
                    {t.tagline}
                  </div>
                </div>

                {isSelected && <ChevronRight size={16} color="var(--accent-terracotta)" />}
              </div>
            );
          })}
        </div>

        {/* Right Column: Detailed Teammate Breakdown */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', backgroundColor: 'var(--bg-surface)' }}>
          <div>
            {/* Header info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '10px',
                backgroundColor: 'var(--accent-terracotta)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 700,
                fontFamily: 'Newsreader, serif'
              }}>
                {currentTeammate.short}
              </div>
              <div>
                <h3 className="font-serif-headline" style={{ fontSize: '1.5rem', color: 'var(--text-primary)' }}>
                  {currentTeammate.name}
                </h3>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.05em', color: 'var(--accent-terracotta)' }}>
                  {currentTeammate.role}
                </div>
              </div>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '24px' }}>
              {currentTeammate.summary}
            </p>

            {/* Split: Specs vs Live Artifact Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
              {/* Left Specs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
                    INPUT
                  </span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {currentTeammate.input}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>
                    OUTPUT
                  </span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {currentTeammate.output}
                  </p>
                </div>

                <div>
                  <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-terracotta)', letterSpacing: '0.06em' }}>
                    APPROVAL BOUNDARY
                  </span>
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                    {currentTeammate.boundary}
                  </p>
                </div>
              </div>

              {/* Right Live Artifact Card (● ● ● Browser header like reference Image 2 & 3) */}
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
                  <span style={{ fontSize: '0.68rem', fontWeight: 600, color: 'var(--text-tertiary)', marginLeft: '6px', letterSpacing: '0.05em' }}>
                    {currentTeammate.artifactTitle}
                  </span>
                </div>

                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {currentTeammate.artifactData.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                      <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>{item.label}</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600, maxWidth: '65%', textAlign: 'right' }}>
                        {item.val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              onClick={() => onOpenCopilotWithContext({
                type: 'TEAMMATE_TASK',
                title: `${currentTeammate.name} (${currentTeammate.tagline})`,
                details: `Teammate Role: ${currentTeammate.role}. Mission: ${currentTeammate.summary}. Focus output: ${currentTeammate.output}`
              })}
              className="btn-terracotta"
            >
              <Sparkles size={15} />
              <span>Ask {currentTeammate.name} to Run Task</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
