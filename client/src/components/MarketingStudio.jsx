import React, { useState } from 'react';
import { Megaphone, Camera, MessageCircle, Globe, Video, Copy, Check, Sparkles } from 'lucide-react';

export default function MarketingStudio({ campaignData, onGenerateCampaign, products, isGenerating, onOpenCopilotWithContext }) {
  const [selectedSku, setSelectedSku] = useState(products?.[5]?.sku || 'ELEC-LAMP-QI');
  const [focusType, setFocusType] = useState('DEAD_STOCK_CLEARANCE');
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeMediaTab, setActiveMediaTab] = useState('instagram');

  const handleCopy = (text, key) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleGenerate = () => {
    onGenerateCampaign({ focusType, targetSku: selectedSku });
  };

  const selectedProductObj = products?.find(p => p.sku === selectedSku);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Controls Bar */}
      <div className="card-surface" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--badge-amber-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--badge-amber-text)'
            }}>
              <Megaphone size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Autonomous Marketing Studio & Headless CMS
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Web & Marketing Agent authors multi-channel campaigns directly connected to slow-moving or high-margin store inventory.
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenCopilotWithContext({
              type: 'MARKETING_STRATEGY',
              title: `Campaign for ${selectedProductObj?.name || 'Selected Inventory'}`,
              details: `Objective: ${focusType}. Target SKU: ${selectedSku}. Selling Price: ₹${selectedProductObj?.sellingPrice || 999}. Stock: ${selectedProductObj?.stockQuantity || 0}`
            })}
            className="btn-agent-trigger"
          >
            <Sparkles size={12} /> Ask Agent to Refine Copy
          </button>
        </div>

        {/* Inputs Form */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          alignItems: 'flex-end'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              FEATURED INVENTORY SKU
            </label>
            <select
              value={selectedSku}
              onChange={(e) => setSelectedSku(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              {products?.map(p => (
                <option key={p.id} value={p.sku} style={{ backgroundColor: 'var(--bg-surface)' }}>
                  {p.name} (Stock: {p.stockQuantity})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              CAMPAIGN OBJECTIVE
            </label>
            <select
              value={focusType}
              onChange={(e) => setFocusType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                outline: 'none'
              }}
            >
              <option value="DEAD_STOCK_CLEARANCE" style={{ backgroundColor: 'var(--bg-surface)' }}>⚡ Flash Dead Stock Clearance (25% off)</option>
              <option value="WEEKEND_FESTIVE_BOOST" style={{ backgroundColor: 'var(--bg-surface)' }}>🎉 Hyderabad Weekend Tech Bonanza</option>
              <option value="VIP_RETENTION_EXCLUSIVE" style={{ backgroundColor: 'var(--bg-surface)' }}>💎 Madhapur VIP Member Perks</option>
            </select>
          </div>

          <div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="btn-solid-primary"
              style={{ width: '100%', justifyContent: 'center', height: '37px' }}
            >
              <Sparkles size={14} />
              <span>{isGenerating ? 'Synthesizing...' : 'Generate Multi-Channel Campaign'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campaign Assets Preview */}
      {campaignData && (
        <div className="card-surface" style={{ padding: '20px' }}>
          {/* Sub-tabs */}
          <div style={{
            display: 'flex',
            gap: '8px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '12px',
            marginBottom: '18px',
            overflowX: 'auto',
            whiteSpace: 'nowrap'
          }}>
            {[
              { id: 'instagram', label: 'Instagram Post & Carousel', icon: Camera },
              { id: 'whatsapp', label: 'WhatsApp VIP Broadcast', icon: MessageCircle },
              { id: 'cms', label: 'Headless CMS Storefront Banner', icon: Globe },
              { id: 'reels', label: '15-Second Video Hook / Reel', icon: Video }
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeMediaTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveMediaTab(tab.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: isActive ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                    backgroundColor: isActive ? 'var(--accent-subtle)' : 'transparent',
                    color: isActive ? 'var(--accent-light)' : 'var(--text-secondary)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instagram Tab */}
          {activeMediaTab === 'instagram' && campaignData.instagramPost && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>POST CAPTION</span>
                  <button
                    onClick={() => handleCopy(campaignData.instagramPost.caption, 'insta')}
                    className="btn-ghost"
                    style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                  >
                    {copiedKey === 'insta' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                    <span>{copiedKey === 'insta' ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
                <div style={{ whiteSpace: 'pre-wrap', fontSize: '0.85rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {campaignData.instagramPost.caption}
                </div>
                <div style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {campaignData.instagramPost.hashtags?.map((tag, i) => (
                    <span key={i} style={{ color: 'var(--accent-light)', fontSize: '0.72rem', fontFamily: 'monospace' }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid var(--border-subtle)'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700, display: 'block', marginBottom: '8px' }}>
                  CREATIVE DIRECTION & VISUAL CONCEPT
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {campaignData.instagramPost.visualConcept}
                </p>
                <div style={{
                  marginTop: '14px',
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px dashed var(--border-medium)',
                  textAlign: 'center'
                }}>
                  <Camera size={26} color="var(--accent)" style={{ margin: '0 auto 8px auto' }} />
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {campaignData.featuredProduct || 'Product Drop'}
                  </div>
                  <span className="badge-clean badge-clean-accent" style={{ marginTop: '6px' }}>Ready for Story & Feed</span>
                </div>
              </div>
            </div>
          )}

          {/* WhatsApp Tab */}
          {activeMediaTab === 'whatsapp' && campaignData.whatsAppBroadcast && (
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--badge-emerald-text)', fontWeight: 700 }}>WHATSAPP VIP BROADCAST TEMPLATE</span>
                <button
                  onClick={() => handleCopy(`${campaignData.whatsAppBroadcast.header}\n\n${campaignData.whatsAppBroadcast.body}\n\n${campaignData.whatsAppBroadcast.callToAction}`, 'wa')}
                  className="btn-ghost"
                  style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                >
                  {copiedKey === 'wa' ? <Check size={12} color="#10b981" /> : <Copy size={12} />}
                  <span>{copiedKey === 'wa' ? 'Copied' : 'Copy Template'}</span>
                </button>
              </div>
              <div style={{
                maxWidth: '520px',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                padding: '14px',
                borderRadius: '8px',
                borderLeft: '3px solid #10b981'
              }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px', fontSize: '0.86rem' }}>
                  {campaignData.whatsAppBroadcast.header}
                </div>
                <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-secondary)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '10px' }}>
                  {campaignData.whatsAppBroadcast.body}
                </div>
                <div style={{ color: 'var(--badge-emerald-text)', fontWeight: 600, fontSize: '0.78rem' }}>
                  👉 {campaignData.whatsAppBroadcast.callToAction}
                </div>
              </div>
            </div>
          )}

          {/* Headless CMS Tab */}
          {activeMediaTab === 'cms' && campaignData.cmsStorefrontBanner && (
            <div style={{
              padding: '24px',
              borderRadius: '8px',
              backgroundColor: 'var(--bg-surface-elevated)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px'
            }}>
              <div>
                <span className="badge-clean badge-clean-amber">
                  {campaignData.cmsStorefrontBanner.badge || 'PROMOTIONAL OFFER'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '8px', marginBottom: '4px', color: 'var(--text-primary)' }}>
                  {campaignData.cmsStorefrontBanner.headline}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {campaignData.cmsStorefrontBanner.subheading}
                </p>
              </div>
              <button className="btn-solid-primary">
                {campaignData.cmsStorefrontBanner.ctaButtonText || 'Order Now'}
              </button>
            </div>
          )}

          {/* Reels Tab */}
          {activeMediaTab === 'reels' && campaignData.reelsScript && (
            <div style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--accent-light)', fontWeight: 700 }}>15-SECOND REEL SCRIPT</span>
                <span className="badge-clean badge-clean-accent">{campaignData.reelsScript.durationSeconds || 15}s Run Time</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>THE HOOK (0-3s):</span>
                <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', fontStyle: 'italic', marginTop: '3px' }}>
                  {campaignData.reelsScript.hook}
                </p>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>SCENE & AUDIO TELEMETRY:</span>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginTop: '3px' }}>
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
