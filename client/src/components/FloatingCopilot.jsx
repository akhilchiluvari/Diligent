import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowUp, ChevronDown, ChevronUp, CheckCircle, Tag, CornerDownLeft, Maximize2, Minimize2, Cpu } from 'lucide-react';

export default function FloatingCopilot({
  isOpen,
  onToggle,
  onClose,
  activeTab,
  attachedContext,
  onClearContext,
  chatMessages,
  onSendMessage,
  isWaiting,
  onExecuteAction
}) {
  const [input, setInput] = useState('');
  const [showThinking, setShowThinking] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isWaiting]);

  // Handle hotkey Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onToggle();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onToggle]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isWaiting) return;

    // Prepend attached context if available
    let promptToSend = input.trim();
    if (attachedContext) {
      promptToSend = `[Context Attached: ${attachedContext.title} | Details: ${attachedContext.details}]\n\nUser Question: ${promptToSend}`;
    }

    onSendMessage(promptToSend);
    setInput('');
  };

  // Dynamic suggestion chips based on active tab and attached context
  const getContextualSuggestions = () => {
    if (attachedContext) {
      return [
        `What is the best action for ${attachedContext.title}?`,
        `Draft an immediate plan for this item`,
        `How does this impact store revenue?`
      ];
    }

    switch (activeTab) {
      case 'inventory':
        return [
          "What products are at critical stockout risk?",
          "Analyze ₹1.48L trapped in dead stock and how to liquidate",
          "Draft automated supplier purchase orders"
        ];
      case 'marketing':
        return [
          "Create 3 high-converting Instagram reels captions",
          "Draft a WhatsApp VIP broadcast for Madhapur techies",
          "Generate a Headless CMS promotional banner"
        ];
      case 'crm':
        return [
          "How do we win back customer Meera Joshi (churn risk 0.64)?",
          "Segment our top 10% Platinum VIP spenders",
          "Suggest cashier upsell scripts for boAt earphones"
        ];
      case 'workforce':
        return [
          "Evaluate Pooja Sharma's sales performance and bonus tier",
          "Realign evening shifts for peak Cyber Towers traffic",
          "Calculate store associate conversion efficiency"
        ];
      default:
        return [
          "Synthesize full 30-60-90 day SMB scaling roadmap",
          "How much capital is trapped in stagnant inventory?",
          "Who is our top performing associate this month?"
        ];
    }
  };

  const suggestions = getContextualSuggestions();

  return (
    <>
      {/* Floating Launcher Button (Bottom Right) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 90,
            background: 'var(--accent-gradient)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '9999px',
            padding: '12px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'var(--floating-shadow)',
            cursor: 'pointer',
            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <div className="pulse-indicator" style={{ backgroundColor: '#ffffff' }} />
          <Sparkles size={16} />
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Ask Diligent AI</span>
          <span style={{
            fontSize: '0.7rem',
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            padding: '2px 7px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 600
          }}>
            ⌘K
          </span>
        </button>
      )}

      {/* Floating Copilot Modal / Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: isExpanded ? '20px' : '24px',
          right: isExpanded ? '20px' : '24px',
          width: isExpanded ? 'calc(100vw - 40px)' : '480px',
          maxWidth: '800px',
          height: isExpanded ? 'calc(100vh - 40px)' : '650px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          border: '1px solid var(--border-medium)',
          borderRadius: '16px',
          boxShadow: 'var(--floating-shadow)',
          zIndex: 95,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)'
        }}>
          {/* Header */}
          <div style={{
            padding: '14px 18px',
            borderBottom: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface-elevated)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <Sparkles size={16} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Diligent Copilot
                  </h3>
                  <span className="badge-clean badge-clean-accent" style={{ fontSize: '0.68rem' }}>
                    <Cpu size={10} /> Groq 120B LPU
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  Autonomous Virtual Consultant • Contextual Swarm
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title={isExpanded ? "Collapse" : "Expand"}
              >
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px',
                  borderRadius: '6px'
                }}
                title="Close (Esc)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Active Context Bar */}
          <div style={{
            padding: '8px 16px',
            backgroundColor: 'var(--bg-page)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: 'var(--text-secondary)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
              <span style={{ color: 'var(--text-tertiary)' }}>Scope:</span>
              <span className="badge-clean badge-clean-blue">
                Tab: {activeTab.toUpperCase()}
              </span>

              {attachedContext && (
                <span className="badge-clean badge-clean-amber" style={{ maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <Tag size={10} /> {attachedContext.title}
                </span>
              )}
            </div>

            {attachedContext && (
              <button
                onClick={onClearContext}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-tertiary)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Detach Context
              </button>
            )}
          </div>

          {/* Messages Scroll View */}
          <div style={{
            flex: 1,
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '88%'
                }}
              >
                {msg.sender !== 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--accent-subtle)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Bot size={15} color="var(--accent)" />
                  </div>
                )}

                <div style={{
                  backgroundColor: msg.sender === 'user' ? 'var(--accent)' : 'var(--bg-surface-elevated)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: msg.sender === 'user' ? 'none' : '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  boxShadow: 'var(--card-shadow)'
                }}>
                  {msg.delegatedAgent && (
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: msg.sender === 'user' ? '#ffffff' : 'var(--accent-light)',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Sparkles size={11} /> Handled by {msg.delegatedAgent}
                    </div>
                  )}

                  <div style={{ whiteSpace: 'pre-wrap' }}>
                    {msg.text}
                  </div>

                  <div style={{
                    fontSize: '0.68rem',
                    color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-tertiary)',
                    textAlign: 'right',
                    marginTop: '6px'
                  }}>
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--accent)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                    color: '#ffffff'
                  }}>
                    <User size={15} />
                  </div>
                )}
              </div>
            ))}

            {isWaiting && (
              <div style={{ display: 'flex', gap: '10px', alignSelf: 'flex-start' }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--accent-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Bot size={15} color="var(--accent)" />
                </div>
                <div style={{
                  backgroundColor: 'var(--bg-surface-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div className="pulse-indicator" style={{ backgroundColor: 'var(--accent)' }} />
                  <span>Groq 120B reasoning & subagents collaborating...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Context Suggestion Chips */}
          <div style={{
            padding: '8px 14px',
            backgroundColor: 'var(--bg-surface-elevated)',
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {suggestions.map((sug, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setInput(sug)}
                style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '9999px',
                  padding: '4px 10px',
                  fontSize: '0.72rem',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  flexShrink: 0,
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form onSubmit={handleSubmit} style={{
            padding: '12px 16px',
            borderTop: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            display: 'flex',
            gap: '8px',
            alignItems: 'center'
          }}>
            <input
              ref={inputRef}
              type="text"
              placeholder={attachedContext ? `Ask about ${attachedContext.title}...` : `Ask Diligent about ${activeTab}...`}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isWaiting}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: '8px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.86rem',
                outline: 'none',
                transition: 'border-color 0.15s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            />
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="btn-solid-primary"
              style={{
                padding: '9px 14px',
                borderRadius: '8px',
                opacity: input.trim() && !isWaiting ? 1 : 0.5
              }}
            >
              <Send size={15} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
