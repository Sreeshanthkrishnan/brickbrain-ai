import xlsx from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelDir = path.join(__dirname, '../reports/excel');
const excelFile = path.join(excelDir, 'Automation_Test_Report.xlsx');

export function writeExcelReport(results) {
  if (!fs.existsSync(excelDir)) {
    fs.mkdirSync(excelDir, { recursive: true });
  }

  const data = results.map((r, index) => ({
    'Test Case ID': `TC_${(index + 1).toString().padStart(3, '0')}`,
    'Module': r.module || 'General',
    'Test Name': r.name,
    'Status': r.status.toUpperCase(),
    'Pass/Fail': r.status.toUpperCase() === 'PASSED' ? 'PASS' : 'FAIL',
    'Execution Time': `${(r.duration / 1000).toFixed(2)}s`,
    'Comments': r.error || 'N/A'
  }));

  const worksheet = xlsx.utils.json_to_sheet(data);
  const workbook = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(workbook, worksheet, 'E2E Results');

  // Adjust column widths
  const cols = [
    { wch: 15 }, // Test Case ID
    { wch: 25 }, // Module
    { wch: 40 }, // Test Name
    { wch: 12 }, // Status
    { wch: 12 }, // Pass/Fail
    { wch: 18 }, // Execution Time
    { wch: 45 }  // Comments
  ];
  worksheet['!cols'] = cols;

  xlsx.writeFile(workbook, excelFile);
}
