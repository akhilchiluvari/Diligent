import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, '../data/mockDatabase.json');
const LEGAL_PATH = path.join(__dirname, '../data/legalTerms.json');

class DatabaseService {
  constructor() {
    this.loadData();
  }

  loadData() {
    try {
      const raw = fs.readFileSync(DB_PATH, 'utf-8');
      this.data = JSON.parse(raw);
    } catch (err) {
      console.error('Error loading database:', err);
      this.data = { business: {}, products: [], inboundStocks: [], sales: [], employees: [], customers: [], auditLogs: [] };
    }

    try {
      const rawLegal = fs.readFileSync(LEGAL_PATH, 'utf-8');
      this.legal = JSON.parse(rawLegal);
    } catch (err) {
      console.error('Error loading legal terms:', err);
      this.legal = { title: "Disclaimer", clauses: [] };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  getBusiness() {
    return this.data.business;
  }

  getLegalTerms() {
    return this.legal;
  }

  acceptTerms(userIp = '127.0.0.1') {
    this.data.business.termsAccepted = true;
    this.data.business.termsAcceptedAt = new Date().toISOString();
    this.addLog({
      type: 'LEGAL_TERMS_ACCEPTED',
      agent: 'Legal & Compliance Gateway',
      detail: `Terms of Advisory & Liability Waiver explicitly accepted by operator. Audit logged at IP ${userIp}`,
      severity: 'COMPLIANCE'
    });
    this.saveData();
    return this.data.business;
  }

  getProducts() {
    return this.data.products;
  }

  getProductByBarcode(barcode) {
    return this.data.products.find(p => p.barcode === barcode || p.sku === barcode);
  }

  getTopSellers() {
    return [...this.data.products].sort((a, b) => b.unitsSoldThisMonth - a.unitsSoldThisMonth).slice(0, 5);
  }

  getLeastSellers() {
    return [...this.data.products].sort((a, b) => a.unitsSoldThisMonth - b.unitsSoldThisMonth).slice(0, 5);
  }

  getLowStockAlerts() {
    return this.data.products.filter(p => p.stockQuantity <= p.minThreshold);
  }

  getEmployees() {
    return this.data.employees;
  }

  getCustomers() {
    return this.data.customers;
  }

  getInboundStocks() {
    return this.data.inboundStocks;
  }

  getSales() {
    return this.data.sales;
  }

  getAuditLogs(limit = 50) {
    return this.data.auditLogs.slice(-limit).reverse();
  }

  addLog({ type, agent, detail, severity = 'INFO' }) {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString(),
      type,
      agent,
      detail,
      severity
    };
    this.data.auditLogs.push(newLog);
    return newLog;
  }

  recordSale({ items, customerId, employeeId, paymentMethod = 'UPI' }) {
    let subtotal = 0;
    const processedItems = [];

    for (const item of items) {
      const prod = this.getProductByBarcode(item.barcode || item.sku || item.id);
      if (!prod) {
        throw new Error(`Product identifier ${item.barcode || item.sku || item.id} not found.`);
      }
      const qty = item.qty || 1;
      if (prod.stockQuantity < qty) {
        throw new Error(`Insufficient stock for ${prod.name}. Available: ${prod.stockQuantity}, Requested: ${qty}`);
      }

      // Decrement stock
      prod.stockQuantity -= qty;
      prod.unitsSoldThisMonth += qty;

      subtotal += prod.sellingPrice * qty;
      processedItems.push({
        sku: prod.sku,
        name: prod.name,
        qty,
        price: prod.sellingPrice
      });

      // Check threshold trigger
      if (prod.stockQuantity <= prod.minThreshold) {
        this.addLog({
          type: 'STOCK_ALERT',
          agent: 'Billing & Inventory Agent',
          detail: `CRITICAL: Stock for ${prod.name} (${prod.sku}) fell to ${prod.stockQuantity} (Threshold: ${prod.minThreshold}). Replenishment required.`,
          severity: 'WARNING'
        });
      }
    }

    const gstAmount = Math.round(subtotal * 0.12);
    const grandTotal = subtotal;

    // Resolve employee
    let employeeName = 'Walk-in Cashier';
    const emp = this.data.employees.find(e => e.id === employeeId);
    if (emp) {
      emp.salesGeneratedThisMonth += grandTotal;
      emp.transactionsCount += 1;
      emp.avgBasketValue = Math.round(emp.salesGeneratedThisMonth / emp.transactionsCount);
      employeeName = emp.name;
    }

    // Resolve customer
    let customerName = 'Walk-in Customer';
    const cust = this.data.customers.find(c => c.id === customerId);
    if (cust) {
      cust.totalSpent += grandTotal;
      cust.visitCount += 1;
      cust.lastVisit = new Date().toISOString();
      customerName = cust.name;
    }

    const transaction = {
      transactionId: `TXN-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      customerId: cust ? cust.id : 'CUST-WALKIN',
      customerName,
      employeeId: emp ? emp.id : 'EMP-001',
      employeeName,
      items: processedItems,
      subtotal,
      gstAmount,
      grandTotal,
      paymentMethod,
      channel: 'In-Store POS (Barcode Scanned)'
    };

    this.data.sales.unshift(transaction);
    this.addLog({
      type: 'SALE_REGISTERED',
      agent: 'Billing & Inventory Agent',
      detail: `Processed ${transaction.transactionId} for ₹${grandTotal.toLocaleString('en-IN')} by ${employeeName}.`,
      severity: 'INFO'
    });

    this.saveData();
    return transaction;
  }

  recordInboundStock({ supplier, items, invoiceNumber, receivedBy = 'EMP-004' }) {
    let totalCost = 0;
    const processedItems = [];

    for (const item of items) {
      const prod = this.getProductByBarcode(item.barcode || item.sku);
      if (prod) {
        prod.stockQuantity += item.quantity;
        if (item.unitCost) prod.costPrice = item.unitCost;
      }
      const cost = (item.unitCost || (prod ? prod.costPrice : 0)) * item.quantity;
      totalCost += cost;
      processedItems.push({
        sku: item.sku || (prod ? prod.sku : 'SKU-NEW'),
        quantity: item.quantity,
        unitCost: item.unitCost || (prod ? prod.costPrice : 0),
        total: cost
      });
    }

    const inbound = {
      inboundId: `PO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      supplier,
      receivedDate: new Date().toISOString(),
      items: processedItems,
      totalCost,
      status: 'Received & Verified',
      receivedBy,
      invoiceNumber: invoiceNumber || `INV-MANUAL-${Date.now().toString().slice(-4)}`
    };

    this.data.inboundStocks.unshift(inbound);
    this.addLog({
      type: 'INBOUND_STOCK_RECEIVED',
      agent: 'Billing & Inventory Agent',
      detail: `Inbound delivery ${inbound.inboundId} recorded from ${supplier}. Total goods value ₹${totalCost.toLocaleString('en-IN')}.`,
      severity: 'INFO'
    });

    this.saveData();
    return inbound;
  }

  getStats() {
    const totalInventoryValue = this.data.products.reduce((acc, p) => acc + (p.stockQuantity * p.costPrice), 0);
    const totalRetailValue = this.data.products.reduce((acc, p) => acc + (p.stockQuantity * p.sellingPrice), 0);
    const potentialMargin = totalRetailValue - totalInventoryValue;
    const totalSalesMonth = this.data.products.reduce((acc, p) => acc + (p.unitsSoldThisMonth * p.sellingPrice), 0);
    const totalUnitsSold = this.data.products.reduce((acc, p) => acc + p.unitsSoldThisMonth, 0);
    const topSeller = this.getTopSellers()[0];
    const leastSeller = this.getLeastSellers()[0];
    const lowStockCount = this.getLowStockAlerts().length;

    // Top employee
    const topEmployee = [...this.data.employees].sort((a, b) => b.salesGeneratedThisMonth - a.salesGeneratedThisMonth)[0];

    // Locked capital in dead stock (products with unitsSoldThisMonth <= 5)
    const deadStockValue = this.data.products
      .filter(p => p.unitsSoldThisMonth <= 5)
      .reduce((acc, p) => acc + (p.stockQuantity * p.costPrice), 0);

    return {
      businessName: this.data.business.name,
      location: this.data.business.location,
      termsAccepted: this.data.business.termsAccepted,
      totalInventoryValue,
      totalRetailValue,
      potentialMargin,
      totalSalesMonth,
      totalUnitsSold,
      topSeller,
      leastSeller,
      lowStockCount,
      topEmployee,
      deadStockValue,
      productsCount: this.data.products.length,
      employeesCount: this.data.employees.length,
      customersCount: this.data.customers.length
    };
  }
}

export const dbService = new DatabaseService();
