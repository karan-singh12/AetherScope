# 🔭 AetherScope

> **AI Observability & Inference Analytics Platform**

AetherScope is a full-stack, production-grade observability platform for Large Language Models (LLMs). It tracks inference performance, model latency, token costs, conversation histories, and anomalies in real-time — giving AI teams complete visibility into their LLM pipelines.

---

## ✨ Features

- **Live Chat Console** — Interact with OpenAI, Claude, and Gemini models through a unified interface
- **Inference Dashboard** — Real-time charts for daily request volume, latency trends, token usage, and cost
- **Conversation Management** — Browse, search, and replay full conversation histories
- **Anomaly Detection** — Automated detection of latency spikes, error rate surges, and token cost outliers
- **Profile Management** — Update your name and email tied to your account
- **Auth-Protected Navigation** — Unauthenticated users are redirected to login with a toast notification
- **Multi-Provider SDK** — Unified wrapper for OpenAI, Anthropic Claude, and Google Gemini

---

## 🗂️ Monorepo Structure

```
AetherScope/
├── backend/          # Node.js + Express + Prisma + PostgreSQL API
└── frontend/         # Next.js 15 + Tailwind CSS + Recharts dashboard
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- API keys: OpenAI / Anthropic / Google Gemini (at least one)

---

### Backend Setup

```bash
cd backend
npm install

# Copy environment template
cp .env.example .env
# Edit .env with your DATABASE_URL, JWT_SECRET, and LLM API keys

# Run Prisma migrations
npx prisma migrate dev

# Start dev server (runs on port 4000)
npm run dev
```

### Frontend Setup

```bash
cd frontend
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local — set NEXT_PUBLIC_API_URL=http://localhost:4000

# Start dev server (runs on port 3000)
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔧 Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT token signing |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: `4000`) |

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL (e.g. `http://localhost:4000`) |

---

## 🏗️ Tech Stack

### Backend
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** JWT (JSON Web Tokens) with bcrypt password hashing
- **LLM SDK:** Custom unified provider (OpenAI, Claude, Gemini)
- **Realtime:** Socket.io
- **Validation:** Joi + express-validator

### Frontend
- **Framework:** Next.js 15 (App Router)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **State:** Zustand
- **Forms:** React Hook Form
- **HTTP:** Axios

---

## 📡 API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/profile` | Get current user profile |
| `PUT` | `/api/auth/profile` | Update name/email |
| `GET` | `/api/dashboard/stats` | Aggregate dashboard stats |
| `GET` | `/api/dashboard/daily-requests` | Daily request volume |
| `GET` | `/api/dashboard/latency-trends` | Latency over time |
| `POST` | `/api/chat` | Send a message to an LLM provider |
| `GET` | `/api/conversations` | List all conversations |
| `GET` | `/api/conversations/:id` | Get a specific conversation |
| `GET` | `/api/anomalies` | Get detected anomalies |
| `GET` | `/api/logs` | Raw inference logs |

---

## 📁 Backend Directory Structure

```
backend/src/
├── controllers/        # Route handler logic
├── middleware/         # Auth, validation, error handling
├── models/             # Prisma schema types
├── routes/             # Express route definitions
├── sdk/                # LLM provider SDK (OpenAI, Claude, Gemini)
│   └── providers/
├── services/           # Business logic layer
├── types/              # TypeScript type definitions
├── utils/              # Helpers (logger, response formatting, etc.)
└── validators/         # Joi schema validators
```

## 📁 Frontend Directory Structure

```
frontend/
├── app/                # Next.js App Router pages
│   ├── chat/           # Chat console
│   ├── conversations/  # Conversation list & detail
│   ├── dashboard/      # Analytics dashboard
│   ├── anomalies/      # Anomaly detection view
│   └── profile/        # User profile settings
├── components/
│   └── common/         # TopNav, UserMenu, ToastPortal
├── context/            # Auth context (React Context API)
├── hooks/              # useToast, useChat, etc.
├── services/           # Axios API service modules
└── types/              # Shared TypeScript types
```

---

## 🛡️ License

MIT © AetherScope
