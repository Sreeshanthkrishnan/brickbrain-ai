import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Building2, Sparkles } from 'lucide-react';

export default function SplashScreen() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/onboarding-1');
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1A3556] to-[#0B1F3A]"></div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-64 h-64 bg-[#FF6B00] rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FF6B00] blur-2xl opacity-50 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-6 rounded-3xl">
            <Building2 className="w-20 h-20 text-white" strokeWidth={2.5} />
          </div>
        </div>

        <div className="flex flex-col items-center gap-2">
          <h1 className="text-5xl font-bold text-white tracking-tight">
            Brick<span className="text-[#FF6B00]">Brain</span>
          </h1>
          <div className="flex items-center gap-2 text-white/80">
            <Sparkles className="w-5 h-5 text-[#FF6B00]" />
            <p className="text-xl">Build Smarter with AI</p>
          </div>
        </div>

        <div className="flex gap-2 mt-8">
          <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce delay-100"></div>
          <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce delay-200"></div>
        </div>
      </div>
    </div>
  );
}
