import React, { useState } from 'react';
import { Barcode, Scan, PlusCircle, AlertCircle, CheckCircle, PackageCheck, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

export default function InventoryTerminal({ products, topSellers, leastSellers, lowStock, onScanSale, employees }) {
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
          text: `Scanned & Billed: ${result.transaction.items[0]?.name} (Qty: ${result.transaction.items[0]?.qty}) for ₹${result.transaction.grandTotal.toLocaleString('en-IN')}`
        });
        setBarcodeInput('');
      } else {
        setScanMessage({ type: 'error', text: result.error || 'Scan ingestion failed' });
      }
    } catch (err) {
      setScanMessage({ type: 'error', text: err.message });
    }

    setTimeout(() => setScanMessage(null), 6000);
  };

  const quickPresets = [
    { label: "boAt Rockerz 255", barcode: "8901030825010", type: "Top Seller" },
    { label: "Amul Butter 500g", barcode: "8901233024018", type: "Low Stock Alert" },
    { label: "Tata Moong Dal", barcode: "8901725181222", type: "Top Seller" },
    { label: "Nordic LED Lamp", barcode: "8904123890123", type: "Dead Stock" },
    { label: "Himalayan Chia", barcode: "8907812903411", type: "Dead Stock" }
  ];

  const displayedProducts = activeTab === 'top' 
    ? topSellers 
    : activeTab === 'dead' 
    ? leastSellers 
    : activeTab === 'low' 
    ? lowStock 
    : products;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Real-time Barcode Scanner Ingestion Terminal */}
      <div className="glass-panel" style={{
        padding: '24px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(18, 30, 52, 0.9) 100%)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
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
              <Scan size={20} color="#38bdf8" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                Edge POS & Barcode Scanner Simulator
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Simulates real-time hardware barcode scanner ingestion (serial-to-web API). Telemetry updates stock instantly.
              </p>
            </div>
          </div>
          <span className="badge-blue">
            <Barcode size={14} /> Hardware Link: Emulated Active
          </span>
        </div>

        {/* Scan Input Form */}
        <form onSubmit={handleScanSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          alignItems: 'flex-end',
          marginBottom: '16px'
        }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Barcode / SKU
            </label>
            <input
              type="text"
              placeholder="e.g. 8901030825010"
              value={barcodeInput}
              onChange={(e) => setBarcodeInput(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.9rem',
                fontFamily: 'monospace'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={selectedQty}
              onChange={(e) => setSelectedQty(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '8px',
                backgroundColor: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid var(--border-color)',
                color: '#ffffff',
                fontSize: '0.9rem'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Terminal Cashier
            </label>
            <select
              value={selectedEmployee}
              onChange={(e) => setSelectedEmployee(e.target.value)}
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
              {employees?.map(emp => (
                <option key={emp.id} value={emp.id} style={{ backgroundColor: '#0f172a' }}>
                  {emp.name} ({emp.role.split(' ')[0]})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
              Payment Method
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
              <option value="UPI (Google Pay)" style={{ backgroundColor: '#0f172a' }}>UPI (Google Pay)</option>
              <option value="UPI (PhonePe)" style={{ backgroundColor: '#0f172a' }}>UPI (PhonePe)</option>
              <option value="Credit Card" style={{ backgroundColor: '#0f172a' }}>Credit Card</option>
              <option value="Cash" style={{ backgroundColor: '#0f172a' }}>Cash</option>
            </select>
          </div>

          <div>
            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', height: '42px' }}
            >
              <Scan size={16} />
              <span>Ingest Scan</span>
            </button>
          </div>
        </form>

        {/* Quick Click Barcodes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quick Scan Presets:</span>
          {quickPresets.map((p, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setBarcodeInput(p.barcode)}
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-color)',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                color: '#ffffff',
                cursor: 'pointer'
              }}
            >
              {p.label} <code style={{ color: '#38bdf8', fontSize: '0.7rem' }}>({p.barcode.slice(-4)})</code>
            </button>
          ))}
        </div>

        {/* Scan Feedback Message */}
        {scanMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            borderRadius: '8px',
            backgroundColor: scanMessage.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(244, 63, 94, 0.1)',
            border: scanMessage.type === 'success' ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(244, 63, 94, 0.3)',
            color: scanMessage.type === 'success' ? '#34d399' : '#fb7185',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {scanMessage.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{scanMessage.text}</span>
          </div>
        )}
      </div>

      {/* Products & Inventory Matrix */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
              Live Inventory Catalog & Turnover Velocity
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Total {products?.length || 0} active SKUs monitored by Billing & Inventory Agent
            </p>
          </div>

          {/* Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Products' },
              { id: 'top', label: '🔥 Top Sellers' },
              { id: 'dead', label: '⚠️ Dead / Slow Stock' },
              { id: 'low', label: '🚨 Low Stock Alerts' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: activeTab === tab.id ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                  backgroundColor: activeTab === tab.id ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  color: activeTab === tab.id ? '#38bdf8' : 'var(--text-muted)'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                <th style={{ padding: '10px 14px' }}>PRODUCT & SKU</th>
                <th style={{ padding: '10px 14px' }}>CATEGORY</th>
                <th style={{ padding: '10px 14px' }}>COST / MRP</th>
                <th style={{ padding: '10px 14px' }}>STOCK QTY</th>
                <th style={{ padding: '10px 14px' }}>SOLD (30D)</th>
                <th style={{ padding: '10px 14px' }}>STATUS & VELOCITY</th>
              </tr>
            </thead>
            <tbody>
              {displayedProducts?.map(prod => {
                const margin = Math.round(((prod.sellingPrice - prod.costPrice) / prod.sellingPrice) * 100);
                const isCritical = prod.stockQuantity <= prod.minThreshold;
                const isDead = prod.unitsSoldThisMonth <= 5;

                return (
                  <tr key={prod.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                    <td style={{ padding: '12px 14px' }}>
                      <div style={{ fontWeight: 700, color: '#ffffff' }}>{prod.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                        {prod.barcode} • {prod.sku}
                      </div>
                    </td>
                    <td style={{ padding: '12px 14px', color: 'var(--text-muted)' }}>
                      {prod.category}
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ color: '#ffffff', fontWeight: 600 }}>₹{prod.sellingPrice}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        Cost: ₹{prod.costPrice} ({margin}% margin)
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{
                        fontWeight: 700,
                        color: isCritical ? '#fb7185' : '#ffffff',
                        fontSize: '0.95rem'
                      }}>
                        {prod.stockQuantity}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>
                        Min: {prod.minThreshold}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ fontWeight: 700, color: prod.unitsSoldThisMonth > 100 ? '#34d399' : '#ffffff' }}>
                        {prod.unitsSoldThisMonth} units
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px' }}>
                      {isCritical ? (
                        <span className="badge-rose">Stockout Alert</span>
                      ) : isDead ? (
                        <span className="badge-amber">Dead Stock (Liquidate)</span>
                      ) : (
                        <span className="badge-emerald">High Velocity</span>
                      )}
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
