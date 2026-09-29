import React from 'react';
import { Terminal, Shield, AlertTriangle, Info, CheckCircle2, Clock } from 'lucide-react';

export default function AuditLogsView({ logs }) {
  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'WARNING':
        return <span className="badge-amber"><AlertTriangle size={11} /> WARNING</span>;
      case 'ACTION_REQUIRED':
        return <span className="badge-rose"><AlertTriangle size={11} /> ACTION</span>;
      case 'COMPLIANCE':
        return <span className="badge-purple"><Shield size={11} /> COMPLIANCE</span>;
      default:
        return <span className="badge-blue"><Info size={11} /> INFO</span>;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Terminal size={18} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Immutable Telemetry & Audit Trail
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Real-time audit log of hardware POS scans, inventory alerts, and autonomous agent decisions.
            </p>
          </div>
        </div>
        <span className="badge-emerald">Live Stream Active</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs?.map(log => (
          <div
            key={log.id}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid var(--border-color)',
              padding: '12px 16px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '14px',
              flexWrap: 'wrap'
            }}
          >
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', flex: 1, minWidth: '260px' }}>
              <div style={{ marginTop: '2px' }}>{getSeverityBadge(log.severity)}</div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#ffffff', marginBottom: '2px' }}>
                  {log.detail}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', gap: '8px' }}>
                  <span style={{ color: '#38bdf8' }}>Agent: {log.agent}</span>
                  <span>•</span>
                  <span style={{ fontFamily: 'monospace' }}>Type: {log.type}</span>
                </div>
              </div>
            </div>

            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={12} />
              <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
