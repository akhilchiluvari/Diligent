import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dbService } from './services/dbService.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Core API Routes ---

// Healthcheck
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    platform: 'Diligent SMB Multi-Agent Platform',
    version: '1.0.0-PROTOTYPE',
    timestamp: new Date().toISOString()
  });
});

// Business profile and high-level KPIs
app.get('/api/dashboard/stats', (req, res) => {
  try {
    const stats = dbService.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Legal and Compliance Terms & Acceptance
app.get('/api/legal/terms', (req, res) => {
  res.json({ success: true, legal: dbService.getLegalTerms() });
});

app.post('/api/legal/accept', (req, res) => {
  try {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const business = dbService.acceptTerms(clientIp);
    res.json({ success: true, message: 'Liability waiver acknowledged & logged.', business });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Products & Inventory
app.get('/api/products', (req, res) => {
  try {
    const products = dbService.getProducts();
    const topSellers = dbService.getTopSellers();
    const leastSellers = dbService.getLeastSellers();
    const lowStock = dbService.getLowStockAlerts();
    res.json({ success: true, products, topSellers, leastSellers, lowStock });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/products/scan/:barcode', (req, res) => {
  try {
    const { barcode } = req.params;
    const product = dbService.getProductByBarcode(barcode);
    if (!product) {
      return res.status(404).json({ success: false, error: `SKU/Barcode '${barcode}' not found in registry.` });
    }
    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Inbound Stock Deliveries
app.get('/api/inventory/inbound', (req, res) => {
  try {
    const inbound = dbService.getInboundStocks();
    res.json({ success: true, inbound });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/inventory/inbound', (req, res) => {
  try {
    const { supplier, items, invoiceNumber, receivedBy } = req.body;
    if (!supplier || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Invalid inbound payload. Supplier and items required.' });
    }
    const inboundRecord = dbService.recordInboundStock({ supplier, items, invoiceNumber, receivedBy });
    res.json({ success: true, inbound: inboundRecord });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Sales & POS Transactions
app.get('/api/sales', (req, res) => {
  try {
    const sales = dbService.getSales();
    res.json({ success: true, sales });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/sales/checkout', (req, res) => {
  try {
    const { items, customerId, employeeId, paymentMethod } = req.body;
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ success: false, error: 'Checkout requires at least one product item.' });
    }
    const txn = dbService.recordSale({ items, customerId, employeeId, paymentMethod });
    res.json({ success: true, transaction: txn });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Employees
app.get('/api/employees', (req, res) => {
  try {
    const employees = dbService.getEmployees();
    res.json({ success: true, employees });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Customers CRM
app.get('/api/customers', (req, res) => {
  try {
    const customers = dbService.getCustomers();
    res.json({ success: true, customers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Operational & Audit Logs
app.get('/api/logs', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const logs = dbService.getAuditLogs(limit);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// If production build exists in client/dist, serve it statically
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));

// Export app for testability, start if direct
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`[Diligent Server] Multi-Agent Operational Engine online at http://localhost:${PORT}`);
    console.log(`[Diligent Server] Grok Inference Model: ${process.env.GROK_MODEL || 'grok-2-latest'} (Fallback enabled: ${process.env.USE_MOCK_FALLBACK})`);
  });
}

export default app;
