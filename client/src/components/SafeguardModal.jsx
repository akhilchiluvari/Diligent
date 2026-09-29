import React from 'react';
import { ShieldCheck, AlertCircle, CheckCircle2, X } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function SafeguardModal({ isOpen, onClose, actionItem, onConfirmAction, termsAccepted }) {
  if (!isOpen || !actionItem) return null;

  const handleExecute = async () => {
    try {
      await onConfirmAction(actionItem);
      // Trigger confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Confetti optional
      }
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 110,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{
        maxWidth: '520px',
        width: '100%',
        padding: '28px',
        backgroundColor: '#0c1322',
        border: '1px solid rgba(52, 211, 153, 0.4)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <ShieldCheck size={22} color="#34d399" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Human-in-the-Loop Safeguard
              </h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Stage 3 Consensus Authorization
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid var(--border-color)',
          padding: '16px',
          borderRadius: '10px',
          marginBottom: '20px'
        }}>
          <span style={{ fontSize: '0.72rem', color: '#38bdf8', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
            PROPOSED ACTION ({actionItem.category})
          </span>
          <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '6px' }}>
            {actionItem.title}
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
            {actionItem.description}
          </p>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#34d399' }}>
            Author Agent: <strong>{actionItem.agent}</strong>
          </div>
        </div>

        {!termsAccepted && (
          <div style={{
            backgroundColor: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            padding: '10px 14px',
            borderRadius: '8px',
            marginBottom: '16px',
            fontSize: '0.78rem',
            color: '#fb7185',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>Liability Waiver must be accepted first before executing real-world actions.</span>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Dismiss
          </button>
          <button
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)'
            }}
            onClick={handleExecute}
            disabled={!termsAccepted}
          >
            <CheckCircle2 size={16} />
            <span>Authorize & Execute Action</span>
          </button>
        </div>
      </div>
    </div>
  );
}
