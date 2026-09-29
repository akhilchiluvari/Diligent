import React, { useState } from 'react';
import { Barcode, Scan, PlusCircle, AlertCircle, CheckCircle, Sparkles, Filter, Package } from 'lucide-react';

export default function InventoryTerminal({ products, topSellers, leastSellers, lowStock, onScanSale, employees, onOpenCopilotWithContext }) {
  const [barcodeInput, setBarcodeInput] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState(employees[0]?.id || 'EMP-001');
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay)');
  const [scanMessage, setScanMessage] = useState(null);
  const [activeTab, setActiveTab] = useState('all');

  const handleScanSubmit = async (e) => {
    e?.preventDefault();
    if (!barcodeInput) return;

    try {
      const result = await onScanSale({
        items: [{ barcode: barcodeInput.trim(), qty: parseInt(selectedQty) || 1 }],
        employeeId: selectedEmployee,
        paymentMethod
      });

      if (result.success) {
        setScanMessage({
          type: 'success',
          text: `Billed: ${result.transaction.items[0]?.name} (Qty: ${result.transaction.items[0]?.qty}) for ₹${result.transaction.grandTotal.toLocaleString('en-IN')}`
        });
        setBarcodeInput('');
      } else {
        setScanMessage({ type: 'error', text: result.error || 'Scan ingestion failed' });
      }
    } catch (err) {
      setScanMessage({ type: 'error', text: err.message });
    }

    setTimeout(() => setScanMessage(null), 5000);
  };

  const quickPresets = [
    { label: "boAt Rockerz 255", barcode: "8901030825010" },
    { label: "Amul Butter 500g", barcode: "8901233024018" },
    { label: "Tata Moong Dal", barcode: "8901725181222" },
    { label: "Nordic LED Lamp", barcode: "8904123890123" },
    { label: "Himalayan Chia", barcode: "8907812903411" }
  ];

  const displayedProducts = activeTab === 'top' 
    ? topSellers 
    : activeTab === 'dead' 
    ? leastSellers 
    : activeTab === 'low' 
    ? lowStock 
    : products;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top POS Ingestion Card */}
      <div className="card-surface" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: 'var(--badge-blue-bg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--badge-blue-text)'
            }}>
              <Scan size={18} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Real-Time Barcode Scanner Ingestion
              </h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
                Edge serial-to-web ingestion simulator. Automatically decrements inventory and triggers replenishment alerts.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge-clean badge-clean-blue">
              <Barcode size={12} /> Scanner Active
            </span>
            <button
              onClick={() => onOpenCopilotWithContext({
                type: 'INVENTORY_AUDIT',
                title: 'Live Catalog Health Audit',
                details: `Analyzing all ${products?.length || 0} products. Low stock count: ${lowStock?.length}. Dead stock count: ${leastSellers?.length}.`
              })}
              className="btn-agent-trigger"
            >
              <Sparkles size={12} /> Ask Agent to Audit Stock
            </button>
          </div>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={handleScanSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px',
          alignItems: 'flex-end',
          marginBottom: '14px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              BARCODE / SKU
            </label>
            <input
              type="text"
              placeholder="e.g. 8901030825010"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '7px',
                backgroundColor: 'var(--bg-input)',
                border: '1px solid var(--border-medium)',
                color: 'var(--text-primary)',
                fontSize: '0.85rem',
                fontFamily: 'monospace',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              QTY
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
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
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              CASHIER
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
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
              {employees?.map(emp => (
                <option key={emp.id} value={emp.id} style={{ backgroundColor: 'var(--bg-surface)' }}>
                  {emp.name} ({emp.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-tertiary)', marginBottom: '5px', fontWeight: 600 }}>
              PAYMENT
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
              <option value="UPI (Google Pay)" style={{ backgroundColor: 'var(--bg-surface)' }}>UPI (Google Pay)</option>
              <option value="UPI (PhonePe)" style={{ backgroundColor: 'var(--bg-surface)' }}>UPI (PhonePe)</option>
              <option value="Credit Card" style={{ backgroundColor: 'var(--bg-surface)' }}>Credit Card</option>
              <option value="Cash" style={{ backgroundColor: 'var(--bg-surface)' }}>Cash</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="btn-solid-primary"
              style={{ width: '100%', justifyContent: 'center', height: '37px' }}
            >
              <Scan size={14} />
              <span>Record Sale</span>
            </button>
          </div>
        </form>

        {/* Quick Presets */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)' }}>Test Barcodes:</span>
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBarcodeInput(p.barcode)}
              style={{
                backgroundColor: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                padding: '3px 8px',
                borderRadius: '5px',
                fontSize: '0.72rem',
                color: 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {p.label} <code style={{ color: 'var(--accent-light)', fontSize: '0.68rem' }}>({p.barcode.slice(-4)})</code>
            </button>
          ))}
        </div>

        {/* Scan Feedback */}
        {scanMessage && (
          <div style={{
            marginTop: '12px',
            padding: '10px 14px',
            borderRadius: '8px',
            backgroundColor: scanMessage.type === 'success' ? 'var(--badge-emerald-bg)' : 'var(--badge-rose-bg)',
            border: scanMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid rgba(244, 63, 94, 0.2)',
            color: scanMessage.type === 'success' ? 'var(--badge-emerald-text)' : 'var(--badge-rose-text)',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {scanMessage.type === 'success' ? <CheckCircle size={15} /> : <AlertCircle size={15} />}
            <span>{scanMessage.text}</span>
          </div>
        )}
      </div>

      {/* Catalog Table with Inline Ask Agent Actions */}
      <div className="card-surface" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Stock Catalog & Turnover Velocity
            </h3>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
              Click <strong>Ask Agent</strong> on any row to open the Copilot with that item's telemetry attached.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Items' },
              { id: 'top', label: '🔥 Top Sellers' },
              { id: 'dead', label: '⚠️ Stagnant Dead Stock' },
              { id: 'low', label: '🚨 Low Stock' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '1px solid var(--accent)' : '1px solid var(--border-subtle)',
                  backgroundColor: activeTab === tab.id ? 'var(--accent-subtle)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--accent-light)' : 'var(--text-secondary)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-tertiary)', fontSize: '0.72rem' }}>
                <th style={{ padding: '8px 12px' }}>PRODUCT & BARCODE</th>
                <th style={{ padding: '8px 12px' }}>CATEGORY</th>
                <th style={{ padding: '8px 12px' }}>COST / MRP</th>
                <th style={{ padding: '8px 12px' }}>STOCK</th>
                <th style={{ padding: '8px 12px' }}>SOLD (30D)</th>
                <th style={{ padding: '8px 12px' }}>STATUS</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>AGENT ACTION</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts?.map(prod => {
                const margin = Math.round(((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 100);
                const isCritical = prod.stockQuantity <= prod.minThreshold;
                const isDead = prod.unitsSoldThisMonth <= 5;

                return (
                  <tr key={prod.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '10px 12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', fontFamily: 'monospace' }}>
                        {prod.barcode} • {prod.sku}
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-secondary)' }}>
                      {prod.category}
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>₹{prod.sellingPrice}</span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block' }}>
                        Cost: ₹{prod.costPrice} ({margin}%)
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontWeight: 700,
                        color: isCritical ? 'var(--badge-rose-text)' : 'var(--text-primary)',
                        fontSize: '0.9rem'
                      }}>
                        {prod.stockQuantity}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', display: 'block' }}>
                        Min: {prod.minThreshold}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontWeight: 600, color: prod.unitsSoldThisMonth > 100 ? 'var(--badge-emerald-text)' : 'var(--text-primary)' }}>
                        {prod.unitsSoldThisMonth} units
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      {isCritical ? (
                        <span className="badge-clean badge-clean-rose">Stockout Alert</span>
                      ) : isDead ? (
                        <span className="badge-clean badge-clean-amber">Dead Stock</span>
                      ) : (
                        <span className="badge-clean badge-clean-emerald">High Velocity</span>
                      )}
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => onOpenCopilotWithContext({
                          type: 'PRODUCT',
                          title: prod.name,
                          details: `SKU: ${prod.sku}, Current Stock: ${prod.stockQuantity}, Min Threshold: ${prod.minThreshold}, Sold this Month: ${prod.unitsSoldThisMonth}, Cost Price: ₹${prod.costPrice}, Selling Price: ₹${prod.sellingPrice}, Status: ${isCritical ? 'Critical Stockout' : isDead ? 'Dead Stock' : 'Active Velocity'}`
                        })}
                        className="btn-agent-trigger"
                      >
                        <Sparkles size={11} /> Ask Agent
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
