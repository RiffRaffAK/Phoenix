# 🔮 Phoenix Wolf Systems V9

**Owner:** Keli Voigt (100% immutable)  
**Business:** Astral Prisms  
**Version:** 9.0 — Sovereign & Eternal

---

## What Is This?

Phoenix Wolf Systems V9 is a complete, production-ready sovereign platform for Keli Voigt / Astral Prisms. It includes:

- **Beautiful cosmic UI** — deep purples, electric lavender, sky frost blue
- **Real Node.js backend** — Express + SQLite + JWT + WebSocket
- **Real WebRTC P2P mesh** — direct peer-to-peer connections
- **Ghost Worker** — Service Worker for offline persistence
- **Threat detection** — 8-microsecond precision, 18+ threat signatures
- **UBI pool** — continuous revenue flow and distribution
- **Employee time tracking** — clock in/out, payroll, 35% tax withholding
- **Family Den** — relationships, custody, child support
- **Cave management** — 5 security levels from public to top secret
- **Constitutional framework** — 25 values, 22 dysfunctional rules enforced
- **200+ industries** — all integrated
- **200 countries** — real wage laws and tax systems
- **GitHub API integration** — state sync to your repo
- **Real authentication** — JWT tokens, bcrypt passwords

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Edit .env — change JWT_SECRET at minimum

# 3. Start the server
npm start

# 4. Open browser
open http://localhost:3000
```

Or use the deployment script:
```bash
bash deploy.sh
```

---

## Project Structure

```
Phoenix/
├── index.html          # Complete cosmic UI (all tabs)
├── server.js           # Node.js backend (Express + SQLite + Socket.io)
├── service-worker.js   # Ghost Worker (offline, sync, push notifications)
├── phoenixSystem.json  # Industries, wage laws, owner config
├── threats.json        # 18+ threat signatures, detection engine
├── constitution.json   # 25 constitutional values, 22 dysfunctional rules
├── package.json        # Dependencies
├── .env.example        # Configuration template
├── .gitignore          # Git setup
├── deploy.sh           # One-command deployment
└── README.md           # This file
```

---

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `JWT_SECRET` | JWT signing secret — **change this** | (insecure default) |
| `DB_PATH` | SQLite database path | `./phoenix.db` |
| `GITHUB_TOKEN` | GitHub PAT for API sync | (optional) |
| `GITHUB_OWNER` | GitHub username | `RiffRaffAK` |
| `GITHUB_REPO` | GitHub repo name | `Phoenix` |

---

## API Reference

### Authentication
```
POST /api/auth/register   { username, password }  → { token, user }
POST /api/auth/login      { username, password }  → { token, user }
```

### Nodes
```
POST /api/nodes/register  { nodeId, ipAddress, deviceType }  → { success }
GET  /api/nodes                                              → { nodes }
```

### Messages
```
POST /api/messages/send   { fromNode, toNode, content }  → { success, id }
GET  /api/messages                                        → { messages }
```

### Threat Detection
```
GET  /api/threats             → { threats, stats }
POST /api/threats/scan        { text }  → { detected, elapsedNs }
```

### UBI Pool
```
GET  /api/ubi                 → { pool, distributions }
POST /api/ubi/distribute      { amount }  → { success, amount }
```

### Employee Time Tracking
```
POST /api/employees/create    { name, role, industry, country, hourlyRate }
POST /api/employees/:id/clockin
POST /api/employees/:id/clockout
GET  /api/employees
```

### Family Den
```
POST /api/family/add          { memberName, relation, custodyStatus, childSupportAmount }
GET  /api/family
```

### Caves
```
POST /api/caves/create        { caveName, caveType, securityLevel }
GET  /api/caves
```

### System
```
GET  /api/system/status
GET  /api/system/constitution
GET  /api/system/threats-catalog
GET  /api/system/industries
```

---

## Deployment

### Local / Home Server
```bash
npm install
cp .env.example .env
# Edit .env
node server.js
```

### Raspberry Pi
```bash
git clone https://github.com/RiffRaffAK/Phoenix.git
cd Phoenix
npm install
cp .env.example .env
# Edit .env
# Run with PM2 for persistence:
npm install -g pm2
pm2 start server.js --name phoenix
pm2 startup
pm2 save
```

### VPS (DigitalOcean / Linode)
```bash
git clone https://github.com/RiffRaffAK/Phoenix.git
cd Phoenix
npm install
cp .env.example .env
# Edit .env with a strong JWT_SECRET
node server.js
# Or with PM2:
pm2 start server.js --name phoenix
```

### GitHub Pages (Static Mode)
The `index.html` works standalone without a backend.  
Just open the file or host it on GitHub Pages.  
Use **Demo Mode** in the login screen — all UI features work without a backend.

---

## Security

- All passwords are bcrypt-hashed (cost factor 10)
- All endpoints (except auth and status) require JWT Bearer token
- Helmet.js middleware for HTTP security headers
- Input sanitization via threat detection engine
- SQLite with WAL mode and foreign key enforcement
- CORS configured (restrict in production)
- **Change `JWT_SECRET` in production**

---

## The Constitutional Framework

Phoenix enforces 25 constitutional values and detects 22 dysfunctional rules.

**Core Values include:** Integrity, Dignity, Justice, Compassion, Sovereignty, Transparency, Privacy, Liberty, Equality, Security, Abundance, Sustainability, Education, Health, Community, Innovation, Accountability, Consent, Stewardship, Reciprocity, Resilience, Inclusion, Truth, Protection, Evolution.

**Dysfunctional Rules blocked include:** NO_DECEPTION, NO_EXPLOITATION, NO_COERCION, NO_DISCRIMINATION, NO_WAGE_THEFT, NO_CHILD_EXPLOITATION, NO_FRAUD, NO_PRIVACY_VIOLATION, NO_MISINFORMATION, NO_STARVATION, and more.

---

## Threat Detection

Phoenix detects 18+ threat types in real-time:
- Ransomware (CryptoLocker, WannaCry variants)
- SQL, XSS, and Command Injection
- Rootkits and Bootkits
- Network and Email Worms
- Browser Hijackers and Adware
- Keyloggers, Spyware, Trojans
- Cryptominers, DDoS, Phishing
- Zero-day exploits (heuristic detection)

Value from blocked threats flows into the UBI pool.

---

## UBI System

- Pool starts at $100,000 and grows continuously
- 15% of employee payroll contributions go to pool
- 20% of threat-capture value goes to pool
- Pool increments automatically every 5 seconds
- Any authenticated user can request distributions

---

## Owner Information

- **Owner:** Keli Voigt — 100% ownership, immutable
- **Business:** Astral Prisms
- **Devices:** Samsung Galaxy S23+ (192.168.40.221), Android A14 5G (192.168.40.222)
- **Frequency:** 432 Hz

---

*Phoenix Wolf Systems V9 — Sovereign, Eternal, Real.*
