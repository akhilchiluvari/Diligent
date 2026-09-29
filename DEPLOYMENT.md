# 🚀 Universal Cloud Deployment Guide for Diligent

Diligent is engineered for **Zero-Config Universal Deployment** across any cloud provider (Vercel, Render, Railway, Azure Container Apps, AWS, Docker).

---

## 🔑 Required Environment Variables (ENVs)

Add the following Environment Variables in your hosting provider's Dashboard (e.g., Vercel Project Settings > Environment Variables, or Render / Railway Environment Settings):

| Variable Name | Recommended Value | Description |
| :--- | :--- | :--- |
| `GROQ_API_KEY` | `gsk_...` *(Your Groq API Key)* | Required for live 120B / 27B LPU inference. |
| `GROQ_MODEL` | `openai/gpt-oss-120b` | High-reasoning 120-Billion parameter model on Groq. |
| `GROQ_API_BASE_URL` | `https://api.groq.com/openai/v1` | Groq OpenAI-compatible inference endpoint. |
| `NODE_ENV` | `production` | Enables production optimizations and static asset serving. |
| `PORT` | `5000` *(or host default)* | Port for Express server (Render/Railway/Vercel auto-assigns if omitted). |
| `USE_MOCK_FALLBACK` | `true` | **Recommended:** Keeps all agents 100% operational if Groq free tier rate limits (8k TPM) are hit. |

---

## 🛠️ Build & Start Commands (Universal)

If your platform asks for explicit commands:

- **Install Command:** `npm install` *(Root `postinstall` script automatically installs client dependencies too!)*
- **Build Command:** `npm run build` *(Compiles React Vite frontend into `client/dist`)*
- **Start Command:** `npm start` *(Starts Node Express server on `$PORT` serving both API and Frontend)*
- **Output Directory (if asked):** `client/dist`

---

## 🌐 Deploy to Vercel (1-Click Ready)
1. Push this repository to GitHub (already linked: `https://github.com/akhilchiluvari/Diligent.git`).
2. Go to [Vercel Dashboard](https://vercel.com/new) -> Import `Diligent`.
3. Add `GROQ_API_KEY` under Environment Variables.
4. Click **Deploy**. The `vercel.json` and `api/index.js` files are already configured.

---

## 🚆 Deploy to Render / Railway
1. Click **New Web Service** and connect this repository.
2. Build Command: `npm run build`
3. Start Command: `npm start`
4. Add `GROQ_API_KEY` under Environment Variables.
5. Deploy!

---

## 🐳 Deploy with Docker
```bash
docker build -t diligent-app .
docker run -p 5000:5000 -e GROQ_API_KEY="your_key" diligent-app
```
Then visit `http://localhost:5000`.
