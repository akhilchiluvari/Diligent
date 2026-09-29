-- ========================================================================
-- DILIGENT: SMB Autonomous Operational Engine & Multi-Agent Consultant
-- Supabase PostgreSQL Database Schema & Initial Catalog Seed
-- Target: Hack with Hyderabad 3.0 (Microsoft IDC)
-- ========================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES & USERS TABLE
-- Stores merchant enterprise profiles, store category, and revenue tiers
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    business_name TEXT NOT NULL,
    category TEXT DEFAULT 'Hybrid Supermarket & Electronics',
    location TEXT DEFAULT 'Madhapur, HITEC City, Hyderabad',
    revenue_tier TEXT DEFAULT '₹15L - ₹35L / month',
    role TEXT DEFAULT 'founder',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW())
);

-- 2. PRODUCTS & INVENTORY TABLE
-- Real-time stock levels, barcodes, cost, retail prices, and inventory velocity
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    barcode TEXT UNIQUE NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    cost NUMERIC(10, 2) NOT NULL,
    margin NUMERIC(5, 2) NOT NULL,
    stock INTEGER NOT NULL DEFAULT 0,
    reorder_point INTEGER NOT NULL DEFAULT 10,
    velocity TEXT DEFAULT 'MEDIUM',
    supplier TEXT,
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. CHAT HISTORY TABLE
-- Persistent conversational memory for Floating Copilot & Multi-Agent Swarm
CREATE TABLE IF NOT EXISTS public.chat_history (
    id BIGSERIAL PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL DEFAULT 'sess_default',
    title TEXT,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'agent', 'system')),
    text TEXT NOT NULL,
    delegated_agent TEXT DEFAULT 'Orchestrator',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. SALES TRANSACTIONS TABLE
-- In-store POS cashier sales and agent telemetry
CREATE TABLE IF NOT EXISTS public.sales_transactions (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE SET NULL,
    items JSONB NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    items_count INTEGER NOT NULL,
    payment_method TEXT DEFAULT 'UPI_SCANNER',
    employee_id TEXT DEFAULT 'EMP-001',
    created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. AUDIT LOGS TABLE
-- Agentic action audit trail, compliance logs, liability disclaimers
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    agent TEXT NOT NULL,
    detail TEXT NOT NULL,
    severity TEXT DEFAULT 'INFO' CHECK (severity IN ('INFO', 'WARNING', 'ACTION', 'COMPLIANCE', 'CRITICAL')),
    timestamp TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 6. TEAM DIVISIONS TABLE
-- Real-time departmental metrics (POS Billing, Floor Sales, Inventory Inward)
CREATE TABLE IF NOT EXISTS public.team_divisions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    head_count INTEGER NOT NULL DEFAULT 1,
    budget_allocated NUMERIC(12, 2) NOT NULL,
    monthly_sales NUMERIC(12, 2) NOT NULL,
    target_sales NUMERIC(12, 2) NOT NULL,
    efficiency_score NUMERIC(5, 2) NOT NULL,
    protocols JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- ========================================================================
-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
-- ========================================================================
CREATE INDEX IF NOT EXISTS idx_products_barcode ON public.products(barcode);
CREATE INDEX IF NOT EXISTS idx_products_velocity ON public.products(velocity);
CREATE INDEX IF NOT EXISTS idx_chat_history_session ON public.chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_history_user ON public.chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_timestamp ON public.audit_logs(timestamp DESC);

-- ========================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team_divisions ENABLE ROW LEVEL SECURITY;

-- Allow public/authenticated read & write for prototype simplicity
DO $$
BEGIN
    -- users policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'users' AND policyname = 'Allow public access to users') THEN
        CREATE POLICY "Allow public access to users" ON public.users FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- products policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Allow public access to products') THEN
        CREATE POLICY "Allow public access to products" ON public.products FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- chat_history policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'chat_history' AND policyname = 'Allow public access to chat_history') THEN
        CREATE POLICY "Allow public access to chat_history" ON public.chat_history FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- sales_transactions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'sales_transactions' AND policyname = 'Allow public access to sales') THEN
        CREATE POLICY "Allow public access to sales" ON public.sales_transactions FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- audit_logs policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_logs' AND policyname = 'Allow public access to audit_logs') THEN
        CREATE POLICY "Allow public access to audit_logs" ON public.audit_logs FOR ALL USING (true) WITH CHECK (true);
    END IF;

    -- team_divisions policies
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'team_divisions' AND policyname = 'Allow public access to team_divisions') THEN
        CREATE POLICY "Allow public access to team_divisions" ON public.team_divisions FOR ALL USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ========================================================================
-- INITIAL SEED DATA: HYDERABAD SMART RETAIL DEMO CATALOG
-- ========================================================================
INSERT INTO public.users (id, email, name, business_name, category, location, revenue_tier)
VALUES (
    'usr_001',
    'akhil@diligent.ai',
    'Akhil Chiluvari',
    'Sri Balaji Smart Retail & Tech Mart',
    'Hybrid Supermarket & Consumer Electronics',
    'Madhapur, HITEC City, Hyderabad',
    '₹15L - ₹35L / month'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO public.products (id, name, category, barcode, price, cost, margin, stock, reorder_point, velocity, supplier)
VALUES
    ('PRD-001', 'boAt Airdopes 141 ANC Earbuds', 'Consumer Electronics', '8901234567890', 1499.00, 890.00, 40.6, 28, 10, 'HIGH', 'Imagine Marketing Ltd, Mumbai'),
    ('PRD-002', 'Tata Sampann Unpolished Toor Dal 1kg', 'Organic Staples', '8901030382910', 185.00, 142.00, 23.2, 54, 20, 'HIGH', 'Tata Consumer Products, Hyderabad DC'),
    ('PRD-003', 'OnePlus Nord Buds 2r TWS', 'Consumer Electronics', '8904321098765', 1999.00, 1450.00, 27.4, 4, 8, 'HIGH', 'OnePlus India Logistics, Bengaluru'),
    ('PRD-004', 'Aashirvaad Shudh Chakki Atta 10kg', 'Organic Staples', '8901725182012', 490.00, 410.00, 16.3, 12, 15, 'HIGH', 'ITC Limited, Secunderabad Depot'),
    ('PRD-005', 'Noise ColorFit Pulse Grand Smartwatch', 'Wearables', '8909876543210', 1299.00, 720.00, 44.5, 32, 10, 'MEDIUM', 'Nexxbase Marketing, Gurugram'),
    ('PRD-006', 'Dettol Antiseptic Liquid 1000ml', 'Personal Care', '8901396120038', 380.00, 290.00, 23.6, 18, 10, 'MEDIUM', 'Reckitt Benckiser, Patancheru Hub')
ON CONFLICT (id) DO UPDATE SET
    price = EXCLUDED.price,
    cost = EXCLUDED.cost,
    stock = EXCLUDED.stock;

INSERT INTO public.team_divisions (id, name, head_count, budget_allocated, monthly_sales, target_sales, efficiency_score, protocols)
VALUES
    ('div_pos', 'POS Billing & Cashier Desk', 3, 75000.00, 842000.00, 900000.00, 94.2, '["Dual barcode scan verification", "UPI instant dynamic soundbox check", "Cart abandonment recovery protocol"]'::jsonb),
    ('div_sales', 'Floor Sales & Customer Success', 4, 110000.00, 524000.00, 600000.00, 88.5, '["Active consultative product demos", "Fast-moving shelf restocking alerts", "VIP member greeting script"]'::jsonb),
    ('div_inventory', 'Inventory Inward & Stock Audit', 2, 55000.00, 0.00, 0.00, 96.0, '["PO variance auto-reconciliation", "Damage & expiration date optical intake", "Vendor payment milestone unlock"]'::jsonb)
ON CONFLICT (id) DO UPDATE SET
    efficiency_score = EXCLUDED.efficiency_score;

INSERT INTO public.audit_logs (type, agent, detail, severity)
VALUES
    ('SYSTEM_INIT', 'Orchestrator Agent', 'Diligent Supabase Database tables and indexes mounted successfully.', 'INFO'),
    ('INVENTORY_AUDIT', 'Inventory Guard Agent', 'OnePlus Nord Buds 2r identified below safety stock buffer (4 remaining, reorder threshold 8).', 'ACTION'),
    ('CONSENSUS_SYNC', 'Executive Swarm', 'Daily Autonomous Operations sync complete. All 3 store divisions aligned.', 'COMPLIANCE');
