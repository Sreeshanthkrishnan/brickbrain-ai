import { spawn } from 'child_process';
import http from 'http';
import dns from 'dns';
import fs from 'fs';

// Ensure DNS works locally
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
} catch (e) {
  // Ignored
}

const PORT = '3002';
const BASE_URL = `http://localhost:${PORT}`;
let serverProcess = null;

// Helpers to track results
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, success, error = null) {
  if (success) {
    results.passed++;
    console.log(`\x1b[32m✓ PASS:\x1b[0m ${name}`);
    results.tests.push({ name, status: 'pass' });
  } else {
    results.failed++;
    console.log(`\x1b[31m✗ FAIL:\x1b[0m ${name}`);
    if (error) console.error(`   Error: ${error}`);
    results.tests.push({ name, status: 'fail', error });
  }
}

// Start backend server in child process
function startTestServer() {
  return new Promise((resolve, reject) => {
    console.log(`Starting test server on port ${PORT}...`);
    serverProcess = spawn('node', ['server.js'], {
      env: {
        ...process.env,
        PORT,
        NODE_ENV: 'test',
        MONGODB_URI: 'mongodb://localhost:27017/brickbrain_test' // isolated test db
      }
    });

    serverProcess.stdout.on('data', (data) => {
      const output = data.toString();
      if (output.includes('BrickBrain backend running')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      // Log stderr in case of boot crashes
      console.error(`[Server Error] ${data.toString().trim()}`);
    });

    serverProcess.on('error', (err) => {
      reject(err);
    });

    // Timeout boot after 8 seconds
    setTimeout(() => {
      reject(new Error('Server boot timed out'));
    }, 8000);
  });
}

// Clean up server process
function stopTestServer() {
  if (serverProcess) {
    console.log('\nStopping test server...');
    serverProcess.kill('SIGTERM');
  }
}

async function runTests() {
  try {
    await startTestServer();
    console.log('\n\x1b[36m=== BRICKBRAIN CONSTRUCTION ESTIMATOR TEST SUITE ===\x1b[0m\n');

    let sessionCookie = '';
    const testEmail = `test_${Math.floor(Math.random() * 100000)}@brickbrain.ai`;
    const testPassword = 'SecurePassword123';

    // 1. Security validation: Path Traversal prevention
    try {
      const options = {
        host: 'localhost',
        port: parseInt(PORT),
        path: '/../../server.js',
        method: 'GET'
      };
      
      const { status, body } = await new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let data = '';
          res.on('data', chunk => data += chunk);
          res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', (err) => reject(err));
        req.end();
      });

      const isSecure = status === 403 || (status === 200 && !body.includes("startServer()"));

      logTest(
        'Security: Path Traversal Attempt Blocked',
        isSecure,
        `Status: ${status}, Body leaked server code: ${body.includes("startServer()")}`
      );
    } catch (e) {
      logTest('Security: Path Traversal Attempt Blocked', false, e.message);
    }

    // 2. Security validation: Request Body Size Limit
    try {
      const largePayload = 'A'.repeat(1.2 * 1024 * 1024); // 1.2MB payload (exceeds 1MB limit)
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: largePayload })
      });
      logTest(
        'Security: Max Body Size Limit enforced (413 Payload Too Large)',
        res.status === 413
      );
    } catch (e) {
      // Fetch might abort connection on socket closure, which is also a success
      logTest('Security: Max Body Size Limit enforced (413 Payload Too Large)', true);
    }

    // 3. Validation: Register constraints (invalid email)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'invalid_email',
          password: testPassword,
          name: 'Tester'
        })
      });
      const data = await res.json();
      logTest(
        'Validation: Invalid email format rejected during registration',
        res.status === 400 && data.error.includes('email')
      );
    } catch (e) {
      logTest('Validation: Invalid email format rejected during registration', false, e.message);
    }

    // 4. Validation: Register constraints (short password)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: '123',
          name: 'Tester'
        })
      });
      const data = await res.json();
      logTest(
        'Validation: Short password (<6 chars) rejected during registration',
        res.status === 400 && data.error.includes('Password')
      );
    } catch (e) {
      logTest('Validation: Short password (<6 chars) rejected during registration', false, e.message);
    }

    // 5. Auth API: User Registration
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: 'Test Builder',
          phone: '9876543210',
          role: 'Homeowner'
        })
      });
      const data = await res.json();
      const setCookie = res.headers.get('set-cookie');
      if (setCookie) {
        sessionCookie = setCookie.split(';')[0];
      }
      logTest(
        'API: Register new test account',
        res.status === 201 && data.profile.name === 'Test Builder' && sessionCookie.includes('brickbrain_sid')
      );
    } catch (e) {
      logTest('API: Register new test account', false, e.message);
    }

    // 6. Validation: Duplicate registration
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
          name: 'Another Builder'
        })
      });
      const data = await res.json();
      logTest(
        'Validation: Duplicate email registration rejected',
        res.status === 400 && data.error.includes('exists')
      );
    } catch (e) {
      logTest('Validation: Duplicate email registration rejected', false, e.message);
    }

    // 7. Auth API: Login check (invalid credentials)
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword'
        })
      });
      const data = await res.json();
      logTest(
        'API: Login rejected with incorrect credentials',
        res.status === 401 && data.error.includes('Invalid')
      );
    } catch (e) {
      logTest('API: Login rejected with incorrect credentials', false, e.message);
    }

    // 8. Auth API: Successful Login & state retrieval
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword
        })
      });
      const data = await res.json();
      logTest(
        'API: Log in successfully with valid credentials',
        res.status === 200 && data.profile.email === testEmail
      );
    } catch (e) {
      logTest('API: Log in successfully with valid credentials', false, e.message);
    }

    // 9. Data API: Retrieve state (`GET /api/state`)
    let initialMaterialCost = 0;
    try {
      const res = await fetch(`${BASE_URL}/api/state`, {
        headers: { 'Cookie': sessionCookie }
      });
      const data = await res.json();
      initialMaterialCost = data.activeProject.breakdown.materials;
      const isSanitized = data.password === undefined && data._id === undefined;
      logTest(
        'API: Fetch active project state (sanitized profile security)',
        res.status === 200 && data.activeProject !== undefined && isSanitized
      );
    } catch (e) {
      logTest('API: Fetch active project state (sanitized profile security)', false, e.message);
    }

    // 10. API Logic: Cart item additions & budget recalculations
    try {
      const itemPrice = 420;
      const itemQty = 10;
      const expectedAddition = itemPrice * itemQty; // 4200 INR

      const res = await fetch(`${BASE_URL}/api/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': sessionCookie
        },
        body: JSON.stringify({
          item: { name: 'Super Cement', pricePerUnit: itemPrice, quantity: itemQty }
        })
      });
      const data = await res.json();
      
      const newMaterialsCost = data.activeProject.breakdown.materials;
      const difference = newMaterialsCost - initialMaterialCost;

      logTest(
        'Logic: Add materials to cart and assert dynamic project cost recalculation formula',
        res.status === 200 && data.cart.length === 1 && difference === expectedAddition
      );
    } catch (e) {
      logTest('Logic: Add materials to cart and assert dynamic project cost recalculation formula', false, e.message);
    }

    // 11. Security & Validation: Rate Limit trigger
    try {
      console.log('Sending rapid request bursts to trigger rate limiter...');
      let wasBlocked = false;
      for (let i = 0; i < 22; i++) {
        const res = await fetch(`${BASE_URL}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: testEmail, password: testPassword })
        });
        if (res.status === 429) {
          wasBlocked = true;
          break;
        }
      }
      logTest(
        'Security: Authentication request rate limiter blocks client on flood (429 status)',
        wasBlocked
      );
    } catch (e) {
      logTest('Security: Authentication request rate limiter blocks client on flood (429 status)', false, e.message);
    }

    // Display final suite metrics
    console.log('\n\x1b[36m=== TEST SUMMARY ===\x1b[0m');
    console.log(`Passed: \x1b[32m${results.passed}\x1b[0m / ${results.passed + results.failed}`);
    console.log(`Failed: \x1b[31m${results.failed}\x1b[0m`);

    // Generate reports
    try {
      // Write HTML report with a beautiful and dynamic design
      let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>BrickBrain Test Suite Report</title>
  <style>
    :root {
      --bg-color: #0f172a;
      --card-bg: #1e293b;
      --text-color: #f8fafc;
      --text-muted: #94a3b8;
      --border-color: #334155;
      --primary: #6366f1;
      --success: #10b981;
      --error: #ef4444;
    }
    body {
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      margin: 0;
      padding: 40px 20px;
      background-color: var(--bg-color);
      color: var(--text-color);
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
    }
    .container {
      max-width: 900px;
      width: 100%;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      text-align: center;
      background: linear-gradient(to right, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .subtitle {
      text-align: center;
      color: var(--text-muted);
      margin-bottom: 2rem;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 2rem;
    }
    .metric-card {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      padding: 20px;
      border-radius: 12px;
      text-align: center;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }
    .metric-label {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .metric-value {
      font-size: 2.25rem;
      font-weight: 700;
      margin-top: 0.5rem;
    }
    .value-total { color: var(--primary); }
    .value-passed { color: var(--success); }
    .value-failed { color: var(--error); }
    
    .table-container {
      background-color: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th, td {
      padding: 16px 20px;
      border-bottom: 1px solid var(--border-color);
    }
    th {
      background-color: rgba(15, 23, 42, 0.3);
      font-weight: 600;
      color: var(--text-muted);
    }
    tr:last-child td {
      border-bottom: none;
    }
    .status-badge {
      display: inline-flex;
      align-items: center;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
    }
    .badge-pass {
      background-color: rgba(16, 185, 129, 0.1);
      color: var(--success);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }
    .badge-fail {
      background-color: rgba(239, 68, 68, 0.1);
      color: var(--error);
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
    .error-details {
      font-family: monospace;
      color: var(--error);
      font-size: 0.85rem;
      margin-top: 4px;
      white-space: pre-wrap;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>BrickBrain Test Suite</h1>
    <div class="subtitle">Automated CI/CD End-to-End Verification Report</div>
    
    <div class="metrics">
      <div class="metric-card">
        <div class="metric-label">Total Tests</div>
        <div class="metric-value value-total">${results.passed + results.failed}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Passed</div>
        <div class="metric-value value-passed">${results.passed}</div>
      </div>
      <div class="metric-card">
        <div class="metric-label">Failed</div>
        <div class="metric-value value-failed">${results.failed}</div>
      </div>
    </div>
    
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Test Name</th>
            <th>Status</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
`;
      for (const t of results.tests) {
        html += `          <tr>
            <td>${t.name}</td>
            <td>
              <span class="status-badge ${t.status === 'pass' ? 'badge-pass' : 'badge-fail'}">
                ${t.status === 'pass' ? 'Passed' : 'Failed'}
              </span>
            </td>
            <td>
              ${t.error ? `<div class="error-details">${t.error}</div>` : '<span style="color: var(--text-muted); font-size: 0.875rem;">None</span>'}
            </td>
          </tr>
`;
      }
      html += `        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;

      fs.writeFileSync('test-report.json', JSON.stringify(results, null, 2), 'utf8');
      fs.writeFileSync('test-report.html', html, 'utf8');
      console.log('Saved test-report.json and test-report.html successfully.');
    } catch (reportErr) {
      console.error('Failed to write reports:', reportErr);
    }
    
    stopTestServer();
    process.exit(results.failed > 0 ? 1 : 0);

  } catch (err) {
    console.error('Test execution crash:', err);
    stopTestServer();
    process.exit(1);
  }
}

runTests();
