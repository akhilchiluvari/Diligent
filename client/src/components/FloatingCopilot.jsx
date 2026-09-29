import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send, Bot, User, ArrowUp, ChevronDown, ChevronUp, CheckCircle, Tag, CornerDownLeft, Maximize2, Minimize2, Cpu, Globe, History, Plus, MessageSquare } from 'lucide-react';
import { marked } from 'marked';

// Configure marked for clean, safe artifact generation
marked.setOptions({
  gfm: true,
  breaks: true
});

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [showHistory, setShowHistory] = useState(false);
  
  // Stored chat history sessions
  const [savedSessions, setSavedSessions] = useState(() => {
    try {
      const stored = localStorage.getItem('diligent_chat_sessions');
      return stored ? JSON.parse(stored) : [
        { id: 'sess_1', title: 'Inventory Stockout & Barcode Audit', time: 'Today' },
        { id: 'sess_2', title: 'Workforce Coordination & Shifts', time: 'Yesterday' }
      ];
    } catch (e) {
      return [];
    }
  });

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

  // Hotkey Cmd+K / Ctrl+K
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

    let promptToSend = input.trim();
    if (attachedContext) {
      promptToSend = `[Context Attached: ${attachedContext.title} | Details: ${attachedContext.details}]\n\nUser Question: ${promptToSend}`;
    }

    onSendMessage(promptToSend, { language: selectedLanguage });
    setInput('');
  };

  const getContextualSuggestions = () => {
    if (attachedContext) {
      return [
        `What is the best immediate action for ${attachedContext.title}?`,
        `Draft an execution plan for this item`,
        `How does this impact store profit margins?`
      ];
    }

    switch (activeTab) {
      case 'inventory':
        return [
          "What products are at critical stockout risk right now?",
          "Analyze ₹1.48L trapped in dead stock and how to liquidate",
          "Draft automated supplier purchase orders"
        ];
      case 'marketing':
        return [
          "Create 3 high-converting Instagram reels hooks",
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
          "Give plans to expand the team and hire new staff"
        ];
      default:
        return [
          "Synthesize full 30-60-90 day SMB scaling roadmap",
          "How much capital is trapped in stagnant inventory?",
          "How should the team divisions coordinate with each other?"
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
            backgroundColor: 'var(--accent-terracotta)',
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
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#ffffff' }} />
          <Sparkles size={16} />
          <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Ask Diligent AI</span>
          <span style={{
            fontSize: '0.7rem',
            backgroundColor: 'rgba(255, 255, 255, 0.25)',
            padding: '2px 7px',
            borderRadius: '4px',
            fontFamily: 'monospace',
            fontWeight: 600
          }}>
            ⌘K
          </span>
        </button>
      )}

      {/* Floating Modal Drawer */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          bottom: isExpanded ? '20px' : '24px',
          right: isExpanded ? '20px' : '24px',
          width: isExpanded ? 'calc(100vw - 40px)' : '520px',
          maxWidth: '850px',
          height: isExpanded ? 'calc(100vh - 40px)' : '680px',
          maxHeight: '92vh',
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
            padding: '12px 18px',
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
                backgroundColor: 'var(--accent-terracotta)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontFamily: 'Newsreader, serif',
                fontWeight: 700
              }}>
                Di
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 className="font-serif-headline" style={{ fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    Diligent Copilot
                  </h3>
                  <span className="badge-clean badge-clean-accent" style={{ fontSize: '0.68rem' }}>
                    <Cpu size={10} /> Groq 120B
                  </span>
                </div>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>
                  Autonomous Business Consultant • Multi-Agent Memory
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Multilingual Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'var(--bg-surface)', padding: '3px 8px', borderRadius: '6px', border: '1px solid var(--border-subtle)' }}>
                <Globe size={13} color="var(--text-tertiary)" />
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.74rem',
                    fontWeight: 600,
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                >
                  <option value="en">English (US)</option>
                  <option value="te">తెలుగు (Telugu)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="es">Español (ES)</option>
                </select>
              </div>

              {/* History Toggle */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                style={{
                  background: showHistory ? 'var(--accent-subtle)' : 'none',
                  border: '1px solid var(--border-subtle)',
                  color: showHistory ? 'var(--accent-terracotta)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '6px'
                }}
                title="Conversation Memory & History"
              >
                <History size={14} />
              </button>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                {isExpanded ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
              </button>

              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '4px'
                }}
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* History Drawer if toggled */}
          {showHistory && (
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderBottom: '1px solid var(--border-subtle)',
              padding: '12px 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              maxHeight: '160px',
              overflowY: 'auto'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-tertiary)', letterSpacing: '0.05em' }}>
                  RECENT CONVERSATIONS (PERSISTENT MEMORY)
                </span>
                <span className="badge-clean badge-clean-emerald">Synced</span>
              </div>
              {savedSessions.map(s => (
                <div
                  key={s.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '6px 10px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.78rem',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MessageSquare size={13} color="var(--accent-terracotta)" />
                    <span>{s.title}</span>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>{s.time}</span>
                </div>
              ))}
            </div>
          )}

          {/* Active Context Banner */}
          <div style={{
            padding: '7px 16px',
            backgroundColor: 'var(--bg-page)',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.74rem'
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
                  color: 'var(--accent-terracotta)',
                  fontSize: '0.7rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                Clear Attachment
              </button>
            )}
          </div>

          {/* Messages Stream with Formatted Artifact Rendering */}
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
                  maxWidth: '90%'
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
                    marginTop: '2px',
                    color: 'var(--accent-terracotta)'
                  }}>
                    <Bot size={15} />
                  </div>
                )}

                <div style={{
                  backgroundColor: msg.sender === 'user' ? 'var(--accent-navy)' : 'var(--bg-surface-elevated)',
                  color: msg.sender === 'user' ? '#ffffff' : 'var(--text-primary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  fontSize: '0.86rem',
                  lineHeight: 1.6,
                  boxShadow: 'var(--card-shadow)'
                }}>
                  {msg.delegatedAgent && (
                    <div style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: 'var(--accent-terracotta)',
                      marginBottom: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}>
                      <Sparkles size={11} /> {msg.delegatedAgent}
                    </div>
                  )}

                  {/* Render cleanly with marked for bot responses, or plain text for user */}
                  {msg.sender === 'user' ? (
                    <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
                  ) : (
                    <div
                      className="artifact-body"
                      dangerouslySetInnerHTML={{ __html: marked.parse(msg.text || '') }}
                    />
                  )}

                  <div style={{
                    fontSize: '0.68rem',
                    color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-tertiary)',
                    textAlign: 'right',
                    marginTop: '8px'
                  }}>
                    {msg.time}
                  </div>
                </div>

                {msg.sender === 'user' && (
                  <div style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    backgroundColor: 'var(--accent-navy)',
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
                  justifyContent: 'center',
                  color: 'var(--accent-terracotta)'
                }}>
                  <Bot size={15} />
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
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-terracotta)' }} />
                  <span>Groq 120B reasoning & authoring response...</span>
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
                  e.currentTarget.style.borderColor = 'var(--accent-terracotta)';
                  e.currentTarget.style.color = 'var(--accent-terracotta)';
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
              placeholder={attachedContext ? `Ask about ${attachedContext.title}...` : `Ask about ${activeTab}...`}
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
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = 'var(--accent-terracotta)'}
              onBlur={(e) => e.target.style.borderColor = 'var(--border-medium)'}
            />
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="btn-terracotta"
              style={{
                padding: '9px 16px',
                borderRadius: '8px',
                opacity: input.trim() && !isWaiting ? 1 : 0.5
              }}
            >
              <Send size={14} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
