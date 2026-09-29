# 🚀 Universal Cloud Deployment Guide for Diligent

Diligent is engineered for **Zero-Config Universal Deployment** across any cloud provider (Vercel, Render, Railway, Azure Container Apps, AWS, Docker) with native **Supabase PostgreSQL & Connection Pooler** integration.

---

## 🔑 Complete Environment Variables Reference (Vercel & Universal)

Add the following Environment Variables in your hosting provider's Dashboard (e.g., **Vercel Project Settings > Environment Variables**):

| Variable Name | Required? | Recommended Value | Description |
| :--- | :---: | :--- | :--- |
| `GROQ_API_KEY` | **Yes** | `gsk_...` | High-speed Groq LPU inference key. |
| `GROQ_MODEL` | Optional | `openai/gpt-oss-120b` | Reasoning model (falls back to `qwen/qwen3.8-27b`). |
| `GROQ_API_BASE_URL` | Optional | `https://api.groq.com/openai/v1` | Groq OpenAI-compatible endpoint. |
| `USE_MOCK_FALLBACK` | **Yes** | `true` | Prevents downtime if rate-limits or offline events occur. |
| `NODE_ENV` | **Yes** | `production` | Enables production optimizations and client dist serving. |
| `SUPABASE_URL` | **Yes** | `https://[REF].supabase.co` | Found in **Project Settings > API**. |
| `SUPABASE_ANON_KEY` | **Yes** | `eyJhbGciOi...` | Public Anon JWT from **Project Settings > API**. |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | `eyJhbGciOi...` | Secret Service Role JWT for administrative operations. |
| `DATABASE_URL` | **Yes** | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require` | **Transaction Pooler (Port 6543)** — essential for Vercel serverless. |
| `SESSION_POOLER_URL` | Optional | `postgresql://postgres.[REF]:[PASS]@aws-0-[REGION].pooler.supabase.com:5432/postgres?sslmode=require` | **Session Pooler (Port 5432)** for long-lived sessions. |
| `DIRECT_URL` | Optional | `postgresql://postgres:[PASS]@db.[REF].supabase.co:5432/postgres?sslmode=require` | **Direct Connection (Port 5432)**. |

> 📖 **Full Visual Step-by-Step Guide**: Read [`SUPABASE_INTEGRATION_GUIDE.md`](./SUPABASE_INTEGRATION_GUIDE.md) to see where to find each key and how to initialize the database in 1-click using [`supabase_schema.sql`](./supabase_schema.sql).

---

## 🛠️ Build & Start Commands (Universal)

- **Install Command:** `npm install` *(Root `postinstall` script automatically installs client dependencies too!)*
- **Build Command:** `npm run build` *(Compiles React Vite frontend into `client/dist`)*
- **Start Command:** `npm start` *(Starts Express server on `$PORT` serving both API and Frontend)*
- **Output Directory (if asked):** `client/dist`

---

## 🌐 Deploy to Vercel (1-Click Ready)
1. Push this repository to GitHub (`https://github.com/akhilchiluvari/Diligent.git`).
2. Go to [Vercel Dashboard](https://vercel.com/new) -> Import `Diligent`.
3. Add the Environment Variables listed in the table above under **Environment Variables**.
4. Click **Deploy**.
5. The `vercel.json` and `api/index.js` files route API requests to Express serverless handlers and serve the client SPA without build errors.

---

## 🚆 Deploy to Render / Railway
1. Click **New Web Service** and connect this repository.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Add the Environment Variables under Environment Settings.
5. Deploy!

---

## 🐳 Deploy with Docker
```bash
docker build -t diligent-app .
docker run -p 5000:5000 -e GROQ_API_KEY="your_key" diligent-app
```
Then visit `http://localhost:5000`.
