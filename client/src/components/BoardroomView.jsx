import React, { useState } from 'react';
import { Users, Sparkles, TrendingUp, Package, Megaphone, CheckCircle, ArrowRight, ShieldCheck, Play, Zap } from 'lucide-react';

export default function BoardroomView({ consensusData, onTriggerConsensus, isRunning, onExecuteAction }) {
  const [activeRoadmapDay, setActiveRoadmapDay] = useState('30');

  const agents = [
    {
      name: "Billing & Inventory Agent",
      role: "Telemetry & Stock Turnover",
      icon: Package,
      color: "#38bdf8",
      status: "Telemetry Live"
    },
    {
      name: "Sales & CRM Agent",
      role: "Customer LTV & Retention",
      icon: Users,
      color: "#34d399",
      status: "Cohort Analyzed"
    },
    {
      name: "Strategy & Scaling Agent",
      role: "Virtual Board Chair & Capital Optimization",
      icon: TrendingUp,
      color: "#c084fc",
      status: "Synthesizing"
    },
    {
      name: "Web & Marketing Agent",
      role: "Headless CMS & Content Engine",
      icon: Megaphone,
      color: "#fbbf24",
      status: "Campaigns Queued"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner / Session Trigger */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '20px',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.6) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
              Virtual Board of Directors
            </h2>
            <span className="badge-purple">
              <Sparkles size={12} /> Autonomous Swarm Consensus
            </span>
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '650px' }}>
            A synchronized swarm of specialized AI agents continuously evaluating inventory telemetry, customer churn, and marketing opportunities to author concrete growth blueprints for SMB scaling.
          </p>
        </div>

        <button
          className="btn-primary"
          onClick={onTriggerConsensus}
          disabled={isRunning}
          style={{
            padding: '12px 24px',
            fontSize: '0.95rem',
            background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 100%)',
            boxShadow: '0 4px 20px rgba(124, 58, 237, 0.4)'
          }}
        >
          {isRunning ? (
            <>
              <div className="pulse-dot" style={{ backgroundColor: '#ffffff' }} />
              <span>Agents Deliberating Consensus...</span>
            </>
          ) : (
            <>
              <Play size={16} fill="#ffffff" />
              <span>Convene Swarm Consensus Session</span>
            </>
          )}
        </button>
      </div>

      {/* 4 Agent Swarm Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '16px'
      }}>
        {agents.map((ag, i) => {
          const Icon = ag.icon;
          return (
            <div key={i} className="glass-panel" style={{ padding: '18px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  backgroundColor: `${ag.color}18`,
                  border: `1px solid ${ag.color}40`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icon size={18} color={ag.color} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{ag.name}</h4>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{ag.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: ag.color, fontWeight: 600 }}>{ag.status}</span>
                <div className="pulse-dot" style={{ backgroundColor: ag.color }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Results Section */}
      {consensusData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Executive Thesis Card */}
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #7c3aed' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} color="#c084fc" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Executive Growth Thesis</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-emerald">Consensus: {consensusData.consensusAlignmentScore || '98.4%'}</span>
                <span className="badge-blue">Session #{consensusData.sessionId?.slice(-6)}</span>
              </div>
            </div>
            <p style={{ fontSize: '0.95rem', color: '#e2e8f0', lineHeight: 1.7, marginBottom: '18px' }}>
              {consensusData.strategyReport?.executiveThesis}
            </p>

            {/* Projected KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '16px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Expected Revenue Boost</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#34d399' }}>
                  {consensusData.strategyReport?.projectedMetrics?.expectedRevenueBoost || '+28.5%'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Inventory Velocity Gain</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8' }}>
                  {consensusData.strategyReport?.projectedMetrics?.inventoryTurnoverIncrease || '2.1x Turnover'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Liquidated Working Capital</span>
                <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fbbf24' }}>
                  {consensusData.strategyReport?.projectedMetrics?.projectedWorkingCapitalGain || '₹2,10,000'}
                </div>
              </div>
            </div>
          </div>

          {/* 30-60-90 Day Scaling Plan */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '16px' }}>
              SMB Scaling Roadmap: Small to Medium Enterprise
            </h3>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              {['30', '60', '90'].map(day => (
                <button
                  key={day}
                  onClick={() => setActiveRoadmapDay(day)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    border: activeRoadmapDay === day ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                    backgroundColor: activeRoadmapDay === day ? 'rgba(56, 189, 248, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    color: activeRoadmapDay === day ? '#38bdf8' : 'var(--text-muted)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  Day {day} Milestone
                </button>
              ))}
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              padding: '18px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              fontSize: '0.9rem',
              color: '#e2e8f0',
              lineHeight: 1.6
            }}>
              <strong>Focus & Execution:</strong> {consensusData.strategyReport?.roadmap30_60_90?.[`day${activeRoadmapDay}`]}
            </div>
          </div>

          {/* Capital Reallocation & Human-in-the-Loop Safeguard Action Items */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '20px'
          }}>
            {/* Capital Matrix */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginBottom: '12px' }}>
                Capital Reallocation Matrix
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {consensusData.strategyReport?.capitalReallocation?.liquidationAction}
              </p>
              <div style={{
                backgroundColor: 'rgba(56, 189, 248, 0.05)',
                border: '1px solid rgba(56, 189, 248, 0.2)',
                padding: '12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                color: '#bae6fd'
              }}>
                <strong>Reinvestment Target:</strong> {consensusData.strategyReport?.capitalReallocation?.reinvestmentTarget}
              </div>
            </div>

            {/* Actionable Human-in-the-Loop Checklist */}
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                  Safeguard Execution Queue
                </h4>
                <span className="badge-amber">Human-in-the-Loop</span>
              </div>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                Each autonomous step requires merchant approval before modifying store stock or launching marketing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {consensusData.actionableSteps?.map(step => (
                  <div key={step.id} style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-color)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>{step.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{step.description}</div>
                    </div>
                    <button
                      className="btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.78rem', flexShrink: 0 }}
                      onClick={() => onExecuteAction(step)}
                    >
                      <CheckCircle size={13} />
                      <span>Approve</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
