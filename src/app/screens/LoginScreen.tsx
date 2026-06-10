import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Mail, Lock, Eye, EyeOff, Fingerprint, ArrowLeft, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LoginScreen() {
  const navigate = useNavigate();
  const { login, googleLogin } = useApp();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [tempApiUrl, setTempApiUrl] = useState('');

  const handleOpenSettings = () => {
    const currentUrl = localStorage.getItem('brickbrain_api_url') || 'http://10.221.102.185:3001';
    setTempApiUrl(currentUrl);
    setIsSettingsOpen(true);
  };

  const handleSaveSettings = () => {
    const trimmed = tempApiUrl.trim();
    if (trimmed) {
      localStorage.setItem('brickbrain_api_url', trimmed);
    } else {
      localStorage.removeItem('brickbrain_api_url');
    }
    setIsSettingsOpen(false);
    window.location.reload();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/app/dashboard');
    }
  };

  useEffect(() => {
    // Load the Google GIS script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = () => {
      const google = (window as any).google;
      if (google) {
        google.accounts.id.initialize({
          client_id: '371436468018-ptkkalbtall7js8f8qdmon4mqr670n24.apps.googleusercontent.com',
          callback: async (response: any) => {
            const success = await googleLogin(response.credential);
            if (success) {
              navigate('/app/dashboard');
            }
          }
        });

        google.accounts.id.renderButton(
          document.getElementById('google-signin-btn'),
          {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'left',
            width: 380
          }
        );
      }
    };

    return () => {
      try {
        document.head.removeChild(script);
      } catch (e) {}
    };
  }, [googleLogin, navigate]);


  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1A3556] to-[#0B1F3A]"></div>

      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl"></div>

      <button
        onClick={() => navigate('/welcome')}
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      {/* Settings/API URL Configuration Button */}
      <button
        onClick={handleOpenSettings}
        className="absolute top-6 right-6 z-20 text-white/70 hover:text-white flex items-center justify-center p-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
        title="Configure Backend URL"
      >
        <Settings className="w-5 h-5" />
      </button>

      {isSettingsOpen && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6">
          <div className="glass rounded-3xl p-6 max-w-sm w-full border border-white/10 space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xl font-bold text-white">Configure Backend</h3>
              <p className="text-white/60 text-xs">
                Enter your PC's IP address and port to connect the app to the backend.
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-white/80 text-xs">API URL</label>
              <input
                type="text"
                value={tempApiUrl}
                onChange={(e) => setTempApiUrl(e.target.value)}
                placeholder="e.g. http://192.168.1.15:3001"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-[#FF6B00] transition-colors text-sm"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="flex-1 border border-white/10 text-white py-3 rounded-xl hover:bg-white/5 transition-all text-sm font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all text-sm font-semibold cursor-pointer"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-white/70">Login to continue building smarter</p>
          </div>

          <form onSubmit={handleLogin} className="glass rounded-3xl p-8 space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-white/90 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-white/90 text-sm">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-white/20 bg-white/5 text-[#FF6B00] focus:ring-[#FF6B00]"
                />
                <span className="text-white/70 text-sm">Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => navigate('/forgot-password')}
                className="text-[#FF6B00] text-sm hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
            >
              Login
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-transparent text-white/50">Or continue with</span>
              </div>
            </div>

            <div className="flex justify-center w-full">
              <div
                id="google-signin-btn"
                className="flex justify-center items-center h-[40px] w-full overflow-hidden rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all"
              ></div>
            </div>
          </form>

          <p className="text-center text-white/70">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/signup')}
              className="text-[#FF6B00] hover:underline font-semibold"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
