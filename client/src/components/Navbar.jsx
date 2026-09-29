import React from 'react';
import { Bot, ShieldCheck, ShieldAlert, Cpu, Sparkles, Store, Sun, Moon, LogIn, User, LogOut } from 'lucide-react';

export default function Navbar({
  business,
  termsAccepted,
  onOpenLegal,
  theme,
  onToggleTheme,
  onOpenCopilot,
  currentUser,
  onOpenAuth,
  onLogout,
  activeTab,
  onSelectTab
}) {
  return (
    <header style={{
      position: 'sticky',
      top: '16px',
      zIndex: 50,
      maxWidth: '1280px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px'
    }}>
      {/* Dark Navy Pill Navigation Header (Exact Reference Match: Image 1) */}
      <div className="nav-navy-pill" style={{ width: '100%', justifyContent: 'space-between' }}>
        {/* Logo with Checkmark (Matching Image 1) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }} onClick={() => onSelectTab('overview')}>
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#1e293b'
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
          <span className="font-serif-headline" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em' }}>
            Diligent.
          </span>
        </div>

        {/* Center Nav Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'teammates', label: 'AI Teammates' },
            { id: 'loop', label: 'Operating Loop' },
            { id: 'inventory', label: 'Inventory & POS' },
            { id: 'divisions', label: 'Team Divisions' },
            { id: 'marketing', label: 'Marketing CMS' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === item.id ? '#ffffff' : '#94a3b8',
                fontWeight: activeTab === item.id ? 700 : 500,
                fontSize: '0.84rem',
                cursor: 'pointer',
                transition: 'color 0.15s ease',
                padding: '4px 0'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => {
                if (activeTab !== item.id) e.currentTarget.style.color = '#94a3b8';
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Right CTA Button & Utilities */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: 'none',
              color: '#ffffff',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
          >
            {theme === 'dark' ? <Sun size={14} color="#fbbf24" /> : <Moon size={14} color="#94a3b8" />}
          </button>

          {/* Legal Pill */}
          <button
            onClick={onOpenLegal}
            style={{
              background: termsAccepted ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
              border: 'none',
              color: termsAccepted ? '#34d399' : '#fb7185',
              cursor: 'pointer',
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            {termsAccepted ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            <span>{termsAccepted ? 'Verified' : 'Waiver'}</span>
          </button>

          {/* Auth Button or User Badge */}
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                fontSize: '0.76rem',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.12)',
                padding: '4px 10px',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}>
                <User size={12} />
                <span>{currentUser.name.split(' ')[0]}</span>
              </div>
              <button
                onClick={onLogout}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                title="Sign out"
              >
                <LogOut size={14} />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              style={{
                background: 'rgba(255, 255, 255, 0.12)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '9999px',
                padding: '7px 14px',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              Sign In
            </button>
          )}

          {/* Hero Terracotta Pill Button (Matching Image 1: "Build your AI growth team") */}
          <button
            onClick={() => onOpenCopilot()}
            className="btn-terracotta"
            style={{ padding: '7px 16px', fontSize: '0.8rem' }}
          >
            <span>Launch Copilot</span>
            <Sparkles size={13} />
          </button>
        </div>
      </div>
    </header>
  );
}
