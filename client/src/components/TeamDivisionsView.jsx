import React, { useState } from 'react';
import { Users, Award, Clock, ArrowRight, Sparkles, Building, UserPlus, Zap, CheckCircle2 } from 'lucide-react';

export default function TeamDivisionsView({ employees, onOpenCopilotWithContext }) {
  const [selectedDivisionIndex, setSelectedDivisionIndex] = useState(0);

  const divisions = [
    {
      name: 'POS Billing & Customer Checkout',
      lead: 'Pooja Sharma',
      leadRole: 'Senior POS Cashier & Client Lead',
      headcount: 2,
      members: ['Pooja Sharma (Senior Lead)', 'Kiran Kumar (Associate Cashier)'],
      efficiency: '96%',
      monthlySales: '₹4,40,800',
      transactions: '475 bills',
      coordinationProtocol: 'Daily 08:00 AM counter float audit. Instant queue overflow buzzer alerts Floor Sales associate to open counter 2 when queue exceeds 4 customers.',
      expansionPlan: 'Hire 1 Weekend Part-Time Cashier (₹8,000/mo) to absorb Saturday-Sunday evening rushes and reduce wait times by 40%.',
      efficiencyPlaybook: 'Implement a 2.5% tier-2 bonus incentive on boAt accessory upsells to increase average basket value from ₹937 to ₹1,200.'
    },
    {
      name: 'Floor Sales & Electronics Experience',
      lead: 'Rahul Varma',
      leadRole: 'Electronics Floor Specialist',
      headcount: 1,
      members: ['Rahul Varma (Specialist)'],
      efficiency: '88%',
      monthlySales: '₹1,64,200',
      transactions: '115 bills',
      coordinationProtocol: 'Coordinates directly with Web & Marketing Agent (Maya) to physically merchandise featured flash products (e.g. Nordic Lamp display table) matching active Instagram campaigns.',
      expansionPlan: 'Cross-train Kiran Kumar on smart home electronics features so floor coverage is maintained during peak evening hours.',
      efficiencyPlaybook: 'Realign Rahul’s roster to 17:30 - 21:30 to directly engage tech workers returning to Madhapur from Cyber Towers.'
    },
    {
      name: 'Inventory Inward & Supply Chain',
      lead: 'Sunita Devi',
      leadRole: 'Stock Inward & Quality Officer',
      headcount: 1,
      members: ['Sunita Devi (Officer)'],
      efficiency: '94%',
      monthlySales: 'Operational Inward',
      transactions: '100% Verified',
      coordinationProtocol: 'Automated low-stock threshold trigger: when cashier scans bring Amul Butter or Tata Dal under minimum threshold, Sunita receives instant notification to replenish from cold storage.',
      expansionPlan: 'Onboard 1 WhatsApp Delivery Runner (₹12,000/mo) to launch 30-minute hyper-local grocery delivery across Madhapur and Kondapur.',
      efficiencyPlaybook: 'Implement barcode scanner batch verification upon supplier delivery to reduce manual verification time from 45 minutes to 8 minutes per PO.'
    }
  ];

  const currentDiv = divisions[selectedDivisionIndex];

  return (
    <div style={{ margin: '30px 0' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px', marginBottom: '24px' }}>
        <div>
          <div style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--accent-terracotta)', marginBottom: '4px' }}>
            ORGANIZATIONAL ARCHITECTURE
          </div>
          <h2 className="font-serif-headline" style={{ fontSize: '2.2rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
            Team Divisions & Coordination Protocols
          </h2>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
            Real-time division telemetry, inter-team handoff protocols, and AI-authored hiring expansion blueprints for SMB growth.
          </p>
        </div>

        <button
          onClick={() => onOpenCopilotWithContext({
            type: 'TEAM_EXPANSION_STRATEGY',
            title: 'Store Workforce Scaling & Hiring Blueprint',
            details: `Store Divisions: POS Checkout (2 staff), Floor Sales (1 staff), Inventory Inward (1 staff). Current headcount: 4. Monthly GMV: ₹4.4L+ billed.`
          })}
          className="btn-terracotta"
        >
          <Sparkles size={15} />
          <span>Ask Worka to Author Hiring Plan</span>
        </button>
      </div>

      {/* Main Divisions Matrix */}
      <div className="card-clean" style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(260px, 320px) 1fr',
        borderRadius: '16px',
        overflow: 'hidden'
      }}>
        {/* Left Divisions List */}
        <div style={{
          borderRight: '1px solid var(--border-subtle)',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '16px'
        }}>
          {divisions.map((div, idx) => {
            const isActive = idx === selectedDivisionIndex;
            return (
              <div
                key={idx}
                onClick={() => setSelectedDivisionIndex(idx)}
                style={{
                  padding: '14px',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'var(--bg-surface)' : 'transparent',
                  border: isActive ? '1px solid var(--border-medium)' : '1px solid transparent',
                  boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-terracotta)' }}>
                    DIVISION {idx + 1}
                  </span>
                  <span className="badge-clean badge-clean-emerald">{div.efficiency}</span>
                </div>
                <div style={{
                  fontSize: '0.94rem',
                  fontWeight: 700,
                  color: isActive ? 'var(--accent-terracotta)' : 'var(--text-primary)',
                  fontFamily: 'Newsreader, serif',
                  marginBottom: '4px'
                }}>
                  {div.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                  Lead: {div.lead} ({div.headcount} staff)
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Division Details & Recommendations */}
        <div style={{ padding: '30px', backgroundColor: 'var(--bg-surface)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--accent-terracotta)', letterSpacing: '0.05em' }}>
                DIVISION BLUEPRINT
              </div>
              <h3 className="font-serif-headline" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
                {currentDiv.name}
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-tertiary)' }}>
                Lead: <strong>{currentDiv.lead}</strong> ({currentDiv.leadRole}) • Total Headcount: {currentDiv.headcount}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 14px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block' }}>BILLED VOLUME</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currentDiv.monthlySales}</span>
              </div>
              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '8px 14px',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', display: 'block' }}>EFFICIENCY</span>
                <span style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--badge-emerald-text)' }}>{currentDiv.efficiency}</span>
              </div>
            </div>
          </div>

          {/* 3 Interactive Directive Blocks */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '20px' }}>
            {/* Coordination Protocol */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Zap size={16} color="var(--accent-terracotta)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Inter-Division Coordination Protocol
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentDiv.coordinationProtocol}
              </p>
            </div>

            {/* Expansion & Hiring Plan */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: '10px',
              borderLeft: '4px solid var(--accent-terracotta)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <UserPlus size={16} color="var(--accent-terracotta)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Team Expansion & Hiring Priority
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentDiv.expansionPlan}
              </p>
            </div>

            {/* Efficiency Playbook */}
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              padding: '16px',
              borderRadius: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <CheckCircle2 size={16} color="var(--badge-emerald-text)" />
                <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Operational Efficiency & Incentive Playbook
                </h4>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                {currentDiv.efficiencyPlaybook}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
