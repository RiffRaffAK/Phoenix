'use strict';

require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const initSqlJs = require('sql.js');

// ─── Configuration ────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'phoenix-wolf-change-in-production';
const DB_PATH = process.env.DB_PATH || './phoenix.db';
const OWNER_NAME = 'Keli Voigt';
const BUSINESS_NAME = 'Astral Prisms';
const TAX_RATE = 0.35;
const UBI_POOL_PERCENT = 0.15;

// ─── Load system data ─────────────────────────────────────────────────────────
const phoenixSystem = JSON.parse(fs.readFileSync(path.join(__dirname, 'phoenixSystem.json'), 'utf8'));
const threats = JSON.parse(fs.readFileSync(path.join(__dirname, 'threats.json'), 'utf8'));
const constitution = JSON.parse(fs.readFileSync(path.join(__dirname, 'constitution.json'), 'utf8'));

// ─── Database helpers (sql.js wrapper) ───────────────────────────────────────
let db = null;

function dbRun(sql, params = []) {
    db.run(sql, params);
}

function dbGet(sql, params = []) {
    const stmt = db.prepare(sql);
    stmt.bind(params);
    if (stmt.step()) {
        const row = stmt.getAsObject();
        stmt.free();
        return row;
    }
    stmt.free();
    return null;
}

function dbAll(sql, params = []) {
    const results = [];
    const stmt = db.prepare(sql);
    stmt.bind(params);
    while (stmt.step()) {
        results.push(stmt.getAsObject());
    }
    stmt.free();
    return results;
}

function dbInsert(sql, params = []) {
    db.run(sql, params);
    const row = dbGet('SELECT last_insert_rowid() as id');
    return row ? row.id : null;
}

// Persist DB to file
function saveDB() {
    try {
        const data = db.export();
        fs.writeFileSync(DB_PATH, Buffer.from(data));
    } catch (e) {
        console.error('[DB] Save error:', e.message);
    }
}

// ─── Express Setup ────────────────────────────────────────────────────────────
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", 'ws:', 'wss:', 'stun:stun.l.google.com'],
            imgSrc: ["'self'", 'data:'],
            styleSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'"],
        }
    }
}));
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ─── Rate Limiters ────────────────────────────────────────────────────────────
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true, legacyHeaders: false });
const apiLimiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 120, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth/', authLimiter);
app.use('/api/', apiLimiter);

// ─── Threat Detection Engine ──────────────────────────────────────────────────
function detectThreats(inputText, sourceIp) {
    const detected = [];
    const start = process.hrtime.bigint();

    for (const threat of threats.threatSignatures) {
        let matched = false;
        for (const sig of threat.signatures) {
            if (inputText.toLowerCase().includes(sig.toLowerCase())) {
                matched = true;
                break;
            }
        }
        if (matched) {
            const id = dbInsert(
                'INSERT INTO threat_log (threat_id, threat_type, threat_name, source_ip, severity, action_taken, monetary_value) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [threat.id, threat.type, threat.name, sourceIp || 'unknown', threat.severity, threat.responseAction, threat.monetaryValue]
            );
            // Add capture value to UBI pool
            const captureValue = threat.monetaryValue * 0.20;
            dbRun('UPDATE ubi_pool SET total_pool = total_pool + ? WHERE id = 1', [captureValue]);
            detected.push({ ...threat, logId: id });
        }
    }

    const elapsed = Number(process.hrtime.bigint() - start);
    return { detected, elapsedNs: elapsed };
}

// ─── Auth Middleware ──────────────────────────────────────────────────────────
function authMiddleware(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'No token provided' });
    const token = authHeader.split(' ')[1];
    try {
        req.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        res.status(401).json({ error: 'Invalid token' });
    }
}

function logAction(userId, action, details, ip) {
    dbRun('INSERT INTO audit_log (user_id, action, details, ip_address) VALUES (?, ?, ?, ?)',
        [userId || null, action, details || null, ip || null]);
}

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    try {
        const existing = dbGet('SELECT id FROM users WHERE username = ?', [username]);
        if (existing) return res.status(409).json({ error: 'Username already exists' });
        const hash = bcrypt.hashSync(password, 10);
        const id = dbInsert('INSERT INTO users (username, password_hash) VALUES (?, ?)', [username, hash]);
        saveDB();
        logAction(id, 'register', `User ${username} registered`, req.ip);
        const token = jwt.sign({ id, username, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, user: { id, username, role: 'user' } });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
    const user = dbGet('SELECT * FROM users WHERE username = ?', [username]);
    if (!user || !bcrypt.compareSync(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    dbRun("UPDATE users SET last_login = datetime('now') WHERE id = ?", [user.id]);
    saveDB();
    logAction(user.id, 'login', `User ${username} logged in`, req.ip);
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
});

// ─── Node Registration ────────────────────────────────────────────────────────
app.post('/api/nodes/register', authMiddleware, (req, res) => {
    const { nodeId, ipAddress, deviceType } = req.body;
    if (!nodeId || !ipAddress) return res.status(400).json({ error: 'nodeId and ipAddress required' });
    try {
        const existing = dbGet('SELECT id FROM nodes WHERE node_id = ?', [nodeId]);
        if (existing) {
            dbRun("UPDATE nodes SET ip_address=?, last_seen=datetime('now') WHERE node_id=?", [ipAddress, nodeId]);
        } else {
            dbInsert('INSERT INTO nodes (node_id, ip_address, device_type, owner_id) VALUES (?, ?, ?, ?)',
                [nodeId, ipAddress, deviceType || 'unknown', req.user.id]);
        }
        saveDB();
        logAction(req.user.id, 'node_register', `Node ${nodeId} at ${ipAddress}`, req.ip);
        res.json({ success: true, nodeId });
    } catch (err) {
        res.status(500).json({ error: 'Node registration failed' });
    }
});

app.get('/api/nodes', authMiddleware, (req, res) => {
    const nodes = dbAll('SELECT node_id, ip_address, device_type, status, last_seen FROM nodes WHERE owner_id = ?', [req.user.id]);
    res.json({ nodes });
});

// ─── Messaging ────────────────────────────────────────────────────────────────
app.post('/api/messages/send', authMiddleware, (req, res) => {
    const { fromNode, toNode, content, encrypted } = req.body;
    if (!fromNode || !content) return res.status(400).json({ error: 'fromNode and content required' });

    const { detected } = detectThreats(content, req.ip);
    if (detected.length > 0 && detected.some(t => t.severity === 'critical')) {
        saveDB();
        return res.status(403).json({ error: 'Message blocked: critical threat detected', threats: detected.map(t => t.name) });
    }

    const id = dbInsert('INSERT INTO messages (from_node, to_node, content, encrypted) VALUES (?, ?, ?, ?)',
        [fromNode, toNode || null, content, encrypted ? 1 : 0]);
    saveDB();
    io.emit('message', { id, fromNode, toNode, content, timestamp: new Date().toISOString() });
    res.json({ success: true, id });
});

app.get('/api/messages', authMiddleware, (req, res) => {
    const messages = dbAll('SELECT * FROM messages ORDER BY timestamp DESC LIMIT 100');
    res.json({ messages });
});

// ─── Threat Management ────────────────────────────────────────────────────────
app.get('/api/threats', authMiddleware, (req, res) => {
    const threatLogs = dbAll('SELECT * FROM threat_log ORDER BY detected_at DESC LIMIT 200');
    const statsRow = dbGet('SELECT COUNT(*) as total, SUM(monetary_value) as total_value FROM threat_log');
    const stats = { count: statsRow ? statsRow.total : 0, value: statsRow ? statsRow.total_value || 0 : 0 };
    res.json({ threats: threatLogs, stats });
});

app.post('/api/threats/scan', authMiddleware, (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'text required' });
    const result = detectThreats(text, req.ip);
    saveDB();
    logAction(req.user.id, 'threat_scan', `Scanned ${text.length} chars, ${result.detected.length} found`, req.ip);
    res.json({ detected: result.detected, elapsedNs: result.elapsedNs.toString() });
});

// ─── UBI Pool ─────────────────────────────────────────────────────────────────
app.get('/api/ubi', authMiddleware, (req, res) => {
    const pool = dbGet('SELECT * FROM ubi_pool WHERE id = 1');
    const distributions = dbAll('SELECT * FROM ubi_distributions WHERE recipient_id = ? ORDER BY distributed_at DESC LIMIT 50', [req.user.id]);
    res.json({ pool, distributions });
});

app.post('/api/ubi/distribute', authMiddleware, (req, res) => {
    const { amount } = req.body;
    if (!amount || amount <= 0) return res.status(400).json({ error: 'Valid amount required' });
    const pool = dbGet('SELECT * FROM ubi_pool WHERE id = 1');
    if (!pool || (pool.total_pool - pool.distributed) < amount) return res.status(400).json({ error: 'Insufficient UBI pool' });
    dbRun('UPDATE ubi_pool SET distributed = distributed + ? WHERE id = 1', [amount]);
    dbInsert('INSERT INTO ubi_distributions (recipient_id, amount, source) VALUES (?, ?, ?)', [req.user.id, amount, 'ubi_pool']);
    saveDB();
    logAction(req.user.id, 'ubi_distribute', `Distributed $${amount}`, req.ip);
    res.json({ success: true, amount });
});

// ─── Employee Time Tracking ───────────────────────────────────────────────────
app.post('/api/employees/create', authMiddleware, (req, res) => {
    const { name, role, industry, country, hourlyRate } = req.body;
    if (!name || !hourlyRate) return res.status(400).json({ error: 'name and hourlyRate required' });
    const wageLaw = phoenixSystem.wageLaws.find(w => w.code === (country || 'US'));
    const effectiveRate = Math.max(hourlyRate, wageLaw ? wageLaw.minWage : 7.25);
    const id = dbInsert('INSERT INTO employees (user_id, name, role, industry, country, hourly_rate) VALUES (?, ?, ?, ?, ?, ?)',
        [req.user.id, name, role || 'General', industry || 'General', country || 'US', effectiveRate]);
    saveDB();
    res.json({ success: true, employeeId: id, effectiveRate });
});

app.post('/api/employees/:id/clockin', authMiddleware, (req, res) => {
    const emp = dbGet('SELECT * FROM employees WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const openRecord = dbGet('SELECT * FROM time_records WHERE employee_id = ? AND clock_out IS NULL', [emp.id]);
    if (openRecord) return res.status(409).json({ error: 'Already clocked in' });
    const id = dbInsert("INSERT INTO time_records (employee_id, clock_in) VALUES (?, datetime('now'))", [emp.id]);
    dbRun("UPDATE employees SET status = 'working' WHERE id = ?", [emp.id]);
    saveDB();
    res.json({ success: true, recordId: id });
});

app.post('/api/employees/:id/clockout', authMiddleware, (req, res) => {
    const emp = dbGet('SELECT * FROM employees WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const record = dbGet('SELECT * FROM time_records WHERE employee_id = ? AND clock_out IS NULL', [emp.id]);
    if (!record) return res.status(409).json({ error: 'Not clocked in' });
    const clockIn = new Date(record.clock_in);
    const hoursWorked = (Date.now() - clockIn.getTime()) / 3600000;
    const grossPay = hoursWorked * emp.hourly_rate;
    const taxWithheld = grossPay * TAX_RATE;
    const netPay = grossPay - taxWithheld;
    const ubiContrib = grossPay * UBI_POOL_PERCENT;
    dbRun("UPDATE time_records SET clock_out=datetime('now'), hours_worked=?, gross_pay=?, tax_withheld=?, net_pay=? WHERE id=?",
        [hoursWorked, grossPay, taxWithheld, netPay, record.id]);
    dbRun("UPDATE employees SET status = 'active' WHERE id = ?", [emp.id]);
    dbRun('UPDATE ubi_pool SET total_pool = total_pool + ? WHERE id = 1', [ubiContrib]);
    saveDB();
    res.json({ success: true, hoursWorked: hoursWorked.toFixed(4), grossPay: grossPay.toFixed(2), taxWithheld: taxWithheld.toFixed(2), netPay: netPay.toFixed(2) });
});

app.get('/api/employees', authMiddleware, (req, res) => {
    const employees = dbAll('SELECT * FROM employees WHERE user_id = ?', [req.user.id]);
    res.json({ employees });
});

// ─── Family Den ───────────────────────────────────────────────────────────────
app.post('/api/family/add', authMiddleware, (req, res) => {
    const { memberName, relation, custodyStatus, childSupportAmount, notes } = req.body;
    if (!memberName || !relation) return res.status(400).json({ error: 'memberName and relation required' });
    const id = dbInsert('INSERT INTO family_den (member_name, relation, den_owner_id, custody_status, child_support_amount, notes) VALUES (?, ?, ?, ?, ?, ?)',
        [memberName, relation, req.user.id, custodyStatus || null, childSupportAmount || 0, notes || null]);
    saveDB();
    logAction(req.user.id, 'family_add', `Added ${memberName} (${relation})`, req.ip);
    res.json({ success: true, id });
});

app.get('/api/family', authMiddleware, (req, res) => {
    const members = dbAll('SELECT * FROM family_den WHERE den_owner_id = ?', [req.user.id]);
    res.json({ members });
});

// ─── Cave Management ──────────────────────────────────────────────────────────
app.post('/api/caves/create', authMiddleware, (req, res) => {
    const { caveName, caveType, securityLevel } = req.body;
    if (!caveName) return res.status(400).json({ error: 'caveName required' });
    const id = dbInsert('INSERT INTO caves (cave_name, cave_type, owner_id, security_level) VALUES (?, ?, ?, ?)',
        [caveName, caveType || 'standard', req.user.id, securityLevel || 1]);
    saveDB();
    res.json({ success: true, id });
});

app.get('/api/caves', authMiddleware, (req, res) => {
    const caves = dbAll('SELECT * FROM caves WHERE owner_id = ?', [req.user.id]);
    res.json({ caves });
});

// ─── System Info ──────────────────────────────────────────────────────────────
app.get('/api/system/status', (req, res) => {
    const threatStats = dbGet('SELECT COUNT(*) as count, SUM(monetary_value) as value FROM threat_log');
    const ubiPool = dbGet('SELECT * FROM ubi_pool WHERE id = 1');
    const nodeCount = dbGet("SELECT COUNT(*) as count FROM nodes WHERE status = 'active'");
    res.json({
        status: 'OPERATIONAL',
        owner: OWNER_NAME,
        business: BUSINESS_NAME,
        version: '9.0',
        devices: phoenixSystem.owner.devices,
        threatStats: { count: threatStats ? threatStats.count : 0, value: threatStats ? threatStats.value || 0 : 0 },
        ubiPool,
        activeNodes: nodeCount ? nodeCount.count : 0,
        constitutionalValues: constitution.constitutionalValues.length,
        dysfunctionalRules: constitution.dysfunctionalRules.length,
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/api/system/constitution', (req, res) => res.json(constitution));
app.get('/api/system/threats-catalog', (req, res) => res.json(threats));
app.get('/api/system/industries', (req, res) => res.json({ industries: phoenixSystem.industries, wageLaws: phoenixSystem.wageLaws }));

// ─── Audit Log ────────────────────────────────────────────────────────────────
app.get('/api/audit', authMiddleware, (req, res) => {
    const logs = dbAll('SELECT * FROM audit_log WHERE user_id = ? ORDER BY timestamp DESC LIMIT 100', [req.user.id]);
    res.json({ logs });
});

// ─── WebSocket / Real-time Mesh ───────────────────────────────────────────────
io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('Authentication required'));
    try {
        socket.user = jwt.verify(token, JWT_SECRET);
        next();
    } catch {
        next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log(`[MESH] Node connected: ${socket.user.username}`);

    socket.on('node:heartbeat', (data) => {
        if (data && data.nodeId) {
            dbRun("UPDATE nodes SET last_seen = datetime('now'), status = 'active' WHERE node_id = ?", [data.nodeId]);
        }
        socket.emit('node:heartbeat:ack', { timestamp: Date.now() });
    });

    socket.on('message:send', (data) => {
        const { toNode, content } = data || {};
        const { detected } = detectThreats(content || '', socket.handshake.address);
        if (detected.some(t => t.severity === 'critical')) {
            socket.emit('message:blocked', { reason: 'Critical threat detected', threats: detected.map(t => t.name) });
            saveDB();
            return;
        }
        const id = dbInsert('INSERT INTO messages (from_node, to_node, content, encrypted) VALUES (?, ?, ?, ?)',
            [socket.user.username, toNode || 'broadcast', content, 0]);
        saveDB();
        io.emit('message:received', { id, from: socket.user.username, toNode, content, timestamp: new Date().toISOString() });
    });

    socket.on('threat:report', (data) => {
        const { threatText, sourceIp } = data || {};
        const result = detectThreats(threatText || '', sourceIp || socket.handshake.address);
        saveDB();
        socket.emit('threat:analysis', { detected: result.detected, elapsedNs: result.elapsedNs.toString() });
        if (result.detected.length > 0) {
            io.emit('threat:detected', { count: result.detected.length, threats: result.detected.map(t => ({ name: t.name, severity: t.severity })) });
        }
    });

    socket.on('disconnect', () => {
        console.log(`[MESH] Node disconnected: ${socket.user.username}`);
    });
});

// ─── UBI auto-accumulation ────────────────────────────────────────────────────
setInterval(() => {
    const increment = Math.random() * 10 + 1;
    dbRun("UPDATE ubi_pool SET total_pool = total_pool + ?, last_updated = datetime('now') WHERE id = 1", [increment]);
    saveDB();
    io.emit('ubi:update', { increment: increment.toFixed(4), timestamp: Date.now() });
}, 5000);

// ─── DB Schema Setup + Boot ───────────────────────────────────────────────────
async function boot() {
    const SQL = await initSqlJs();

    // Load existing DB or create new
    if (fs.existsSync(DB_PATH)) {
        const fileBuffer = fs.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    } else {
        db = new SQL.Database();
    }

    // Create tables
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            role TEXT DEFAULT 'user',
            created_at TEXT DEFAULT (datetime('now')),
            last_login TEXT
        );
        CREATE TABLE IF NOT EXISTS nodes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            node_id TEXT UNIQUE NOT NULL,
            ip_address TEXT NOT NULL,
            device_type TEXT,
            status TEXT DEFAULT 'active',
            owner_id INTEGER,
            registered_at TEXT DEFAULT (datetime('now')),
            last_seen TEXT
        );
        CREATE TABLE IF NOT EXISTS messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            from_node TEXT NOT NULL,
            to_node TEXT,
            content TEXT NOT NULL,
            encrypted INTEGER DEFAULT 0,
            timestamp TEXT DEFAULT (datetime('now')),
            delivered INTEGER DEFAULT 0
        );
        CREATE TABLE IF NOT EXISTS threat_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            threat_id TEXT NOT NULL,
            threat_type TEXT NOT NULL,
            threat_name TEXT NOT NULL,
            source_ip TEXT,
            severity TEXT,
            action_taken TEXT,
            monetary_value REAL DEFAULT 0,
            detected_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS ubi_pool (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_pool REAL DEFAULT 0,
            distributed REAL DEFAULT 0,
            last_updated TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS ubi_distributions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            recipient_id INTEGER,
            amount REAL NOT NULL,
            source TEXT,
            distributed_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            name TEXT NOT NULL,
            role TEXT,
            industry TEXT,
            country TEXT DEFAULT 'US',
            hourly_rate REAL NOT NULL,
            status TEXT DEFAULT 'active'
        );
        CREATE TABLE IF NOT EXISTS time_records (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER,
            clock_in TEXT NOT NULL,
            clock_out TEXT,
            hours_worked REAL,
            gross_pay REAL,
            tax_withheld REAL,
            net_pay REAL
        );
        CREATE TABLE IF NOT EXISTS family_den (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            member_name TEXT NOT NULL,
            relation TEXT NOT NULL,
            den_owner_id INTEGER,
            custody_status TEXT,
            child_support_amount REAL DEFAULT 0,
            notes TEXT,
            added_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS caves (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            cave_name TEXT NOT NULL,
            cave_type TEXT DEFAULT 'standard',
            owner_id INTEGER,
            security_level INTEGER DEFAULT 1,
            created_at TEXT DEFAULT (datetime('now'))
        );
        CREATE TABLE IF NOT EXISTS audit_log (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            action TEXT NOT NULL,
            details TEXT,
            ip_address TEXT,
            timestamp TEXT DEFAULT (datetime('now'))
        );
    `);

    // Seed UBI pool if empty
    const ubiRow = dbGet('SELECT COUNT(*) as cnt FROM ubi_pool');
    if (!ubiRow || ubiRow.cnt === 0) {
        dbRun('INSERT INTO ubi_pool (total_pool, distributed) VALUES (?, ?)', [100000, 0]);
        saveDB();
    }

    // Start server
    server.listen(PORT, () => {
        console.log(`\n🔮 Phoenix Wolf Systems V9`);
        console.log(`   Owner: ${OWNER_NAME} (100%) | Business: ${BUSINESS_NAME}`);
        console.log(`   Server: http://localhost:${PORT}`);
        console.log(`   WebSocket mesh: active`);
        console.log(`   Threat detection: ${threats.detectionEngine.precision}`);
        console.log(`   Constitutional values: ${constitution.constitutionalValues.length}`);
        console.log(`   Dysfunctional rules: ${constitution.dysfunctionalRules.length}\n`);
    });
}

boot().catch(err => {
    console.error('Boot failed:', err);
    process.exit(1);
});

module.exports = { app, server };
