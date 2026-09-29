import React from 'react';
import { Users, Award, Clock, Sparkles } from 'lucide-react';

export default function WorkforceView({ employees, onOpenCopilotWithContext }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Header */}
      <div className="card-surface" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--accent-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent)'
            }}>
              <Users size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Workforce Intelligence & Roster Productivity
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Sales tracked per associate, counter efficiency scores, and AI shift scheduling recommendations.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithContext({
              type: 'WORKFORCE_OPTIMIZATION',
              title: 'Store Workforce Optimization',
              details: `Active staff: ${employees?.map(e => `${e.name} (Sales: ₹${e.salesGeneratedThisMonth})`).join(', ')}`
            })}
            className="btn-agent-trigger"
          >
            <Sparkles size={12} /> Ask Agent to Optimize Shifts
          </button>
        </div>
      </div>

      {/* Grid of Associates */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '14px'
      }}>
        {employees?.map(emp => (
          <div key={emp.id} className="card-surface" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div>
                <h4 style={{ fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)' }}>{emp.name}</h4>
                <p style={{ fontSize: '0.74rem', color: 'var(--accent-light)', fontWeight: 500 }}>{emp.role}</p>
              </div>
              <span className={emp.efficiencyScore >= 94 ? "badge-clean badge-clean-emerald" : "badge-clean badge-clean-blue"}>
                {emp.efficiencyScore}% Score
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '12px' }}>
              <Clock size={12} />
              <span>{emp.shift}</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '10px 12px',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>BILLED SALES</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  ₹{emp.salesGeneratedThisMonth?.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>AVG BASKET</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--badge-emerald-text)' }}>
                  {emp.avgBasketValue ? `₹${emp.avgBasketValue}` : 'N/A'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>TRANSACTIONS</span>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {emp.transactionsCount} bills
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-tertiary)', fontWeight: 600 }}>UPSELL CONV</span>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--badge-amber-text)' }}>
                  {emp.upsellSuccessRate}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>
                Salary: ₹{emp.monthlySalary?.toLocaleString('en-IN')}
              </span>
              <button
                onClick={() => onOpenCopilotWithContext({
                  type: 'EMPLOYEE_EVALUATION',
                  title: `Associate Evaluation: ${emp.name}`,
                  details: `Role: ${emp.role}, Shift: ${emp.shift}, Monthly Sales: ₹${emp.salesGeneratedThisMonth}, Transactions: ${emp.transactionsCount}, Avg Basket: ₹${emp.avgBasketValue}, Efficiency: ${emp.efficiencyScore}%, Upsell Rate: ${emp.upsellSuccessRate}`
                })}
                className="btn-agent-trigger"
              >
                <Sparkles size={11} /> Ask Agent
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
