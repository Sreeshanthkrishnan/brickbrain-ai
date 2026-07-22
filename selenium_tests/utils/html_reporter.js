import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlDir = path.join(__dirname, '../reports/html');
const htmlFile = path.join(htmlDir, 'execution-report.html');

export function writeHtmlReport(results) {
  if (!fs.existsSync(htmlDir)) {
    fs.mkdirSync(htmlDir, { recursive: true });
  }

  const total = results.length;
  const passed = results.filter(r => r.status.toLowerCase() === 'passed').length;
  const failed = total - passed;
  const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
  const totalDuration = (results.reduce((sum, r) => sum + r.duration, 0) / 1000).toFixed(2);

  let rowsHtml = '';
  results.forEach((r, index) => {
    const isPassed = r.status.toLowerCase() === 'passed';
    const statusClass = isPassed
      ? 'bg-green-500/20 text-green-400 border-green-500/30'
      : 'bg-red-500/20 text-red-400 border-red-500/30';
    
    // Screenshot link is relative to HTML file location (reports/html/ to reports/screenshots/)
    const screenshotCell = (!isPassed && r.screenshot)
      ? `<a href="../screenshots/${path.basename(r.screenshot)}" target="_blank" class="text-[#FF6B00] hover:underline font-semibold flex items-center gap-1">📸 View Screen</a>`
      : `<span class="text-white/30">-</span>`;

    rowsHtml += `
      <tr class="border-b border-white/5 hover:bg-white/5 transition-colors">
        <td class="px-6 py-4 text-sm font-mono text-white/50">TC_${(index + 1).toString().padStart(3, '0')}</td>
        <td class="px-6 py-4 text-sm font-semibold text-white/80">${r.module || 'General'}</td>
        <td class="px-6 py-4 text-sm text-white">${r.name}</td>
        <td class="px-6 py-4">
          <span class="px-3 py-1 rounded-full text-xs font-bold border ${statusClass}">
            ${r.status.toUpperCase()}
          </span>
        </td>
        <td class="px-6 py-4 text-sm text-white/60 font-mono">${(r.duration / 1000).toFixed(2)}s</td>
        <td class="px-6 py-4 text-sm text-red-400 font-mono max-w-xs truncate" title="${r.error || ''}">${r.error || 'N/A'}</td>
        <td class="px-6 py-4 text-sm">${screenshotCell}</td>
      </tr>
    `;
  });

  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BrickBrain AI - E2E Selenium Test Report</title>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Outfit', 'sans-serif'],
            mono: ['JetBrains Mono', 'monospace'],
          }
        }
      }
    }
  </script>
  <style>
    body {
      background-color: #0B1F3A;
      background-image: 
        radial-gradient(at 0% 0%, rgba(255, 107, 0, 0.1) 0, transparent 50%), 
        radial-gradient(at 100% 100%, rgba(26, 53, 86, 0.4) 0, transparent 50%);
    }
    .glass {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.08);
    }
  </style>
</head>
<body class="min-h-screen text-white font-sans p-6 lg:p-12">
  <div class="max-w-7xl mx-auto space-y-8">
    
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div>
        <h1 class="text-4xl font-bold tracking-tight">
          Brick<span class="text-[#FF6B00]">Brain</span> AI
        </h1>
        <p class="text-white/60 mt-1">Selenium E2E Automation Execution Report</p>
      </div>
      <div class="flex flex-col items-end text-sm text-white/50 font-mono">
        <p>Execution Time: ${new Date().toLocaleString()}</p>
        <p>Driver: Chrome Headless (via local chromedriver)</p>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="glass rounded-3xl p-6 flex flex-col justify-between">
        <span class="text-white/50 text-sm font-semibold">Total Scenarios</span>
        <span class="text-4xl font-bold mt-2 text-white">${total}</span>
      </div>
      <div class="glass rounded-3xl p-6 flex flex-col justify-between border-green-500/20">
        <span class="text-white/50 text-sm font-semibold">Passed</span>
        <span class="text-4xl font-bold mt-2 text-green-400">${passed}</span>
      </div>
      <div class="glass rounded-3xl p-6 flex flex-col justify-between border-red-500/20">
        <span class="text-white/50 text-sm font-semibold">Failed</span>
        <span class="text-4xl font-bold mt-2 text-red-400">${failed}</span>
      </div>
      <div class="glass rounded-3xl p-6 flex flex-col justify-between border-[#FF6B00]/20">
        <span class="text-white/50 text-sm font-semibold">Pass Rate</span>
        <span class="text-4xl font-bold mt-2 text-[#FF6B00]">${passRate}%</span>
      </div>
    </div>

    <!-- Duration Summary Banner -->
    <div class="glass rounded-2xl px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 rounded-full bg-[#FF6B00] animate-pulse"></div>
        <span class="font-semibold">Full Test Run completed in <span class="font-mono text-[#FF6B00]">${totalDuration}s</span></span>
      </div>
      <div class="text-xs text-white/40">
        Reports compiled into xlsx and markdown formats successfully.
      </div>
    </div>

    <!-- Results Table -->
    <div class="glass rounded-3xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="border-b border-white/10 bg-white/5 text-white/60 font-semibold text-sm">
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Module</th>
              <th class="px-6 py-4">Test Scenario</th>
              <th class="px-6 py-4">Status</th>
              <th class="px-6 py-4">Duration</th>
              <th class="px-6 py-4">Error details</th>
              <th class="px-6 py-4">Screenshot</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>
      </div>
    </div>

  </div>
</body>
</html>`;

  fs.writeFileSync(htmlFile, htmlContent);
}
