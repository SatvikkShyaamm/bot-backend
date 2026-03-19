# ⚔️ Battle of Threats (BOT) — Setup Guide
**Team Rootshell | SETS Gameathon 2026**

---

## Prerequisites

| Tool | Minimum Version |
|------|----------------|
| Node.js | v18+ |
| MongoDB | v6+ (Community Edition) |
| npm | v9+ |

---

## Step 1 — Clone / Download the Project

Your project structure should be:
```
battle-of-threats/
├── bot-backend/
└── bot-frontend/
```

---

## Step 2 — Configure Backend

```bash
cd bot-backend

# Install dependencies
npm install

# Create your environment file
cp .env.template .env
```

Now **edit `.env`** and fill in these values:

```env
# Your MongoDB connection (local MongoDB)
MONGO_URI=mongodb://localhost:27017/battle_of_threats

# Generate a secure JWT secret (run this in terminal):
# node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
JWT_SECRET=PASTE_YOUR_64_CHAR_SECRET_HERE

# Your Anthropic API Key (get from console.anthropic.com)
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY_HERE

FRONTEND_URL=http://localhost:5173
NODE_ENV=development
PORT=5000
```

---

## Step 3 — Start MongoDB

```bash
# On macOS (with Homebrew):
brew services start mongodb-community

# On Ubuntu/Linux:
sudo systemctl start mongod

# On Windows:
# Start MongoDB from Services, or run: mongod
```

---

## Step 4 — Start Backend

```bash
cd bot-backend
npm run dev
# Server starts on http://localhost:5000
```

You should see:
```
✅ MongoDB connected
🚀 Server running on port 5000
```

---

## Step 5 — Configure & Start Frontend

```bash
cd bot-frontend
npm install
npm run dev
# Frontend starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

---

## Step 6 — Play!

1. Go to `/register` — create your operative account
2. You'll be auto-redirected to `/arena` — the mission map
3. Click **SOCIAL ENGINEERING** (Level 1) to start
4. Complete all 5 tasks in a level to unlock the next
5. Each task = a real-world cybersecurity simulation
6. Make decisions → Claude AI analyzes your choices → earn XP → unlock badges

---

## Project File Map

### Backend (`bot-backend/`)
```
server.js              — Express app, all middleware, routes
models/
  User.js              — User schema (passwords hashed, never exposed)
  Progress.js          — Per-user per-level per-task game state
routes/
  auth.js              — Register, login, logout, /me (JWT in HttpOnly cookies)
  progress.js          — Fetch progress, submit simulation actions
  simulation.js        — Fetch scenario data for a task
  claude.js            — Claude API integration (threat analysis + feedback)
utils/
  xpCalculator.js      — All 20 tasks × all actions → XP/result/feedback
  badges.js            — Badge unlock conditions
data/
  scenarios.js         — All 20 rich scenario definitions (environments, actions, hints)
middleware/
  auth.js              — JWT verification middleware (reads HttpOnly cookie only)
```

### Frontend (`bot-frontend/src/`)
```
App.jsx                — Router + protected/public route guards
context/AuthContext.jsx — Global auth state, login/register/logout functions
utils/api.js           — Axios instance with credentials:true (cookie auth)
pages/
  Register.jsx/.css    — Gamified registration with matrix rain background
  Login.jsx            — IAM login terminal
  Auth.css             — Shared auth page styles
  Arena.jsx/.css       — Main mission map with 4 level nodes + hex grid
  LevelMap.jsx/.css    — Task map within a level (same visual language)
  Simulation.jsx/.css  — Full simulation UI: environment + Claude panel + actions
components/
  Navbar.jsx/.css      — Top bar: branding tooltip, XP bar, user panel dropdown
styles/
  global.css           — CSS variables, animations, shared utility classes
```

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Auth tokens | JWT in **HttpOnly cookies** — JS cannot access, no URL exposure |
| Password storage | bcrypt (12 salt rounds) |
| HTTP headers | helmet.js (XSS, HSTS, CSP, etc.) |
| Rate limiting | 10 auth attempts per 15 minutes |
| CORS | Locked to localhost:5173 only |
| Input validation | express-validator on all auth routes |
| Level locking | Server enforces — not just frontend |
| No sensitive data in URLs | All via POST body or cookie auth |
| MongoDB | No raw ObjectIDs exposed; `.toSafeObject()` used everywhere |

---

## XP Scoring Summary

| Level | Correct Action | Partial | Wrong | Difficulty Multiplier |
|-------|---------------|---------|-------|----------------------|
| L1 Social Eng. | +30 XP | +10 XP | 0 + Risk↑ | Easy×1, Med×1.5, Hard×2 |
| L2 Phishing | +50 XP | +15 XP | 0 + Risk↑ | Easy×1, Med×1.5, Hard×2 |
| L3 AI Scams | +75 XP | +20 XP | 0 + Risk↑↑ | Easy×1, Med×1.5, Hard×2 |
| L4 Malware | +100 XP | +25 XP | 0 + Risk↑↑↑ | Easy×1, Med×1.5, Hard×2 |

**Retake rule:** Up to 3 attempts per task. No XP penalty for retrying.

---

## Badges

| Badge | Condition |
|-------|-----------|
| ⚔️ First Blood | Complete your first task |
| 🛡️ Social Shield | Complete Level 1 |
| 🎣 Phish Slayer | Complete Level 2 |
| 🤖 AI Detective | Complete Level 3 |
| 🦠 Malware Hunter | Complete Level 4 |
| 🏆 Cyber Elite | Complete all 4 levels |
| ⚡ XP Warrior | Earn 500+ total XP |
| 💎 Flawless | Complete a level with zero wrong answers |

---

## Claude API Integration

Claude powers two features:
1. **Pre-decision threat analysis** — when you enter a mission, Claude gives a subtle analysis of the threat indicators without spoiling the answer
2. **Post-decision debrief** — after you act, Claude provides a detailed educational explanation of why your choice was correct/wrong with real-world context

The system gracefully falls back to pre-scripted feedback if the Claude API is unavailable.

---

## Troubleshooting

**MongoDB connection fails:**
- Ensure MongoDB service is running (`mongod` or service manager)
- Check your `MONGO_URI` in `.env`

**"Not authenticated" errors:**
- Cookies require the backend and frontend to be on the same origin (handled by Vite proxy)
- Make sure `credentials: true` in CORS and axios config

**Claude API not working:**
- Check your API key in `.env`
- Verify you have API credits at `console.anthropic.com`
- The app falls back to pre-scripted feedback gracefully

**Port conflicts:**
- Backend defaults to 5000, change with `PORT=XXXX` in `.env`
- Frontend defaults to 5173, change in `vite.config.js`
