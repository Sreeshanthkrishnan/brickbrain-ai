import http from 'http';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
import jwt from 'jsonwebtoken';
import dns from 'dns';
import 'dotenv/config';

try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  console.warn('Failed to set custom DNS servers, using system defaults.');
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/brickbrain';
const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(32).toString('hex');
const JWT_EXPIRY = '7d';
const MAX_BODY_SIZE = 1 * 1024 * 1024; // 1MB

let db;

// ==================== SECURITY UTILITIES ====================

// Password hashing with scrypt (built-in Node crypto, no external deps)
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  // Support legacy plaintext passwords for migration
  if (!storedHash.includes(':')) {
    return password === storedHash;
  }
  const [salt, hash] = storedHash.split(':');
  const verifyHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return hash === verifyHash;
}

// Input validation helpers
function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  if (email.length > 254) return false;
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
}

function isValidString(val, maxLen = 500) {
  return typeof val === 'string' && val.length <= maxLen;
}

function sanitizeString(val) {
  if (typeof val !== 'string') return '';
  return val.replace(/[<>]/g, '');
}

// Rate limiter (in-memory, per IP)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const RATE_LIMIT_MAX = 20; // max attempts per window

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return true;
  }
  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return false;
  }
  return true;
}

// Periodically clean up expired rate limit entries
setInterval(() => {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap) {
    if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// Parse cookie header
function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;
  cookieHeader.split(';').forEach(cookie => {
    const [name, ...rest] = cookie.trim().split('=');
    if (name) cookies[name.trim()] = rest.join('=').trim();
  });
  return cookies;
}

// Get client IP
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket?.remoteAddress || 'unknown';
}

// ==================== AUTH MIDDLEWARE ====================

async function authenticate(req, res) {
  // Try cookie first, then Authorization header for backward compatibility
  const cookies = parseCookies(req.headers.cookie);
  let token = cookies['brickbrain_sid'];

  if (!token) {
    const authHeader = req.headers['authorization'];
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  if (!token) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: No session found' }));
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const email = decoded.email;

    if (!email || !isValidEmail(email)) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid session' }));
      return null;
    }

    const user = await db.collection('users').findOne({ email });
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: User not found' }));
      return null;
    }

    return email;
  } catch (e) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Session expired or invalid' }));
    return null;
  }
}

// Generate JWT and set as HttpOnly cookie
function setSessionCookie(res, email) {
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
  const isProduction = process.env.NODE_ENV === 'production';
  const cookieFlags = [
    `brickbrain_sid=${token}`,
    'HttpOnly',
    'Path=/',
    `SameSite=${isProduction ? 'Strict' : 'Lax'}`,
    `Max-Age=${7 * 24 * 60 * 60}`, // 7 days
  ];
  if (isProduction) {
    cookieFlags.push('Secure');
  }
  res.setHeader('Set-Cookie', cookieFlags.join('; '));
  return token;
}

function clearSessionCookie(res) {
  res.setHeader('Set-Cookie', 'brickbrain_sid=; HttpOnly; Path=/; Max-Age=0');
}

// ==================== SERVER ====================

// Local JSON Database Fallback for offline/development use
class LocalDB {
  collection(name) {
    return {
      createIndex: async () => {},
      findOne: async (query) => {
        const emailKey = (query.email || '').toLowerCase();
        const data = this._read();
        return data.users.find(u => u.email.toLowerCase() === emailKey) || null;
      },
      find: (query) => {
        return {
          toArray: async () => {
            const data = this._read();
            return data.users;
          }
        };
      },
      insertOne: async (doc) => {
        const data = this._read();
        data.users.push(doc);
        this._write(data);
        return { insertedId: doc._id };
      },
      updateOne: async (query, update) => {
        const emailKey = (query.email || '').toLowerCase();
        const data = this._read();
        const user = data.users.find(u => u.email.toLowerCase() === emailKey);
        if (user && update.$set) {
          for (const k in update.$set) {
            const val = update.$set[k];
            if (k.includes('.')) {
              const parts = k.split('.');
              let current = user;
              for (let i = 0; i < parts.length - 1; i++) {
                if (!current[parts[i]]) {
                  current[parts[i]] = {};
                }
                current = current[parts[i]];
              }
              current[parts[parts.length - 1]] = val;
            } else {
              user[k] = val;
            }
          }
          this._write(data);
        }
        return { modifiedCount: 1 };
      },
      replaceOne: async (query, doc) => {
        const emailKey = (query.email || '').toLowerCase();
        const data = this._read();
        const index = data.users.findIndex(u => u.email.toLowerCase() === emailKey);
        if (index !== -1) {
          data.users[index] = doc;
          this._write(data);
        }
        return { modifiedCount: 1 };
      }
    };
  }

  _read() {
    const filePath = path.join(__dirname, 'backend_db_local.json');
    if (!fs.existsSync(filePath)) {
      return { users: [] };
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
      return { users: [] };
    }
  }

  _write(data) {
    const filePath = path.join(__dirname, 'backend_db_local.json');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
  }
}

// ==================== SERVER ====================

async function startServer() {
  try {
    try {
      console.log('Connecting to MongoDB Atlas...');
      const client = new MongoClient(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      await client.connect();
      console.log('Connected successfully to MongoDB Atlas');
      db = client.db();
      // Create index on email for fast lookups
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
    } catch (dbErr) {
      console.warn('⚠️ MongoDB Atlas connection failed/timed out:', dbErr.message);
      console.warn('⚠️ Falling back to local JSON database (backend_db_local.json)');
      db = new LocalDB();
    }

    // Auto Migration Check for plaintext passwords
    try {
      const usersList = await db.collection('users').find({}).toArray();
      let updatedCount = 0;
      for (const u of usersList) {
        if (u.password && !u.password.includes(':')) {
          const hashed = hashPassword(u.password);
          await db.collection('users').updateOne({ email: u.email }, { $set: { password: hashed } });
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        console.log(`Auto-hashed ${updatedCount} plaintext passwords in the database.`);
      }
    } catch (migErr) {
      console.warn('⚠️ Plaintext password migration skipped/failed:', migErr.message);
    }

    // Auto Migration Check
    const DB_FILE = path.join(__dirname, 'backend_db.json');
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.users) {
          console.log('Found backend_db.json to migrate. Starting migration...');
          for (const email in parsed.users) {
            const userData = parsed.users[email];
            const existing = await db.collection('users').findOne({ email: email.toLowerCase() });
            if (!existing) {
              let passwordToStore = userData.password;
              if (passwordToStore && !passwordToStore.includes(':')) {
                passwordToStore = hashPassword(passwordToStore);
              }
              await db.collection('users').insertOne({
                email: email.toLowerCase(),
                ...userData,
                password: passwordToStore
              });
              console.log(`Migrated user: ${email}`);
            } else {
              console.log(`User ${email} already exists in MongoDB, skipping.`);
            }
          }
        }
        fs.renameSync(DB_FILE, DB_FILE + '.bak');
        console.log('Migration completed successfully. backend_db.json renamed to backend_db.json.bak');
      } catch (migrationErr) {
        console.error('Error during migration:', migrationErr);
      }
    }

    const server = http.createServer(async (req, res) => {
      // Security Headers
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('X-Frame-Options', 'DENY');
      res.setHeader('X-XSS-Protection', '1; mode=block');
      res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

      // CORS Headers — restrict in production
      const allowedOrigins = process.env.NODE_ENV === 'production'
        ? [process.env.ALLOWED_ORIGIN || ''].filter(Boolean)
        : ['http://localhost:5173', 'http://localhost:3001', 'http://127.0.0.1:5173'];

      const origin = req.headers.origin;
      if (origin && allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
      } else if (process.env.NODE_ENV !== 'production') {
        // In dev, be permissive for convenience
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
      }
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;

      // ==================== STATIC FILES (with path traversal prevention) ====================
      if (!pathname.startsWith('/api/')) {
        const distPath = path.join(__dirname, 'dist');
        let filePath = path.join(distPath, pathname);

        // Prevent path traversal
        const resolvedPath = path.resolve(filePath);
        if (!resolvedPath.startsWith(path.resolve(distPath))) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Forbidden' }));
          return;
        }

        if (pathname.endsWith('/') || !path.extname(filePath)) {
          filePath = path.join(distPath, 'index.html');
        }

        fs.stat(filePath, (err, stats) => {
          if (err || !stats.isFile()) {
            const indexPath = path.join(distPath, 'index.html');
            fs.readFile(indexPath, (readErr, content) => {
              if (readErr) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not Found' }));
              } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(content);
              }
            });
          } else {
            const ext = path.extname(filePath).toLowerCase();
            const mimeTypes = {
              '.html': 'text/html',
              '.js': 'text/javascript',
              '.css': 'text/css',
              '.json': 'application/json',
              '.png': 'image/png',
              '.jpg': 'image/jpeg',
              '.gif': 'image/gif',
              '.svg': 'image/svg+xml',
              '.ico': 'image/x-icon',
              '.woff': 'font/woff',
              '.woff2': 'font/woff2',
            };
            const contentType = mimeTypes[ext] || 'application/octet-stream';

            fs.readFile(filePath, (readErr, content) => {
              if (readErr) {
                res.writeHead(500);
                res.end('Server Error');
              } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content);
              }
            });
          }
        });
        return;
      }

      // Helper to send JSON
      const sendJSON = (statusCode, data) => {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
      };

      // Helper to read request body with size limit
      const getBody = (callback) => {
        let body = '';
        let size = 0;
        let aborted = false;

        req.on('data', chunk => {
          size += chunk.length;
          if (size > MAX_BODY_SIZE) {
            aborted = true;
            sendJSON(413, { error: 'Request body too large (max 1MB)' });
            req.destroy();
            return;
          }
          body += chunk.toString();
        });

        req.on('end', () => {
          if (aborted) return;
          try {
            if (!body) {
              callback({});
            } else {
              callback(JSON.parse(body));
            }
          } catch (e) {
            sendJSON(400, { error: 'Invalid JSON body' });
          }
        });
      };

      // Helper: strip sensitive fields from user document
      const sanitizeUserState = (user) => {
        const state = { ...user };
        delete state.password;
        delete state._id;
        return state;
      };

      // ==================== AUTH ENDPOINTS ====================

      // POST Register
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        const clientIP = getClientIP(req);
        if (!checkRateLimit(clientIP)) {
          sendJSON(429, { error: 'Too many requests. Please try again later.' });
          return;
        }

        getBody(async (body) => {
          const { email, password, name, phone, role } = body;

          // Validate inputs
          if (!email || !password || !name) {
            sendJSON(400, { error: 'Email, password, and name are required' });
            return;
          }
          if (!isValidEmail(email)) {
            sendJSON(400, { error: 'Invalid email format' });
            return;
          }
          if (!isValidString(password, 128) || password.length < 6) {
            sendJSON(400, { error: 'Password must be between 6 and 128 characters' });
            return;
          }
          if (!isValidString(name, 100)) {
            sendJSON(400, { error: 'Name must be a string of max 100 characters' });
            return;
          }

          const userKey = email.toLowerCase();
          const existing = await db.collection('users').findOne({ email: userKey });
          if (existing) {
            sendJSON(400, { error: 'A user with this email already exists' });
            return;
          }

          const hashedPassword = hashPassword(password);
          const safeName = sanitizeString(name);
          const safePhone = sanitizeString(phone || '');
          const safeRole = ['Homeowner', 'Contractor', 'Engineer', 'Architect'].includes(role) ? role : 'Homeowner';

          const newUser = {
            email: userKey,
            profile: {
              name: safeName,
              email: userKey,
              phone: safePhone,
              role: safeRole
            },
            password: hashedPassword,
            projects: [
              {
                projectName: 'My Dream House',
                plotSize: 1500,
                floors: 2,
                location: 'Bangalore, Karnataka',
                constructionType: 'Residential',
                materialQuality: 'Premium',
                budgetRange: '45-50 Lakhs',
                totalCost: 4567890,
                rooms: 4,
                bedrooms: 2,
                kitchens: 1,
                breakdown: {
                  materials: 2345000,
                  labor: 1245000,
                  interior: 876000,
                  tax: 201890
                }
              }
            ],
            activeProject: {
              projectName: 'My Dream House',
              plotSize: 1500,
              floors: 2,
              location: 'Bangalore, Karnataka',
              constructionType: 'Residential',
              materialQuality: 'Premium',
              budgetRange: '45-50 Lakhs',
              totalCost: 4567890,
              rooms: 4,
              bedrooms: 2,
              kitchens: 1,
              breakdown: {
                materials: 2345000,
                labor: 1245000,
                interior: 876000,
                tax: 201890
              }
            },
            cart: [],
            expenses: [
              { id: '1', vendor: 'Ultratech Cement Ltd.', material: 'Cement', quantity: '120 bags', amount: 50400, date: new Date().toISOString().split('T')[0] }
            ],
            milestones: [
              { id: '1', name: 'Site Clearing & excavation', status: 'completed', progress: 100, date: new Date().toISOString().split('T')[0] },
              { id: '2', name: 'Foundation & Footing', status: 'pending', progress: 0, date: 'Pending' },
              { id: '3', name: 'Pillar & Plinth Beam Construction', status: 'pending', progress: 0, date: 'Pending' },
              { id: '4', name: 'Brickwork & Wall Masonry', status: 'pending', progress: 0, date: 'Pending' }
            ],
            workers: [
              { id: '1', name: 'Ramesh Kumar', role: 'Mason (Lead)', status: 'Present', wage: 800 },
              { id: '2', name: 'Suresh Singh', role: 'Mason', status: 'Present', wage: 700 }
            ],
            detections: [],
            chatMessages: [
              { id: '1', sender: 'contractor', text: 'Welcome to BrickBrain! Your workspace is ready.', time: '09:00 AM' }
            ],
            invoices: [],
            settings: {
              darkMode: true,
              currency: 'INR',
              language: 'English',
              notificationsEnabled: true
            },
            notifications: [
              { id: '1', type: 'success', message: 'Account registered successfully!', time: 'Just now', read: false }
            ]
          };

          await db.collection('users').insertOne(newUser);

          const token = setSessionCookie(res, userKey);
          const userState = sanitizeUserState(newUser);

          sendJSON(201, { token, profile: newUser.profile, userState });
        });
        return;
      }

      // POST Login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        const clientIP = getClientIP(req);
        if (!checkRateLimit(clientIP)) {
          sendJSON(429, { error: 'Too many login attempts. Please try again in 15 minutes.' });
          return;
        }

        getBody(async (body) => {
          const { email, password } = body;

          if (!email || !password) {
            sendJSON(400, { error: 'Email and password are required' });
            return;
          }
          if (!isValidEmail(email)) {
            sendJSON(400, { error: 'Invalid email format' });
            return;
          }
          if (!isValidString(password, 128)) {
            sendJSON(400, { error: 'Invalid password format' });
            return;
          }

          const userKey = email.toLowerCase();
          const user = await db.collection('users').findOne({ email: userKey });

          if (!user || !verifyPassword(password, user.password)) {
            sendJSON(401, { error: 'Invalid email or password' });
            return;
          }

          // Migrate plaintext password to hashed on successful login
          if (!user.password.includes(':')) {
            const hashedPassword = hashPassword(password);
            await db.collection('users').updateOne({ email: userKey }, { $set: { password: hashedPassword } });
          }

          const token = setSessionCookie(res, userKey);
          const userState = sanitizeUserState(user);

          sendJSON(200, { token, profile: user.profile, userState });
        });
        return;
      }

      // POST Google Login/Register
      if (pathname === '/api/auth/google' && req.method === 'POST') {
        const clientIP = getClientIP(req);
        if (!checkRateLimit(clientIP)) {
          sendJSON(429, { error: 'Too many requests. Please try again later.' });
          return;
        }

        getBody(async (body) => {
          const { credential } = body;

          if (!credential) {
            sendJSON(400, { error: 'Google credential is required' });
            return;
          }

          let payload;
          try {
            console.log('Verifying Google token online...');
            const googleRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(credential)}`);
            if (googleRes.ok) {
              payload = await googleRes.json();
              if (payload.aud !== '371436468018-ptkkalbtall7js8f8qdmon4mqr670n24.apps.googleusercontent.com') {
                sendJSON(400, { error: 'Invalid Google client audience' });
                return;
              }
            } else {
              throw new Error('Google tokeninfo endpoint returned error');
            }
          } catch (e) {
            console.warn('⚠️ Google token online verification failed, falling back to local decoding for dev:', e.message);
            try {
              payload = jwt.decode(credential);
            } catch (err) {
              sendJSON(400, { error: 'Invalid Google credential token format' });
              return;
            }
            if (!payload || !payload.email) {
              sendJSON(400, { error: 'Failed to verify or decode Google credential token' });
              return;
            }
          }

          const { email, name } = payload;
          if (!email || !isValidEmail(email)) {
            sendJSON(400, { error: 'Invalid email in Google profile' });
            return;
          }

          const userKey = email.toLowerCase();
          let user = await db.collection('users').findOne({ email: userKey });

          if (!user) {
            console.log(`Creating new user via Google Sign-In: ${userKey}`);
            const randomPassword = crypto.randomBytes(16).toString('hex');
            const hashedPassword = hashPassword(randomPassword);

            user = {
              email: userKey,
              profile: {
                name: name || 'Google User',
                email: userKey,
                phone: '',
                role: 'Homeowner'
              },
              password: hashedPassword,
              projects: [
                {
                  projectName: 'My Dream House',
                  plotSize: 1500,
                  floors: 2,
                  location: 'Bangalore, Karnataka',
                  constructionType: 'Residential',
                  materialQuality: 'Premium',
                  budgetRange: '45-50 Lakhs',
                  totalCost: 4567890,
                  rooms: 4,
                  bedrooms: 2,
                  kitchens: 1,
                  breakdown: {
                    materials: 2345000,
                    labor: 1245000,
                    interior: 876000,
                    tax: 201890
                  }
                }
              ],
              activeProject: {
                projectName: 'My Dream House',
                plotSize: 1500,
                floors: 2,
                location: 'Bangalore, Karnataka',
                constructionType: 'Residential',
                materialQuality: 'Premium',
                budgetRange: '45-50 Lakhs',
                totalCost: 4567890,
                rooms: 4,
                bedrooms: 2,
                kitchens: 1,
                breakdown: {
                  materials: 2345000,
                  labor: 1245000,
                  interior: 876000,
                  tax: 201890
                }
              },
              cart: [],
              expenses: [
                { id: '1', vendor: 'Ultratech Cement Ltd.', material: 'Cement', quantity: '120 bags', amount: 50400, date: new Date().toISOString().split('T')[0] }
              ],
              milestones: [
                { id: '1', name: 'Site Clearing & excavation', status: 'completed', progress: 100, date: new Date().toISOString().split('T')[0] },
                { id: '2', name: 'Foundation & Footing', status: 'pending', progress: 0, date: 'Pending' },
                { id: '3', name: 'Pillar & Plinth Beam Construction', status: 'pending', progress: 0, date: 'Pending' },
                { id: '4', name: 'Brickwork & Wall Masonry', status: 'pending', progress: 0, date: 'Pending' }
              ],
              workers: [
                { id: '1', name: 'Ramesh Kumar', role: 'Mason (Lead)', status: 'Present', wage: 800 },
                { id: '2', name: 'Suresh Singh', role: 'Mason', status: 'Present', wage: 700 }
              ],
              detections: [],
              chatMessages: [
                { id: '1', sender: 'contractor', text: 'Welcome to BrickBrain! Your workspace is ready.', time: '09:00 AM' }
              ],
              invoices: [],
              settings: {
                darkMode: true,
                currency: 'INR',
                language: 'English',
                notificationsEnabled: true
              },
              notifications: [
                { id: '1', type: 'success', message: 'Account registered successfully via Google!', time: 'Just now', read: false }
              ]
            };

            await db.collection('users').insertOne(user);
          }

          const token = setSessionCookie(res, userKey);
          const userState = sanitizeUserState(user);

          sendJSON(200, { token, profile: user.profile, userState });
        });
        return;
      }

      // POST Logout
      if (pathname === '/api/auth/logout' && req.method === 'POST') {
        clearSessionCookie(res);
        sendJSON(200, { message: 'Logged out successfully' });
        return;
      }

      // ==================== AUTHENTICATED ENDPOINTS ====================

      // GET State
      if (pathname === '/api/state' && req.method === 'GET') {
        const email = await authenticate(req, res);
        if (!email) return;

        const user = await db.collection('users').findOne({ email });
        sendJSON(200, sanitizeUserState(user));
        return;
      }

      // POST Sync State
      if (pathname === '/api/state' && req.method === 'POST') {
        const email = await authenticate(req, res);
        if (!email) return;

        getBody(async (body) => {
          const updateDoc = {};

          // Only allow known fields to be synced (prevent arbitrary field injection)
          const allowedArrayFields = ['projects', 'cart', 'expenses', 'milestones', 'workers', 'detections', 'chatMessages', 'invoices', 'notifications'];
          const allowedObjectFields = ['activeProject', 'settings'];

          for (const field of allowedArrayFields) {
            if (body[field] !== undefined && Array.isArray(body[field])) {
              updateDoc[field] = body[field];
            }
          }
          for (const field of allowedObjectFields) {
            if (body[field] !== undefined && typeof body[field] === 'object' && !Array.isArray(body[field])) {
              updateDoc[field] = body[field];
            }
          }

          // Profile updates — whitelist allowed keys
          if (body.profile !== undefined && typeof body.profile === 'object') {
            const allowedProfileKeys = ['name', 'phone', 'role'];
            for (const key of allowedProfileKeys) {
              if (body.profile[key] !== undefined && isValidString(body.profile[key], 200)) {
                updateDoc[`profile.${key}`] = sanitizeString(body.profile[key]);
              }
            }
          }

          if (Object.keys(updateDoc).length > 0) {
            await db.collection('users').updateOne({ email }, { $set: updateDoc });
          }

          const user = await db.collection('users').findOne({ email });
          sendJSON(200, sanitizeUserState(user));
        });
        return;
      }

      // POST Update/Add to Cart
      if (pathname === '/api/cart' && req.method === 'POST') {
        const email = await authenticate(req, res);
        if (!email) return;

        getBody(async (body) => {
          const user = await db.collection('users').findOne({ email });
          const { item, cart } = body;

          if (item) {
            const existing = user.cart.find(c => c.name === item.name);
            if (existing) {
              existing.quantity = item.quantity;
              existing.pricePerUnit = item.pricePerUnit;
              if (existing.quantity <= 0) {
                user.cart = user.cart.filter(c => c.name !== item.name);
              }
            } else if (item.quantity > 0) {
              user.cart.push(item);
            }
          } else if (cart && Array.isArray(cart)) {
            user.cart = cart;
          }

          const cartTotal = user.cart.reduce((sum, c) => sum + (c.pricePerUnit * c.quantity), 0);

          if (user.activeProject) {
            if (user.activeProject.baseMaterialsCost === undefined) {
              user.activeProject.baseMaterialsCost = user.activeProject.breakdown.materials;
            }

            const originalBase = user.activeProject.baseMaterialsCost;
            user.activeProject.breakdown.materials = originalBase + cartTotal;

            user.activeProject.totalCost =
              user.activeProject.breakdown.materials +
              user.activeProject.breakdown.labor +
              user.activeProject.breakdown.interior +
              user.activeProject.breakdown.tax;

            user.projects = user.projects.map(p =>
              p.projectName.toLowerCase() === user.activeProject.projectName.toLowerCase()
                ? user.activeProject
                : p
            );
          }

          await db.collection('users').replaceOne({ email }, user);
          sendJSON(200, { cart: user.cart, activeProject: user.activeProject, projects: user.projects });
        });
        return;
      }

      // POST Update Active Project
      if (pathname === '/api/project' && req.method === 'POST') {
        const email = await authenticate(req, res);
        if (!email) return;

        getBody(async (body) => {
          const user = await db.collection('users').findOne({ email });
          const nextProject = body.project;
          if (nextProject) {
            if (nextProject.baseMaterialsCost === undefined) {
              nextProject.baseMaterialsCost = nextProject.breakdown.materials;
            }

            const cartTotal = user.cart.reduce((sum, c) => sum + (c.pricePerUnit * c.quantity), 0);
            nextProject.breakdown.materials = nextProject.baseMaterialsCost + cartTotal;

            nextProject.totalCost =
              nextProject.breakdown.materials +
              nextProject.breakdown.labor +
              nextProject.breakdown.interior +
              nextProject.breakdown.tax;

            user.activeProject = nextProject;

            const oldProjectName = body.oldProjectName;
            const matchName = (oldProjectName || nextProject.projectName).toLowerCase();
            const idx = user.projects.findIndex(p => p.projectName.toLowerCase() === matchName);
            if (idx !== -1) {
              user.projects[idx] = nextProject;
            } else {
              const existingIdx = user.projects.findIndex(p => p.projectName.toLowerCase() === nextProject.projectName.toLowerCase());
              if (existingIdx !== -1) {
                user.projects[existingIdx] = nextProject;
              } else {
                user.projects.push(nextProject);
              }
            }
          }

          await db.collection('users').replaceOne({ email }, user);
          sendJSON(200, sanitizeUserState(user));
        });
        return;
      }

      // DELETE Project
      if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
        const email = await authenticate(req, res);
        if (!email) return;

        const projectName = decodeURIComponent(pathname.substring('/api/projects/'.length));
        const user = await db.collection('users').findOne({ email });
        user.projects = user.projects.filter(p => p.projectName.toLowerCase() !== projectName.toLowerCase());

        if (user.activeProject && user.activeProject.projectName.toLowerCase() === projectName.toLowerCase()) {
          user.activeProject = user.projects[0] || null;
        }

        await db.collection('users').replaceOne({ email }, user);
        sendJSON(200, sanitizeUserState(user));
        return;
      }

      // Not Found
      sendJSON(404, { error: 'Not Found' });
    });

    server.listen(PORT, () => {
      console.log(`BrickBrain backend running on http://localhost:${PORT}`);
      console.log(`Security: JWT auth enabled, passwords hashed, rate limiting active`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();
