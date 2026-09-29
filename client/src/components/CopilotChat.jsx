import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, User, Sparkles, CornerDownLeft, ShieldCheck } from 'lucide-react';

export default function CopilotChat({ onSendMessage, isWaiting, messages }) {
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaiting]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isWaiting) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleSuggestion = (prompt) => {
    setInput(prompt);
  };

  const suggestions = [
    "What is our least sold product and how do we liquidate it?",
    "Who is our top performing employee this month?",
    "How much capital is trapped in dead inventory?",
    "What critical stockout hazard do we have right now?",
    "Draft a weekend WhatsApp blast for Madhapur IT workers."
  ];

  return (
    <div className="glass-panel" style={{
      height: '680px',
      display: 'flex',
      flexDirection: 'column',
      border: '1px solid rgba(56, 189, 248, 0.3)',
      overflow: 'hidden'
    }}>
      {/* Chat Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'rgba(15, 23, 42, 0.6)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            backgroundColor: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Bot size={18} color="#38bdf8" />
          </div>
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              Diligent Orchestrator Copilot
            </h3>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Natural Language Supervisor Routing to Specialized Subagents
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div className="pulse-dot" />
          <span style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>Active</span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div style={{
        flex: 1,
        padding: '20px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px'
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              gap: '12px',
              alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%'
            }}
          >
            {msg.sender !== 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(139, 92, 246, 0.2)',
                border: '1px solid rgba(139, 92, 246, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Bot size={16} color="#c084fc" />
              </div>
            )}

            <div style={{
              backgroundColor: msg.sender === 'user' ? '#0284c7' : 'rgba(255, 255, 255, 0.05)',
              border: msg.sender === 'user' ? 'none' : '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '14px 18px',
              color: '#ffffff',
              fontSize: '0.9rem',
              lineHeight: 1.6
            }}>
              {msg.delegatedAgent && (
                <div style={{
                  fontSize: '0.72rem',
                  color: '#38bdf8',
                  fontWeight: 700,
                  marginBottom: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <Sparkles size={11} /> Delegated: {msg.delegatedAgent}
                </div>
              )}
              <div style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</div>
              <div style={{
                fontSize: '0.68rem',
                color: msg.sender === 'user' ? 'rgba(255, 255, 255, 0.7)' : 'var(--text-muted)',
                textAlign: 'right',
                marginTop: '6px'
              }}>
                {msg.time}
              </div>
            </div>

            {msg.sender === 'user' && (
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                backgroundColor: 'rgba(2, 132, 199, 0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <User size={16} color="#ffffff" />
              </div>
            )}
          </div>
        ))}

        {isWaiting && (
          <div style={{ display: 'flex', gap: '12px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Bot size={16} color="#c084fc" />
            </div>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <div className="pulse-dot" style={{ backgroundColor: '#38bdf8' }} />
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Supervisor decomposing query & routing to subagents...
              </span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{
        padding: '10px 16px',
        backgroundColor: 'rgba(0, 0, 0, 0.2)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '8px',
        overflowX: 'auto',
        whiteSpace: 'nowrap'
      }}>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSuggestion(s)}
            style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-muted)',
              fontSize: '0.72rem',
              cursor: 'pointer',
              flexShrink: 0
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSubmit} style={{
        padding: '14px 20px',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        gap: '12px',
        backgroundColor: 'rgba(15, 23, 42, 0.8)'
      }}>
        <input
          type="text"
          placeholder="Ask Diligent about inventory, revenue, marketing, or employee operations..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={isWaiting}
          style={{
            flex: 1,
            padding: '10px 16px',
            borderRadius: '10px',
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            border: '1px solid var(--border-color)',
            color: '#ffffff',
            fontSize: '0.9rem'
          }}
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={!input.trim() || isWaiting}
          style={{ opacity: input.trim() && !isWaiting ? 1 : 0.5 }}
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
