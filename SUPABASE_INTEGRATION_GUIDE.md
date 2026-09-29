# 🗄️ Supabase PostgreSQL & Connection Pooler Integration Guide

This guide walks you through connecting **Diligent** to **Supabase** for persistent PostgreSQL storage, enterprise authentication, and high-concurrency connection pooling.

---

## 📍 Table of Contents
1. [Where to Find Every Key in Supabase](#1-where-to-find-every-key-in-supabase)
2. [One-Click Database Setup (SQL Schema)](#2-one-click-database-setup-sql-schema)
3. [Local Development (.env) Configuration](#3-local-development-env-configuration)
4. [Vercel Production Deployment Environment Variables](#4-vercel-production-deployment-environment-variables)
5. [Architecture: Why Transaction Pooling Matters on Vercel](#5-architecture-why-transaction-pooling-matters-on-vercel)

---

## 1. Where to Find Every Key in Supabase

Login to [Supabase Dashboard](https://supabase.com/dashboard) and select or create your project (Recommended Region: **South Asia (Mumbai) - ap-south-1** for lowest latency to Hyderabad).

### A. API Keys (Auth & REST Client)
1. In the left navigation bar, click the ⚙️ **Project Settings** (gear icon at the bottom).
2. Under the **Configuration** menu, click **API**.
3. You will see:
   - **Project URL**:
     - Format: `https://[YOUR-PROJECT-REF].supabase.co`
     - Maps to: `SUPABASE_URL`
   - **Project API Keys**:
     - `anon` `public`:
       - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
       - Maps to: `SUPABASE_ANON_KEY` (Used for user auth & client queries under RLS)
     - `service_role` `secret`:
       - Click **Reveal** to copy
       - Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
       - Maps to: `SUPABASE_SERVICE_ROLE_KEY` (Used by backend for administrative sync)

---

### B. Database Connection Strings & Poolers
1. In ⚙️ **Project Settings**, click **Database**.
2. Scroll down to the **Connection string** box.

#### 1. Transaction Pooler (Port 6543) — **CRITICAL FOR VERCEL**
- Click the **Connection Pooler** toggle button.
- Select Mode: **Transaction**.
- Notice the port is **`6543`**.
- Copy the URI string:
  ```text
  postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
  ```
- **Replace `[YOUR-PASSWORD]`** with your database password.
- Maps to: `DATABASE_URL` in your `.env` and Vercel.

#### 2. Session Pooler (Port 5432)
- Click the **Connection Pooler** toggle button.
- Select Mode: **Session**.
- Notice the port is **`5432`**.
- Copy the URI string:
  ```text
  postgresql://postgres.[YOUR-PROJECT-REF]:[YOUR-PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
  ```
- Maps to: `SESSION_POOLER_URL` in your `.env`.

#### 3. Direct Connection (Port 5432)
- Click the **Direct Connection** (or **URI** without pooler) toggle.
- Notice the host is `db.[YOUR-PROJECT-REF].supabase.co` and port is **`5432`**.
- Copy the URI string:
  ```text
  postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres?sslmode=require
  ```
- Maps to: `DIRECT_URL` in your `.env`.

---

## 2. One-Click Database Setup (SQL Schema)

1. In Supabase Dashboard, click the **SQL Editor** icon (`>_`) in the left sidebar.
2. Click **New query** (or the `+` button).
3. Open the file [`supabase_schema.sql`](./supabase_schema.sql) in this repository.
4. Copy the entire file contents and paste them into the Supabase SQL Editor.
5. Click **Run** (or press `Ctrl+Enter` / `Cmd+Enter`).

### What this creates automatically:
- `public.users`: Merchant profiles, revenue tiers, store categories.
- `public.products`: Real-time inventory catalog with boAt, Tata Sampann, OnePlus, and Aashirvaad SKUs.
- `public.chat_history`: Multi-turn conversational memory for the Floating Copilot and autonomous agents.
- `public.sales_transactions`: POS checkout records.
- `public.audit_logs`: Agentic action logs and compliance audit trails.
- `public.team_divisions`: POS Billing, Floor Sales, and Inventory Inward departmental telemetry.
- **Indexes & Row Level Security (RLS)**: Pre-configured for speed and security.

---

## 3. Local Development (`.env`) Configuration

Open the root `.env` file and populate the keys:

```env
# Server
PORT=5000
NODE_ENV=production

# Groq Cloud LPU
GROQ_API_KEY=your_groq_api_key_here
GROQ_API_BASE_URL=https://api.groq.com/openai/v1
GROQ_MODEL=openai/gpt-oss-120b
USE_MOCK_FALLBACK=true

# Supabase API Keys (From Project Settings > API)
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1Ni...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1Ni...

# Supabase PostgreSQL Pooler Strings (From Project Settings > Database)
DATABASE_URL=postgresql://postgres.your-project-id:your-password@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require
SESSION_POOLER_URL=postgresql://postgres.your-project-id:your-password@aws-0-ap-south-1.pooler.supabase.com:5432/postgres?sslmode=require
DIRECT_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres?sslmode=require
```

> **Note:** If you haven't created your Supabase project yet, the server automatically operates in **Resilient Local Mode** with zero crashes. As soon as you add the keys, it transitions seamlessly to Supabase Cloud!

---

## 4. Vercel Production Deployment Environment Variables

When deploying to [Vercel](https://vercel.com):

1. Go to your project dashboard on Vercel.
2. Click **Settings** -> **Environment Variables**.
3. Add the following variables (for **Production**, **Preview**, and **Development**):

| Key | Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` | Groq Cloud LPU inference key |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | Groq high-speed reasoning model |
| `USE_MOCK_FALLBACK` | `true` | Prevents downtime during rate limits |
| `SUPABASE_URL` | `https://[REF].supabase.co` | Supabase API endpoint |
| `SUPABASE_ANON_KEY` | `eyJhbGci...` | Supabase Public Anon JWT |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGci...` | Supabase Backend Secret JWT |
| `DATABASE_URL` | `postgresql://postgres.[REF]:[PASS]@...:6543/...` | **Transaction Pooler (Port 6543)** |
| `DIRECT_URL` | `postgresql://postgres:[PASS]@db...:5432/...` | Direct Postgres Connection |
| `NODE_ENV` | `production` | Production environment flag |

---

## 5. Architecture: Why Transaction Pooling Matters on Vercel

```
  ┌───────────────────────────────────┐
  │   Vercel Serverless Functions     │
  │   (Express API in api/index.js)   │
  └─────────────────┬─────────────────┘
                    │
            Port 6543 (PgBouncer)
                    │
                    ▼
  ┌───────────────────────────────────┐
  │   Supabase Transaction Pooler     │  ◄── Reuses pooled DB connections
  │   (aws-0-ap-south-1.pooler)       │      Prevents "max connections exceeded"
  └─────────────────┬─────────────────┘
                    │
                    ▼
  ┌───────────────────────────────────┐
  │   Supabase PostgreSQL Engine      │  ◄── Stores users, products,
  │   (Hyderabad Retail Catalog)      │      chat history, and audit logs
  └───────────────────────────────────┘
```

Because serverless functions spin up dynamically, standard direct database connections (port 5432) can quickly exhaust PostgreSQL's connection limits. **Supabase's Transaction Pooler on Port 6543** multiplexes hundreds of concurrent requests through lightweight connection proxies, ensuring **sub-15ms query execution** without connection drops!
