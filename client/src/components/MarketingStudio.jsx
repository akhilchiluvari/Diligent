import React, { useState } from 'react';
import { Megaphone, Camera, MessageCircle, Globe, Video, Copy, Check, Sparkles, Send } from 'lucide-react';

export default function MarketingStudio({ campaignData, onGenerateCampaign, products, isGenerating }) {
  const [selectedSku, setSelectedSku] = useState(products?.[5]?.sku || 'ELEC-LAMP-QI');
  const [focusType, setFocusType] = useState('DEAD_STOCK_CLEARANCE');
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('instagram');

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleGenerate = () => {
    onGenerateCampaign({ focusType, targetSku: selectedSku });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Studio Header & Controls */}
      <div className="glass-panel" style={{
        padding: '24px',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 24, 15, 0.8) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Megaphone size={20} color="#fbbf24" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                AI Marketing Studio & Headless CMS Engine
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Powered by Web & Marketing Agent. Synthesizes inventory velocity into high-converting social campaigns and live e-commerce banners.
              </p>
            </div>
          </div>
          <span className="badge-amber">
            <Sparkles size={12} /> Autonomous Copywriting
          </span>
        </div>

        {/* Generator Controls */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '14px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Target Inventory Item
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              {products?.map(p => (
                <option key={p.id} value={p.sku} style={{ backgroundColor: '#0f172a' }}>
                  {p.name} (Stock: {p.stockQuantity} | Sold: {p.unitsSoldThisMonth})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Campaign Objective
            </label>
            <select
              value={focusType}
              onChange={(e) => setFocusType(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.85rem'
              }}
            >
              <option value="DEAD_STOCK_CLEARANCE" style={{ backgroundColor: '#0f172a' }}>⚡ Flash Dead Stock Liquidation (25% off)</option>
              <option value="WEEKEND_FESTIVE_BOOST" style={{ backgroundColor: '#0f172a' }}>🎉 Hyderabad Weekend Tech Bonanza</option>
              <option value="VIP_RETENTION_EXCLUSIVE" style={{ backgroundColor: '#0f172a' }}>💎 Madhapur VIP Member Perks</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                height: '42px',
                background: 'linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)',
                boxShadow: '0 4px 14px rgba(245, 158, 11, 0.4)'
              }}
            >
              <Sparkles size={16} />
              <span>{isGenerating ? 'Synthesizing Copy...' : 'Generate Multi-Channel Campaign'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Output Preview */}
      {campaignData && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          {/* Sub-tabs for Channels */}
          <div style={{
            display: 'flex',
            gap: '10px',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '14px',
            marginBottom: '20px',
            flexWrap: 'wrap'
          }}>
            {[
              { id: 'instagram', label: 'Instagram Post & Carousel', icon: Camera, color: '#ec4899' },
              { id: 'whatsapp', label: 'WhatsApp VIP Broadcast', icon: MessageCircle, color: '#22c55e' },
              { id: 'cms', label: 'Headless CMS Storefront Banner', icon: Globe, color: '#38bdf8' },
              { id: 'reels', label: '15s Video / Reels Script', icon: Video, color: '#a855f7' }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMediaTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: activeMediaTab === tab.id ? `1px solid ${tab.color}` : '1px solid var(--border-color)',
                    backgroundColor: activeMediaTab === tab.id ? `${tab.color}15` : 'transparent',
                    color: activeMediaTab === tab.id ? tab.color : 'var(--text-muted)',
                    fontWeight: 600,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab 1: Instagram */}
          {activeMediaTab === 'instagram' && campaignData.instagramPost && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700 }}>CAPTION & COPY</span>
                  <button
                    onClick={() => handleCopy(campaignData.instagramPost.caption, 'insta')}
                    className="btn-secondary"
                    style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                  >
                    {copiedKey === 'insta' ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                    <span>{copiedKey === 'insta' ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.88rem', color: '#f1f5f9', lineHeight: 1.7 }}>
                  {campaignData.instagramPost.caption}
                </div>
                <div style={{ marginTop: '14px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {campaignData.instagramPost.hashtags?.map((tag, i) => (
                    <span key={i} style={{ color: '#38bdf8', fontSize: '0.75rem', fontFamily: 'monospace' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '18px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.8rem', color: '#ec4899', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  CREATIVE DIRECTION & VISUAL CONCEPT
                </span>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  {campaignData.instagramPost.visualConcept}
                </p>
                <div style={{
                  marginTop: '16px',
                  height: '180px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: '8px',
                  border: '1px dashed rgba(236, 72, 153, 0.4)'
                }}>
                  <Camera size={32} color="#ec4899" />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                    {campaignData.featuredProduct || 'Product Drop'}
                  </span>
                  <span className="badge-rose">Ready for Story & Feed</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: WhatsApp */}
          {activeMediaTab === 'whatsapp' && campaignData.whatsAppBroadcast && (
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: '#22c55e', fontWeight: 700 }}>WHATSAPP BROADCAST TEMPLATE</span>
                <button
                  onClick={() => handleCopy(`${campaignData.whatsAppBroadcast.header}\n\n${campaignData.whatsAppBroadcast.body}\n\n${campaignData.whatsAppBroadcast.callToAction}`, 'wa')}
                  className="btn-secondary"
                  style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                >
                  {copiedKey === 'wa' ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                  <span>{copiedKey === 'wa' ? 'Copied!' : 'Copy Template'}</span>
                </button>
              </div>
              <div style={{
                maxWidth: '540px',
                backgroundColor: '#0b141a',
                padding: '16px',
                borderRadius: '8px',
                borderLeft: '4px solid #22c55e'
              }}>
                <div style={{ fontWeight: 700, color: '#ffffff', marginBottom: '8px', fontSize: '0.9rem' }}>
                  {campaignData.whatsAppBroadcast.header}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: '#e2e8f0', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '12px' }}>
                  {campaignData.whatsAppBroadcast.body}
                </div>
                <div style={{ color: '#86efac', fontWeight: 600, fontSize: '0.8rem' }}>
                  👉 {campaignData.whatsAppBroadcast.callToAction}
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Headless CMS */}
          {activeMediaTab === 'cms' && campaignData.cmsStorefrontBanner && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.8rem', color: '#38bdf8', fontWeight: 700 }}>AUTONOMOUS STOREFRONT BANNER (HEADLESS CMS)</span>
                <span className="badge-blue">Live Webhook Ready</span>
              </div>
              <div style={{
                padding: '32px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0369a1 0%, #1e1b4b 100%)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px'
              }}>
                <div>
                  <span className="badge-amber" style={{ marginBottom: '10px' }}>
                    {campaignData.cmsStorefrontBanner.badge || 'FLASH DEAL'}
                  </span>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '8px', marginBottom: '6px' }}>
                    {campaignData.cmsStorefrontBanner.headline}
                  </h2>
                  <p style={{ fontSize: '0.9rem', color: '#bae6fd' }}>
                    {campaignData.cmsStorefrontBanner.subheading}
                  </p>
                </div>
                <button className="btn-primary" style={{ backgroundColor: '#ffffff', color: '#0369a1', fontWeight: 800 }}>
                  {campaignData.cmsStorefrontBanner.ctaButtonText || 'Order Now'}
                </button>
              </div>
            </div>
          )}

          {/* Tab 4: Reels Script */}
          {activeMediaTab === 'reels' && campaignData.reelsScript && (
            <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.35)', padding: '20px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 700 }}>15-SECOND REEL / SHORT SCRIPT</span>
                <span className="badge-purple">{campaignData.reelsScript.durationSeconds || 15}s Run Time</span>
              </div>
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>THE HOOK (0-3s):</span>
                <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc', fontStyle: 'italic', marginTop: '4px' }}>
                  {campaignData.reelsScript.hook}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SCENE BREAKDOWN & TELEMETRY:</span>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginTop: '4px' }}>
                  {campaignData.reelsScript.sceneBreakdown}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
