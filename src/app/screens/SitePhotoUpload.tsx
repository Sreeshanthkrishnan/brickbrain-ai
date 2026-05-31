import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Camera, Upload, Image as ImageIcon, Loader2, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function SitePhotoUpload() {
  const navigate = useNavigate();
  const { uploadSitePhoto } = useApp();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const recentPhotos = [
    { date: 'Apr 10, 2026', category: 'Foundation', count: 12 },
    { date: 'Apr 8, 2026', category: 'Wall Construction', count: 18 },
    { date: 'Apr 5, 2026', category: 'Roofing Progress', count: 8 },
    { date: 'Apr 2, 2026', category: 'Electrical Work', count: 15 }
  ];

  const handleStartUpload = () => {
    setUploading(true);
    setProgress(0);
  };

  useEffect(() => {
    if (!uploading) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Finish scan
          setTimeout(async () => {
            await uploadSitePhoto("site_photo_mock.jpg");
            setUploading(false);
            navigate('/app/defects');
          }, 300);
          return 100;
        }
        return prev + 20;
      });
    }, 250);

    return () => clearInterval(interval);
  }, [uploading, navigate, uploadSitePhoto]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {uploading ? (
          <div className="glass rounded-3xl p-12 text-center space-y-6 relative overflow-hidden bg-slate-950/40">
            {/* Custom Scanning Animation Styles */}
            <style>{`
              @keyframes scan {
                0% { top: 0%; }
                50% { top: 100%; }
                100% { top: 0%; }
              }
              .scanner-laser {
                position: absolute;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(90deg, transparent, #22c55e, transparent);
                box-shadow: 0 0 15px #22c55e, 0 0 5px #22c55e;
                animation: scan 3s infinite linear;
              }
              .blueprint-grid {
                background-size: 24px 24px;
                background-image: 
                  linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                  linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
              }
            `}</style>

            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                <Sparkles className="w-6 h-6 text-green-400 animate-spin" />
                AI Vision Scanning Active
              </h2>
              <p className="text-white/60 text-sm">Processing blueprint matrices & depth verification</p>
            </div>

            {/* Neural Scanner Frame */}
            <div className="w-full max-w-lg mx-auto aspect-video bg-black/60 border border-white/10 rounded-2xl relative overflow-hidden blueprint-grid flex items-center justify-center">
              {/* Laser line */}
              <div className="scanner-laser"></div>

              {/* Scanning visual indicators */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none space-y-2">
                <Camera className="w-16 h-16 text-green-400/40 animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-green-400 bg-green-500/10 px-2.5 py-1 rounded border border-green-500/20">
                  {progress < 25 ? 'Initializing...' : progress < 50 ? 'Analyzing Edges...' : progress < 85 ? 'Checking Voids...' : 'Finalizing Report...'}
                </span>
              </div>

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-white/30"></div>
              <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-white/30"></div>
              <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-white/30"></div>
              <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-white/30"></div>
            </div>

            {/* Progress Bar */}
            <div className="max-w-md mx-auto space-y-2">
              <div className="w-full bg-white/10 rounded-full h-3.5 border border-white/5 overflow-hidden">
                <div 
                  className="h-3.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-400 transition-all duration-300 shadow-[0_0_10px_#10b981]"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs font-mono text-green-400">
                <span>Matrix Scan Progress</span>
                <span>{progress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div 
            onClick={handleStartUpload}
            className="glass rounded-3xl p-12 border-2 border-dashed border-white/20 hover:border-[#FF6B00] hover:bg-white/5 transition-all cursor-pointer text-center group"
          >
            <Upload className="w-16 h-16 text-[#FF6B00] mx-auto mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="text-white font-semibold text-lg mb-2">Upload Construction Photos</h3>
            <p className="text-white/60 text-sm mb-4">Click to simulate selecting site images for AI quality analysis</p>
            <button className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer">
              Select & Upload Photo
            </button>
            <p className="text-white/40 text-xs mt-3">Supports: JPG, PNG, HEIC • Max 10MB per file</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { title: 'Foundation Footing', status: 'Verified' },
            { title: 'Plinth Beam Curing', status: 'Verified' },
            { title: 'Brickwork Layer 1', status: 'Defect Pending' },
            { title: 'Site Drainage Area', status: 'Verified' }
          ].map((item, index) => (
            <div key={index} className="glass rounded-2xl p-4 border border-white/5">
              <div className="aspect-square bg-black/40 rounded-xl mb-3 flex flex-col items-center justify-center border border-white/5 relative overflow-hidden">
                <ImageIcon className="w-10 h-10 text-white/30" />
                <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-2 py-0.5 rounded text-white/80 border border-white/10">Camera 0{index+1}</span>
              </div>
              <p className="text-white font-semibold text-sm">{item.title}</p>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded ${item.status.includes('Defect') ? 'text-red-400 bg-red-500/10' : 'text-green-400 bg-green-500/10'}`}>{item.status}</span>
            </div>
          ))}
        </div>

        <div className="glass rounded-3xl p-6 border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6">Recent Uploads</h2>
          <div className="space-y-3">
            {recentPhotos.map((photo, index) => (
              <div key={index} className="glass rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-[#FF6B00]/20 p-3 rounded-xl">
                    <ImageIcon className="w-5 h-5 text-[#FF6B00]" />
                  </div>
                  <div>
                    <p className="text-white font-medium">{photo.category}</p>
                    <p className="text-white/60 text-sm">{photo.date}</p>
                  </div>
                </div>
                <span className="text-[#FF6B00] font-semibold">{photo.count} photos</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
