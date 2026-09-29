import React from 'react';
import { Users, Award, Clock, DollarSign, ArrowUpRight, Zap, Target } from 'lucide-react';

export default function WorkforceView({ employees }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={22} color="#c084fc" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
              Workforce Intelligence & Associate Performance
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time POS sales tracking per associate, shift productivity, and AI commission recommendations.
            </p>
          </div>
        </div>
        <span className="badge-purple">
          <Award size={12} /> Shift Optimization Live
        </span>
      </div>

      {/* Employee Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '18px'
      }}>
        {employees?.map(emp => (
          <div key={emp.id} className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>{emp.name}</h4>
                <p style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500 }}>{emp.role}</p>
              </div>
              <span className={emp.efficiencyScore >= 94 ? "badge-emerald" : "badge-blue"}>
                {emp.efficiencyScore}% Efficiency
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              <Clock size={13} />
              <span>{emp.shift}</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '14px'
            }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>MONTHLY SALES</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>
                  ₹{emp.salesGeneratedThisMonth?.toLocaleString('en-IN')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>AVG BASKET VALUE</span>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#34d399' }}>
                  {emp.avgBasketValue ? `₹${emp.avgBasketValue}` : 'N/A'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>TRANSACTIONS</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
                  {emp.transactionsCount} bills
                </div>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>UPSELL CONVERSION</span>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fbbf24' }}>
                  {emp.upsellSuccessRate}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Base Salary: ₹{emp.monthlySalary?.toLocaleString('en-IN')}</span>
              <span style={{ color: '#38bdf8', fontWeight: 600 }}>Attendance: {emp.attendanceRate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Workforce Strategy Insight */}
      <div className="glass-panel" style={{ padding: '20px', borderLeft: '4px solid #38bdf8' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
          <Target size={18} color="#38bdf8" />
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>
            Workforce Scaling Directive (Strategy & CRM Agent)
          </h4>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Pooja Sharma generates 44% of total counter volume with a 96% efficiency rating. Implement a 2.5% incentive bonus on high-margin boAt audio sales. Realign Rahul Varma's schedule to 17:30 - 21:30 to maximize footfall conversions as tech professionals return to Madhapur from Cyber Gateway.
        </p>
      </div>
    </div>
  );
}
