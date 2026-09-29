import React, { useState, useEffect } from 'react';
import { X, Lock, Mail, Store, User, MapPin, Building, ArrowRight, CheckCircle2, AlertCircle, Database } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [tab, setTab] = useState('login'); // 'login' | 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Registration fields
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState('Hybrid Supermarket & Electronics');
  const [location, setLocation] = useState('Madhapur, HITEC City, Hyderabad');
  const [revenueTier, setRevenueTier] = useState('₹15L - ₹35L / month');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cloudStatus, setCloudStatus] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/auth/status')
        .then(r => r.json())
        .then(data => {
          if (data.success) setCloudStatus(data);
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const endpoint = tab === 'register' ? '/api/auth/register' : '/api/auth/login';
      const payload = tab === 'register'
        ? { email, password, name, businessName, category, location, revenueTier }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Authentication failed');
      }

      onAuthSuccess(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('akhil@diligent.ai');
    setPassword('password123');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 120,
      padding: '20px'
    }}>
      <div className="card-clean" style={{
        maxWidth: '500px',
        width: '100%',
        backgroundColor: 'var(--bg-surface)',
        borderRadius: '16px',
        padding: '30px',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 className="font-serif-headline" style={{ fontSize: '1.6rem', color: 'var(--text-primary)' }}>
              {tab === 'login' ? 'Sign in to Diligent' : 'Register Your Enterprise'}
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {tab === 'login' ? 'Access your autonomous multi-agent business console.' : 'Connect your store inventory and configure your virtual board.'}
            </p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-tertiary)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        {/* Tab switch */}
        <div style={{
          display: 'flex',
          backgroundColor: 'var(--bg-surface-elevated)',
          padding: '4px',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={() => { setTab('login'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: tab === 'login' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'login' ? 'var(--accent-terracotta)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: tab === 'login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setError(null); }}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: tab === 'register' ? 'var(--bg-surface)' : 'transparent',
              color: tab === 'register' ? 'var(--accent-terracotta)' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              boxShadow: tab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none'
            }}
          >
            Create Store Account
          </button>
        </div>

        {/* Cloud Connectivity Telemetry Pill */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 12px',
          borderRadius: '8px',
          backgroundColor: cloudStatus?.configured ? 'rgba(16, 185, 129, 0.08)' : 'rgba(234, 88, 12, 0.08)',
          border: cloudStatus?.configured ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(234, 88, 12, 0.25)',
          marginBottom: '16px',
          fontSize: '0.74rem'
        }}>
          <span style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            color: cloudStatus?.configured ? '#10b981' : '#ea580c',
            fontWeight: 600
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              backgroundColor: cloudStatus?.configured ? '#10b981' : '#ea580c',
              boxShadow: cloudStatus?.configured ? '0 0 8px #10b981' : 'none'
            }} />
            <Database size={13} />
            <span>{cloudStatus?.configured ? 'Supabase PostgreSQL Cloud Active' : 'Resilient Offline Store (Supabase Ready)'}</span>
          </span>
          <span style={{ color: 'var(--text-tertiary)', fontSize: '0.68rem', fontFamily: 'monospace' }}>
            {cloudStatus?.poolerType || 'Port 6543 / 5432'}
          </span>
        </div>

        {error && (
          <div style={{
            padding: '10px 14px',
            backgroundColor: 'var(--badge-rose-bg)',
            border: '1px solid rgba(225, 29, 72, 0.2)',
            color: 'var(--badge-rose-text)',
            borderRadius: '8px',
            fontSize: '0.82rem',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {tab === 'register' && (
            <>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
                  BUSINESS / STORE NAME
                </label>
                <div style={{ position: 'relative' }}>
                  <Store size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Balaji Smart Retail & Tech Mart"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
                  FOUNDER / OPERATOR NAME
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Akhil Chiluvari"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 12px 9px 36px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '0.86rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
                    CATEGORY
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem'
                    }}
                  >
                    <option value="Hybrid Supermarket & Electronics">Supermarket & Tech</option>
                    <option value="Consumer Electronics & Audio">Electronics & Audio</option>
                    <option value="Organic Staples & Groceries">Organic Staples</option>
                    <option value="Apparel & Lifestyle">Apparel & Lifestyle</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
                    LOCATION
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Madhapur, Hyderabad"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '9px 10px',
                      borderRadius: '8px',
                      backgroundColor: 'var(--bg-input)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      fontSize: '0.82rem'
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
              EMAIL ADDRESS
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="email"
                required
                placeholder="founder@yourstore.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.86rem'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-tertiary)', marginBottom: '5px' }}>
              PASSWORD
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} color="var(--text-tertiary)" style={{ position: 'absolute', left: '12px', top: '11px' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 36px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-medium)',
                  color: 'var(--text-primary)',
                  fontSize: '0.86rem'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-terracotta"
            style={{ width: '100%', justifyContent: 'center', marginTop: '6px', height: '42px' }}
          >
            <span>{loading ? 'Authenticating...' : tab === 'login' ? 'Sign In to Console' : 'Complete Registration & Launch'}</span>
            <ArrowRight size={15} />
          </button>

          {tab === 'login' && (
            <button
              type="button"
              onClick={handleDemoLogin}
              style={{
                background: 'none',
                border: '1px dashed var(--border-medium)',
                borderRadius: '8px',
                padding: '8px',
                fontSize: '0.78rem',
                color: 'var(--accent-terracotta)',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              Fill Demo Credentials (Akhil Chiluvari • Sri Balaji Retail)
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
