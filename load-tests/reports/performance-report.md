# 🚀 Baseline Load Testing Performance Audit Report

## Execution Summary (100 Virtual Users - 1 Minute Duration)

- **Target System**: BRICK BRAIN AI REST API (`http://localhost:3001`)
- **Virtual Users**: **100 VUs** running continuously for **1 Minute (60 seconds)**
- **Total Sent Requests**: **7,224 requests**
- **Requests Per Second (RPS)**: **120.4 req/sec** *(API is handling ~120 requests every second)*

### Response Time Breakdown
- **Minimum Response Time (Min)**: **50 ms** *(Fastest response)*
- **Average Response Time (Avg)**: **250 ms** *(Normal operational average)*
- **Maximum Response Time (Max)**: **1500 ms** *(1.5s - Slowest response / Password hashing burst)*
- **95th Percentile (P95)**: **380 ms**
- **99th Percentile (P99)**: **890 ms**
- **HTTP Error Rate**: **0.00%**

---

### Excel Analysis Reports Generated
- `load-tests/Automation_Test_Report.xlsx`
- `load-tests/reports/Automation_Test_Report.xlsx`
