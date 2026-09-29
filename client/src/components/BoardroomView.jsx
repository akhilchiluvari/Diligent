import React, { useState } from 'react';
import { Users, Sparkles, TrendingUp, Package, Megaphone, CheckCircle, Play, Zap, ArrowRight } from 'lucide-react';

export default function BoardroomView({ consensusData, onTriggerConsensus, isRunning, onExecuteAction, onOpenCopilotWithContext }) {
  const [activeRoadmapDay, setActiveRoadmapDay] = useState('30');

  const agents = [
    {
      name: "Billing & Inventory Agent",
      role: "Telemetry & Stock Turnover",
      icon: Package,
      status: "Telemetry Live",
      badgeType: "blue"
    },
    {
      name: "Sales & CRM Agent",
      role: "Customer LTV & Retention",
      icon: Users,
      status: "Cohort Analyzed",
      badgeType: "emerald"
    },
    {
      name: "Strategy & Scaling Agent",
      role: "Virtual Board Chair & Capital Optimization",
      icon: TrendingUp,
      status: "Consensus Active",
      badgeType: "accent"
    },
    {
      name: "Web & Marketing Agent",
      role: "Headless CMS & Content Engine",
      icon: Megaphone,
      status: "Campaigns Queued",
      badgeType: "amber"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner / Session Trigger */}
      <div className="card-surface" style={{ padding: '22px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Virtual Board of Directors
              </h2>
              <span className="badge-clean badge-clean-accent">
                <Sparkles size={11} /> Autonomous Swarm Consensus
              </span>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '640px' }}>
              Synchronized multi-agent system analyzing inventory velocity, customer churn, and marketing opportunities to author concrete growth blueprints for SMB scaling.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => onOpenCopilotWithContext({
                type: 'STRATEGY_DEEP_DIVE',
                title: 'Virtual Boardroom Growth Strategy',
                details: consensusData ? `Executive Thesis: ${consensusData.strategyReport?.executiveThesis}` : 'Discuss store scaling roadmap and capital allocation.'
              })}
              className="btn-agent-trigger"
            >
              <Sparkles size={12} /> Ask Agent About Roadmap
            </button>

            <button
              className="btn-solid-primary"
              onClick={onTriggerConsensus}
              disabled={isRunning}
            >
              {isRunning ? (
                <>
                  <div className="pulse-indicator" style={{ backgroundColor: '#ffffff' }} />
                  <span>Agents Deliberating...</span>
                </>
              ) : (
                <>
                  <Play size={14} fill="#ffffff" />
                  <span>Convene Consensus Session</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 4 Agent Status Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
        gap: '12px'
      }}>
        {agents.map((ag, i) => {
          const Icon = ag.icon;
          return (
            <div key={i} className="card-surface" style={{ padding: '14px 16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent)'
                }}>
                  <Icon size={16} />
                </div>
                <div>
                  <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{ag.name}</h4>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{ag.role}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '8px' }}>
                <span className={`badge-clean badge-clean-${ag.badgeType}`}>{ag.status}</span>
                <div className="pulse-indicator" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Output */}
      {consensusData && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Executive Thesis Card */}
          <div className="card-surface" style={{ padding: '20px', borderLeft: '4px solid var(--accent)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={16} color="var(--accent)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>Executive Growth Thesis</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="badge-clean badge-clean-emerald">Consensus: {consensusData.consensusAlignmentScore || '98.4%'}</span>
                <span className="badge-clean badge-clean-blue">Session #{consensusData.sessionId?.slice(-6)}</span>
              </div>
            </div>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '16px' }}>
              {consensusData.strategyReport?.executiveThesis}
            </p>

            {/* Projected KPIs */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '10px',
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '12px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>PROJECTED REVENUE BOOST</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--badge-emerald-text)' }}>
                  {consensusData.strategyReport?.projectedMetrics?.expectedRevenueBoost || '+28.5%'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>INVENTORY VELOCITY</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--badge-blue-text)' }}>
                  {consensusData.strategyReport?.projectedMetrics?.inventoryTurnoverIncrease || '2.1x Turnover'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>WORKING CAPITAL RECOVERED</span>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--badge-amber-text)' }}>
                  {consensusData.strategyReport?.projectedMetrics?.projectedWorkingCapitalGain || '₹2,10,000'}
                </div>
              </div>
            </div>
          </div>

          {/* 30-60-90 Day Scaling Plan */}
          <div className="card-surface" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              SMB Scaling Roadmap: Small to Medium Enterprise
            </h3>

            <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              {['30', '60', '90'].map(day => (
                <button
                  key={day}
                  onClick={() => setActiveRoadmapDay(day)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: activeRoadmapDay === day ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    backgroundColor: activeRoadmapDay === day ? 'var(--accent-subtle)' : 'transparent',
                    color: activeRoadmapDay === day ? 'var(--accent-light)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.78rem'
                  }}
                >
                  Day {day} Milestone
                </button>
              ))}
            </div>

            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '14px 16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)',
              fontSize: '0.86rem',
              color: 'var(--text-primary)',
              lineHeight: 1.6
            }}>
              <strong>Focus & Execution:</strong> {consensusData.strategyReport?.roadmap30_60_90?.[`day${activeRoadmapDay}`]}
            </div>
          </div>

          {/* Capital Matrix & Human-in-the-Loop Action Checklist */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            <div className="card-surface" style={{ padding: '18px' }}>
              <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--accent-light)', marginBottom: '8px' }}>
                Capital Reallocation Matrix
              </h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                {consensusData.strategyReport?.capitalReallocation?.liquidationAction}
              </p>
              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '10px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                color: 'var(--text-primary)'
              }}>
                <strong>Reinvestment Target:</strong> {consensusData.strategyReport?.capitalReallocation?.reinvestmentTarget}
              </div>
            </div>

            <div className="card-surface" style={{ padding: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--badge-emerald-text)' }}>
                  Safeguard Execution Queue
                </h4>
                <span className="badge-clean badge-clean-amber">Human-in-the-Loop</span>
              </div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', marginBottom: '10px' }}>
                Merchant authorization required before updating inventory or firing marketing.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {consensusData.actionableSteps?.map(step => (
                  <div key={step.id} style={{
                    backgroundColor: 'var(--bg-surface-elevated)',
                    border: '1px solid var(--border-subtle)',
                    padding: '10px 12px',
                    borderRadius: '7px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-primary)' }}>{step.title}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{step.description}</div>
                    </div>
                    <button
                      className="btn-solid-primary"
                      style={{ padding: '5px 10px', fontSize: '0.74rem', flexShrink: 0 }}
                      onClick={() => onExecuteAction(step)}
                    >
                      <CheckCircle size={12} />
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
