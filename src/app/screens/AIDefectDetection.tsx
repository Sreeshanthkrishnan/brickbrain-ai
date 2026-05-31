import { AlertTriangle, CheckCircle, Scan } from 'lucide-react';
import { useApp } from '../context/AppContext';

function DefectMockup({ id, type, severity, confidence, status }: { id: string; type: string; severity: string; confidence: string; status: string }) {
  const isResolved = status === 'Resolved';
  
  // Set colors based on severity & resolved status
  const themeColor = isResolved ? '#22c55e' : severity === 'High' ? '#ef4444' : severity === 'Medium' ? '#f59e0b' : '#3b82f6';
  
  // Determine drawing type
  const isCrack = type.toLowerCase().includes('crack');
  const isVoid = type.toLowerCase().includes('void');
  const isBrick = type.toLowerCase().includes('brick') || type.toLowerCase().includes('misalignment');

  return (
    <div className="w-full md:w-48 h-32 rounded-xl relative overflow-hidden border border-white/10 bg-slate-950 flex-shrink-0 select-none">
      {/* Background patterns */}
      {isBrick ? (
        // Brickwork pattern
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(90deg, #fff 1px, transparent 1px),
            linear-gradient(0deg, #fff 1px, transparent 1px)
          `,
          backgroundSize: '30px 15px'
        }} />
      ) : (
        // Concrete speckle pattern
        <div className="absolute inset-0 opacity-15" style={{
          backgroundImage: 'radial-gradient(circle, #fff 1.2px, transparent 1.2px)',
          backgroundSize: '10px 10px'
        }} />
      )}

      {/* SVG drawings for the defects */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {isCrack && (
          // A jagged crack line
          <path 
            d="M 80 15 L 88 40 L 80 65 L 95 85 L 85 115" 
            fill="none" 
            stroke={themeColor} 
            strokeWidth="2.5" 
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={isResolved ? "none" : "2"}
            className={isResolved ? "" : "animate-pulse"}
          />
        )}
        
        {isVoid && (
          // Cluster of voids/bubbles
          <g fill={themeColor} fillOpacity="0.25" stroke={themeColor} strokeWidth="1.5">
            <circle cx="96" cy="55" r="12" />
            <circle cx="110" cy="65" r="8" />
            <circle cx="85" cy="70" r="10" />
            <circle cx="100" cy="78" r="6" />
          </g>
        )}

        {isBrick && (
          // Misaligned brick indicator
          <g fill="none" stroke={themeColor} strokeWidth="2">
            <rect x="75" y="45" width="40" height="20" rx="1" fill={`${themeColor}15`} transform="rotate(8 95 55)" />
            <line x1="30" y1="55" x2="68" y2="55" strokeWidth="1" stroke="#ffffff20" strokeDasharray="3 3" />
            <line x1="122" y1="55" x2="160" y2="55" strokeWidth="1" stroke="#ffffff20" strokeDasharray="3 3" />
          </g>
        )}
      </svg>

      {/* Bounding box visual target */}
      {!isResolved && (
        <div 
          className="absolute border-2 animate-pulse rounded"
          style={{
            borderColor: themeColor,
            left: isBrick ? '68px' : isVoid ? '72px' : '65px',
            top: isBrick ? '35px' : isVoid ? '40px' : '10px',
            width: isBrick ? '60px' : isVoid ? '58px' : '45px',
            height: isBrick ? '45px' : isVoid ? '50px' : '95px',
            boxShadow: `0 0 10px ${themeColor}40`
          }}
        >
          {/* Tag label */}
          <span 
            className="absolute -top-4 -left-0.5 text-[7px] font-bold px-1 py-0.5 rounded text-white tracking-wide"
            style={{ backgroundColor: themeColor }}
          >
            {severity}
          </span>
        </div>
      )}

      {/* Camera telemetry overlay */}
      <div className="absolute inset-0 p-1.5 flex flex-col justify-between pointer-events-none font-mono text-[8px] text-white/50">
        <div className="flex justify-between">
          <span>CAM_FEED_{id}</span>
          <span className={isResolved ? "text-green-400" : "text-red-400 animate-pulse"}>
            ● {isResolved ? "STANDBY" : "LIVE_ANOMALY"}
          </span>
        </div>
        <div className="flex justify-between items-end">
          <span>AI_CONF: {confidence}</span>
          <span className="text-[7px] text-white/30">SYS_S2</span>
        </div>
      </div>
      
      {/* Corner crosshair brackets */}
      <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30"></div>
      <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30"></div>
      <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30"></div>
      <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30"></div>
    </div>
  );
}

export default function AIDefectDetection() {
  const { detections, resolveDefect } = useApp();

  const criticalCount = detections.filter(d => d.status === 'Critical').length;
  const reviewCount = detections.filter(d => d.status === 'Review' || d.status === 'Minor').length;
  const resolvedCount = detections.filter(d => d.status === 'Resolved').length;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Scan className="w-8 h-8 text-[#FF6B00]" />
            AI Defect Detection
          </h1>
          <p className="text-white/70 mt-1">Automated construction quality monitoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <AlertTriangle className="w-8 h-8 text-red-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Critical Issues</p>
            <p className="text-3xl font-bold text-white">{criticalCount}</p>
            <p className="text-red-400 text-xs mt-1">Require immediate attention</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Scan className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Under Review</p>
            <p className="text-3xl font-bold text-white">{reviewCount}</p>
            <p className="text-yellow-400 text-xs mt-1">Being assessed</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Resolved</p>
            <p className="text-3xl font-bold text-white">{resolvedCount}</p>
            <p className="text-green-400 text-xs mt-1">Fixed defects</p>
          </div>
        </div>


        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Detected Issues</h2>

          <div className="space-y-4">
            {detections.map((detection) => (
              <div key={detection.id} className="glass rounded-xl p-5 hover:bg-white/5 transition-all">
                <div className="flex flex-col md:flex-row gap-5 items-stretch">
                  
                  {/* Defect Bounding Box Telemetry Snapshot */}
                  <DefectMockup 
                    id={detection.id}
                    type={detection.type}
                    severity={detection.severity}
                    confidence={detection.confidence}
                    status={detection.status}
                  />

                  {/* Details and Actions */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-3">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-xl mt-0.5 ${
                            detection.severity === 'High'
                              ? 'bg-red-500/20'
                              : detection.severity === 'Medium'
                              ? 'bg-yellow-500/20'
                              : 'bg-blue-500/20'
                          }`}>
                            <AlertTriangle className={`w-5 h-5 ${
                              detection.severity === 'High'
                                ? 'text-red-400'
                                : detection.severity === 'Medium'
                                ? 'text-yellow-400'
                                : 'text-blue-400'
                            }`} />
                          </div>

                          <div className="flex-1">
                            <h3 className="text-white font-semibold text-lg mb-1">{detection.type}</h3>
                            <p className="text-white/70 text-sm">{detection.location}</p>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] uppercase font-bold tracking-wider text-white/40">Status:</span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                detection.status === 'Critical' 
                                  ? 'text-red-400 bg-red-500/10 border border-red-500/20' 
                                  : detection.status === 'Review' 
                                  ? 'text-yellow-400 bg-yellow-500/10 border border-yellow-500/20' 
                                  : detection.status === 'Minor'
                                  ? 'text-blue-400 bg-blue-500/10 border border-blue-500/20'
                                  : 'text-green-400 bg-green-500/10 border border-green-500/20'
                              }`}>
                                {detection.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-auto">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            detection.severity === 'High'
                              ? 'bg-red-500/20 text-red-400'
                              : detection.severity === 'Medium'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-blue-500/20 text-blue-400'
                          }`}>
                            {detection.severity} Severity
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-white/80">
                            {detection.confidence} confident
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-white/5 mt-4">
                      <span className="text-white/50 text-xs">AI confidence threshold: 75%</span>
                      {detection.status !== 'Resolved' ? (
                        <button 
                          onClick={() => {
                            resolveDefect(detection.id);
                            alert('Marked as Resolved! Re-run scans to confirm restoration.');
                          }}
                          className="text-[#FF6B00] text-sm font-semibold hover:underline cursor-pointer"
                        >
                          Resolve Defect & Log Work →
                        </button>
                      ) : (
                        <span className="text-green-400 text-sm font-semibold flex items-center gap-1">
                          ✓ Resolved and Verified
                        </span>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">How AI Detection Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <span className="text-[#FF6B00] font-semibold">Image Analysis</span>
              <p className="mt-1">Deep learning models scan construction photos</p>
            </div>
            <div>
              <span className="text-[#FF6B00] font-semibold">Pattern Recognition</span>
              <p className="mt-1">Identifies cracks, damage, and quality issues</p>
            </div>
            <div>
              <span className="text-[#FF6B00] font-semibold">Real-time Alerts</span>
              <p className="mt-1">Instant notifications for critical defects</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
