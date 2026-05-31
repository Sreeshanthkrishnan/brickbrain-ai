import { useNavigate } from 'react-router';
import { Boxes, ArrowRight } from 'lucide-react';

export default function Onboarding3() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1A3556] to-[#0B1F3A]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl"></div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="glass rounded-3xl p-12 flex flex-col items-center text-center space-y-6">
            <div className="bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-6 rounded-2xl">
              <Boxes className="w-16 h-16 text-white" strokeWidth={2} />
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-bold text-white">3D Visualization & Analytics</h2>
              <p className="text-white/70 text-lg leading-relaxed">
                Visualize your project in 3D before construction. Monitor progress with real-time analytics and insights.
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              <div className="w-2 h-2 bg-white/20 rounded-full"></div>
              <div className="w-8 h-2 bg-[#FF6B00] rounded-full"></div>
            </div>

            <button
              onClick={() => navigate('/welcome')}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-8 py-3 rounded-full flex items-center gap-2 hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
            >
              Get Started <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
