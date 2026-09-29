import React from 'react';
import { TrendingUp, Package, AlertTriangle, Users, Flame, IndianRupee } from 'lucide-react';

export default function StatsBar({ stats, onNavigateToMarketing, onNavigateToInventory }) {
  if (!stats) return null;

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
      gap: '16px',
      margin: '24px 0'
    }}>
      {/* Gross Revenue */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>MONTHLY GROSS SALES</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <TrendingUp size={16} color="#38bdf8" />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          ₹{stats.totalSalesMonth?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
          <span className="badge-emerald">+24.8% vs last mo</span>
          <span style={{ color: 'var(--text-muted)' }}>{stats.totalUnitsSold} units billed</span>
        </div>
      </div>

      {/* Inventory Asset Value */}
      <div
        className="glass-card-interactive"
        style={{ padding: '18px 20px' }}
        onClick={onNavigateToInventory}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOTAL INVENTORY ASSET</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Package size={16} color="#34d399" />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          ₹{stats.totalInventoryValue?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Retail potential: ₹{stats.totalRetailValue?.toLocaleString('en-IN')}</span>
          <span className="badge-blue">₹{stats.potentialMargin?.toLocaleString('en-IN')} margin</span>
        </div>
      </div>

      {/* Trapped Capital / Dead Stock */}
      <div
        className="glass-card-interactive"
        style={{ padding: '18px 20px', borderLeft: '3px solid #f59e0b' }}
        onClick={onNavigateToMarketing}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#fbbf24', fontWeight: 600 }}>TRAPPED DEAD STOCK CAPITAL</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(245, 158, 11, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Flame size={16} color="#fbbf24" />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          ₹{stats.deadStockValue?.toLocaleString('en-IN') || '0'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
          <span className="badge-amber">4 Stagnant SKUs</span>
          <span style={{ color: '#fbbf24', fontWeight: 600 }}>Click to Liquidate →</span>
        </div>
      </div>

      {/* Low Stock Urgent Alerts */}
      <div
        className="glass-card-interactive"
        style={{ padding: '18px 20px', borderLeft: '3px solid #f43f5e' }}
        onClick={onNavigateToInventory}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: '#fb7185', fontWeight: 600 }}>CRITICAL STOCKOUT HAZARD</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(244, 63, 94, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={16} color="#fb7185" />
          </div>
        </div>
        <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', letterSpacing: '-0.02em' }}>
          {stats.lowStockCount || 0} Products
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
          <span className="badge-rose">Amul Butter (8 left)</span>
          <span style={{ color: 'var(--text-muted)' }}>Auto-PO ready</span>
        </div>
      </div>

      {/* Star Associate */}
      <div className="glass-panel" style={{ padding: '18px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>TOP PERFORMING ASSOCIATE</span>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            backgroundColor: 'rgba(139, 92, 246, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={16} color="#c084fc" />
          </div>
        </div>
        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginTop: '4px' }}>
          {stats.topEmployee?.name || 'Pooja Sharma'}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.78rem' }}>
          <span className="badge-purple">₹{stats.topEmployee?.salesGeneratedThisMonth?.toLocaleString('en-IN')} billed</span>
          <span style={{ color: 'var(--text-muted)' }}>{stats.topEmployee?.efficiencyScore}% score</span>
        </div>
      </div>
    </div>
  );
}
