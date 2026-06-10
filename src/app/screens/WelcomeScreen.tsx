import { useNavigate } from 'react-router';
import { Building2, LogIn, UserPlus, UserCheck, Settings } from 'lucide-react';

export default function WelcomeScreen() {
  const navigate = useNavigate();

  const handleConfigureApi = () => {
    const currentUrl = localStorage.getItem('brickbrain_api_url') || 'http://10.221.102.185:3001';
    const newUrl = prompt('Configure Backend Server API URL (e.g. http://192.168.1.15:3001):\nLeave empty to reset to default.', currentUrl);
    if (newUrl !== null) {
      const trimmed = newUrl.trim();
      if (trimmed) {
        localStorage.setItem('brickbrain_api_url', trimmed);
      } else {
        localStorage.removeItem('brickbrain_api_url');
      }
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1A3556] to-[#0B1F3A]"></div>

      {/* Settings/API URL Configuration Button */}
      <button
        onClick={handleConfigureApi}
        className="absolute top-6 right-6 z-20 text-white/70 hover:text-white flex items-center justify-center p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
        title="Configure Backend URL"
      >
        <Settings className="w-5 h-5" />
      </button>

      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-5 rounded-3xl">
              <Building2 className="w-16 h-16 text-white" strokeWidth={2.5} />
            </div>
            <h1 className="text-4xl font-bold text-white">
              Welcome to <span className="text-[#FF6B00]">BrickBrain</span>
            </h1>
            <p className="text-white/70 text-lg">
              Your AI-powered construction planning companion
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/login')}
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
            >
              <LogIn className="w-5 h-5" />
              <span className="font-semibold">Login</span>
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="w-full glass text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/10 transition-all"
            >
              <UserPlus className="w-5 h-5" />
              <span className="font-semibold">Create Account</span>
            </button>

            <button
              onClick={() => navigate('/app/dashboard')}
              className="w-full border border-white/20 text-white/80 py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all"
            >
              <UserCheck className="w-5 h-5" />
              <span className="font-semibold">Continue as Guest</span>
            </button>
          </div>

          <p className="text-center text-white/50 text-sm">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
