import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';
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

let db;

// Helper to authenticate request
async function authenticate(req, res) {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Missing or invalid token' }));
    return null;
  }

  const token = authHeader.substring(7); // Remove 'Bearer '
  try {
    const email = Buffer.from(token, 'base64').toString('utf8');
    if (!email || !email.includes('@')) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: Invalid token format' }));
      return null;
    }
    
    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Unauthorized: User session invalid' }));
      return null;
    }

    return email.toLowerCase();
  } catch (e) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Unauthorized: Token decoding failed' }));
    return null;
  }
}

async function startServer() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected successfully to MongoDB');
    db = client.db();

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
              await db.collection('users').insertOne({
                email: email.toLowerCase(),
                ...userData
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

    // Create Server
    const server = http.createServer(async (req, res) => {
      // CORS Headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
      }

      const url = new URL(req.url, `http://${req.headers.host}`);
      const pathname = url.pathname;

      // Serve static files from 'dist' directory if pathname is not an API call
      if (!pathname.startsWith('/api/')) {
        const distPath = path.join(__dirname, 'dist');
        let filePath = path.join(distPath, pathname);
        
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

      // Helper to read request body
      const getBody = (callback) => {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
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

      // ==================== AUTH ENDPOINTS ====================

      // POST Register
      if (pathname === '/api/auth/register' && req.method === 'POST') {
        getBody(async (body) => {
          const { email, password, name, phone, role } = body;
          if (!email || !password || !name) {
            sendJSON(400, { error: 'Email, password, and name are required' });
            return;
          }

          const userKey = email.toLowerCase();
          const existing = await db.collection('users').findOne({ email: userKey });
          if (existing) {
            sendJSON(400, { error: 'A user with this email already exists' });
            return;
          }

          const newUser = {
            email: userKey,
            profile: {
              name,
              email: userKey,
              phone: phone || '',
              role: role || 'Homeowner'
            },
            password: password,
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

          const token = Buffer.from(userKey).toString('base64');
          const userState = { ...newUser };
          delete userState.password;
          delete userState._id;

          sendJSON(201, { token, profile: newUser.profile, userState });
        });
        return;
      }

      // POST Login
      if (pathname === '/api/auth/login' && req.method === 'POST') {
        getBody(async (body) => {
          const { email, password } = body;
          if (!email || !password) {
            sendJSON(400, { error: 'Email and password are required' });
            return;
          }

          const userKey = email.toLowerCase();
          const user = await db.collection('users').findOne({ email: userKey });

          if (!user || user.password !== password) {
            sendJSON(401, { error: 'Invalid email or password' });
            return;
          }

          const token = Buffer.from(userKey).toString('base64');
          const userState = { ...user };
          delete userState.password;
          delete userState._id;

          sendJSON(200, { token, profile: user.profile, userState });
        });
        return;
      }

      // ==================== AUTHENTICATED ENDPOINTS ====================

      // GET State
      if (pathname === '/api/state' && req.method === 'GET') {
        const email = await authenticate(req, res);
        if (!email) return;

        const user = await db.collection('users').findOne({ email });
        const userState = { ...user };
        delete userState.password;
        delete userState._id;
        sendJSON(200, userState);
        return;
      }

      // POST Sync State
      if (pathname === '/api/state' && req.method === 'POST') {
        const email = await authenticate(req, res);
        if (!email) return;

        getBody(async (body) => {
          const updateDoc = {};
          
          if (body.projects !== undefined) updateDoc['projects'] = body.projects;
          if (body.activeProject !== undefined) updateDoc['activeProject'] = body.activeProject;
          if (body.cart !== undefined) updateDoc['cart'] = body.cart;
          if (body.expenses !== undefined) updateDoc['expenses'] = body.expenses;
          if (body.milestones !== undefined) updateDoc['milestones'] = body.milestones;
          if (body.workers !== undefined) updateDoc['workers'] = body.workers;
          if (body.detections !== undefined) updateDoc['detections'] = body.detections;
          if (body.chatMessages !== undefined) updateDoc['chatMessages'] = body.chatMessages;
          if (body.invoices !== undefined) updateDoc['invoices'] = body.invoices;
          if (body.settings !== undefined) updateDoc['settings'] = body.settings;
          if (body.notifications !== undefined) updateDoc['notifications'] = body.notifications;
          if (body.profile !== undefined) {
            for (const key in body.profile) {
              updateDoc[`profile.${key}`] = body.profile[key];
            }
          }

          await db.collection('users').updateOne({ email }, { $set: updateDoc });

          const user = await db.collection('users').findOne({ email });
          const userState = { ...user };
          delete userState.password;
          delete userState._id;
          sendJSON(200, userState);
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
          } else if (cart) {
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

            const idx = user.projects.findIndex(p => p.projectName.toLowerCase() === nextProject.projectName.toLowerCase());
            if (idx !== -1) {
              user.projects[idx] = nextProject;
            } else {
              user.projects.push(nextProject);
            }
          }
          
          await db.collection('users').replaceOne({ email }, user);
          
          const userState = { ...user };
          delete userState.password;
          delete userState._id;
          sendJSON(200, userState);
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
        
        const userState = { ...user };
        delete userState.password;
        delete userState._id;
        sendJSON(200, userState);
        return;
      }

      // Not Found
      sendJSON(404, { error: 'Not Found' });
    });

    server.listen(PORT, () => {
      console.log(`BrickBrain backend running on http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

startServer();


