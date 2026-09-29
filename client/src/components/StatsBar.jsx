import React from 'react';
import { TrendingUp, Package, AlertTriangle, Users, Flame, Sparkles } from 'lucide-react';

export default function StatsBar({ stats, onNavigateToMarketing, onNavigateToInventory, onOpenCopilotWithContext }) {
  if (!stats) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
      gap: '14px',
      margin: '20px 0 24px 0'
    }}>
      {/* Monthly Sales */}
      <div className="card-surface" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
            MONTHLY GROSS SALES
          </span>
          <TrendingUp size={15} color="var(--accent)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          ₹{stats.totalSalesMonth?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <span className="badge-clean badge-clean-emerald">+24.8% MoM</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{stats.totalUnitsSold} units billed</span>
        </div>
      </div>

      {/* Inventory Assets */}
      <div
        className="card-interactive"
        style={{ padding: '16px 18px' }}
        onClick={onNavigateToInventory}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
            TOTAL INVENTORY CAPITAL
          </span>
          <Package size={15} color="var(--badge-blue-text)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          ₹{stats.totalInventoryValue?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
          <span className="badge-clean badge-clean-blue">₹{stats.potentialMargin?.toLocaleString('en-IN')} Margin</span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>Retail: ₹{stats.totalRetailValue?.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Trapped Capital in Dead Stock */}
      <div className="card-surface" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--badge-amber-text)', fontWeight: 600, letterSpacing: '0.04em' }}>
            TRAPPED WORKING CAPITAL
          </span>
          <Flame size={15} color="var(--badge-amber-text)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          ₹{stats.deadStockValue?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span className="badge-clean badge-clean-amber">4 Stagnant SKUs</span>
          <button
            onClick={() => onOpenCopilotWithContext({
              type: 'DEAD_STOCK',
              title: '₹1.48L Trapped Capital',
              details: `4 stagnant products: Nordic Smart Lamp, Himalayan Chia Seeds, Handcrafted Copper Jug, SoundWave Rugged Speaker. Capital locked: ₹${stats.deadStockValue}`
            })}
            className="btn-agent-trigger"
          >
            <Sparkles size={11} /> Ask Agent
          </button>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <div className="card-surface" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--badge-rose-text)', fontWeight: 600, letterSpacing: '0.04em' }}>
            STOCKOUT HAZARDS
          </span>
          <AlertTriangle size={15} color="var(--badge-rose-text)" />
        </div>
        <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
          {stats.lowStockCount || 0} Products
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
          <span className="badge-clean badge-clean-rose">Amul Butter (8 left)</span>
          <button
            onClick={() => onOpenCopilotWithContext({
              type: 'LOW_STOCK',
              title: 'Critical Stockout: Amul Butter 500g',
              details: 'Current stock: 8 units. Minimum threshold: 20. Depletion rate: 10.4 units/day (~18h runway).'
            })}
            className="btn-agent-trigger"
          >
            <Sparkles size={11} /> Auto-PO
          </button>
        </div>
      </div>

      {/* Star Associate */}
      <div className="card-surface" style={{ padding: '16px 18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)', fontWeight: 600, letterSpacing: '0.04em' }}>
            TOP ASSOCIATE
          </span>
          <Users size={15} color="var(--accent)" />
        </div>
        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px' }}>
          {stats.topEmployee?.name || 'Pooja Sharma'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
          <span className="badge-clean badge-clean-accent">
            ₹{stats.topEmployee?.salesGeneratedThisMonth?.toLocaleString('en-IN')} Billed
          </span>
          <span style={{ fontSize: '0.74rem', color: 'var(--text-tertiary)' }}>{stats.topEmployee?.efficiencyScore}% Efficiency</span>
        </div>
      </div>
    </div>
  );
}
