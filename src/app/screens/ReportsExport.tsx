import { FileDown, FileText, FileSpreadsheet, File } from 'lucide-react';

export default function ReportsExport() {
  const handleGenerate = (name: string) => {
    alert(`Generating ${name}...\nSuccessfully exported and downloaded to local downloads directory!`);
  };

  const reports = [
    { name: 'Cost Estimation Report', format: 'PDF', size: '2.4 MB', date: 'Apr 10, 2026', icon: FileText },
    { name: 'Material Consumption', format: 'Excel', size: '1.8 MB', date: 'Apr 9, 2026', icon: FileSpreadsheet },
    { name: 'Labor Attendance Sheet', format: 'CSV', size: '512 KB', date: 'Apr 8, 2026', icon: File },
    { name: 'Budget Analysis', format: 'PDF', size: '3.1 MB', date: 'Apr 5, 2026', icon: FileText },
    { name: 'Progress Timeline', format: 'PDF', size: '1.9 MB', date: 'Apr 3, 2026', icon: FileText }
  ];

  const reportTypes = [
    { name: 'Cost Estimation', description: 'Complete project cost breakdown' },
    { name: 'Material Report', description: 'Material usage and inventory' },
    { name: 'Labor Report', description: 'Worker attendance and wages' },
    { name: 'Progress Report', description: 'Timeline and milestone tracking' },
    { name: 'Budget Analysis', description: 'Spending vs planned budget' },
    { name: 'Analytics Dashboard', description: 'Comprehensive project insights' }
  ];


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <FileDown className="w-8 h-8 text-[#FF6B00]" />
            Reports & Export
          </h1>
          <p className="text-white/70 mt-1">Generate and download project reports</p>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Generate New Report</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type, index) => (
              <div 
                key={index} 
                onClick={() => handleGenerate(type.name)}
                className="glass rounded-2xl p-5 hover:bg-white/5 transition-all cursor-pointer"
              >
                <FileText className="w-8 h-8 text-[#FF6B00] mb-3" />
                <h3 className="text-white font-semibold mb-1">{type.name}</h3>
                <p className="text-white/60 text-sm mb-4">{type.description}</p>
                <button className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-2 rounded-lg text-sm font-medium hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer">
                  Generate Report
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Export Formats</h2>
          <div className="grid grid-cols-3 gap-4">
            <button 
              onClick={() => handleGenerate('Data package in PDF')}
              className="glass rounded-xl p-6 hover:bg-white/5 transition-all text-center cursor-pointer"
            >
              <FileText className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-white font-medium">PDF</p>
              <p className="text-white/50 text-xs">Portable Document</p>
            </button>
            <button 
              onClick={() => handleGenerate('Data spreadsheet in Excel')}
              className="glass rounded-xl p-6 hover:bg-white/5 transition-all text-center cursor-pointer"
            >
              <FileSpreadsheet className="w-8 h-8 text-green-400 mx-auto mb-2" />
              <p className="text-white font-medium">Excel</p>
              <p className="text-white/50 text-xs">Spreadsheet</p>
            </button>
            <button 
              onClick={() => handleGenerate('Data list in CSV')}
              className="glass rounded-xl p-6 hover:bg-white/5 transition-all text-center cursor-pointer"
            >
              <File className="w-8 h-8 text-blue-400 mx-auto mb-2" />
              <p className="text-white font-medium">CSV</p>
              <p className="text-white/50 text-xs">Data Export</p>
            </button>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Exports</h2>

          <div className="space-y-3">
            {reports.map((report, index) => (
              <div key={index} className="glass rounded-xl p-5 flex items-center justify-between hover:bg-white/5 transition-all">
                <div className="flex items-center gap-4">
                  <div className="bg-[#FF6B00]/20 p-3 rounded-xl">
                    <report.icon className="w-6 h-6 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="text-white font-semibold">{report.name}</p>
                    <p className="text-white/60 text-sm">{report.format} • {report.size} • {report.date}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleGenerate(report.name)}
                  className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] p-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer"
                >
                  <FileDown className="w-5 h-5 text-white" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
