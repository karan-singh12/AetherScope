# AetherScope

AI Observability & Inference Analytics Platform

AetherScope is a full-stack observability platform for Large Language Models. It tracks inference performance, model latency, token costs, conversation histories, and anomalies in real time — giving teams complete visibility into their LLM pipelines.

---

## Features

- Live chat console with support for OpenAI, Claude, and Gemini
- Real-time dashboard with daily request volume, latency trends, token usage, and cost breakdowns
- Conversation management — browse, search, and replay full conversation histories
- Anomaly detection for latency spikes, error rate surges, and token cost outliers
- Profile management for updating name and email
- Auth-protected navigation with toast notifications on unauthorized access
- Unified LLM SDK wrapper across multiple providers

---

## Project Structure

```
AetherScope/
├── backend/          # Node.js + Express + Prisma + PostgreSQL API
└── frontend/         # Next.js 15 + Tailwind CSS dashboard
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- PostgreSQL database
- At least one LLM API key (OpenAI, Anthropic, or Google Gemini)

### Backend

```bash
cd backend
npm install

cp .env.example .env
# Fill in DATABASE_URL, JWT_SECRET, and your LLM API keys

npx prisma migrate dev

npm run dev
# Runs on http://localhost:4000
```

### Frontend

```bash
cd frontend
npm install

cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL=http://localhost:4000

npm run dev
# Runs on http://localhost:3000
```

---

## Environment Variables

### Backend `.env`

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key |
| `GEMINI_API_KEY` | Google Gemini API key |
| `PORT` | Server port (default: 4000) |

### Frontend `.env.local`

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend API base URL |

---

## Tech Stack

**Backend**
- Node.js + TypeScript
- Express.js
- PostgreSQL with Prisma ORM
- JWT authentication with bcrypt
- Socket.io for real-time communication
- Joi for request validation

**Frontend**
- Next.js 15 (App Router)
- Tailwind CSS
- Recharts for data visualization
- Zustand for state management
- React Hook Form
- Axios

---

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive a JWT |
| GET | `/api/auth/profile` | Get current user profile |
| PUT | `/api/auth/profile` | Update name or email |
| GET | `/api/dashboard/stats` | Aggregate dashboard stats |
| GET | `/api/dashboard/daily-requests` | Daily request volume |
| GET | `/api/dashboard/latency-trends` | Latency over time |
| POST | `/api/chat` | Send a message to an LLM provider |
| GET | `/api/conversations` | List all conversations |
| GET | `/api/conversations/:id` | Get a single conversation |
| GET | `/api/anomalies` | Get detected anomalies |
| GET | `/api/logs` | Raw inference logs |

---

## Directory Structure

**Backend**

```
src/
├── controllers/     # Request handlers
├── middleware/      # Auth, validation, error handling
├── models/          # Prisma types
├── routes/          # Express route definitions
├── sdk/             # LLM provider SDK (OpenAI, Claude, Gemini)
├── services/        # Business logic
├── types/           # TypeScript definitions
├── utils/           # Logger, response helpers, etc.
└── validators/      # Joi schemas
```

**Frontend**

```
frontend/
├── app/             # Next.js App Router pages
│   ├── chat/
│   ├── conversations/
│   ├── dashboard/
│   ├── anomalies/
│   └── profile/
├── components/      # Shared UI components
├── context/         # Auth context
├── hooks/           # Custom React hooks
├── services/        # API service modules
└── types/           # Shared TypeScript types
```

---

## License

MIT
