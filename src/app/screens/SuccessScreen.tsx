import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { CheckCircle, Download, Share2, Home } from 'lucide-react';

export default function SuccessScreen() {
  const navigate = useNavigate();
  const { project } = useApp();

  const durationDays = 90 + Math.min(270, Math.ceil(project.floors * 30 + project.plotSize / 15));

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-2xl w-full space-y-8 text-center">
        <div className="inline-flex bg-gradient-to-br from-green-500 to-green-600 p-8 rounded-full mb-4 animate-bounce">
          <CheckCircle className="w-24 h-24 text-white" />
        </div>

        <div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Your Smart Construction Plan is Ready!
          </h1>
          <p className="text-xl text-white/70">
            BrickBrain has generated a comprehensive construction plan for your project
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Plan Summary</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-2xl p-6">
              <p className="text-white/60 text-sm mb-1">Total Estimated Cost</p>
              <p className="text-3xl font-bold text-white">₹{(project.totalCost / 100000).toFixed(2)}L</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <p className="text-white/60 text-sm mb-1">Project Duration</p>
              <p className="text-3xl font-bold text-white">{durationDays} Days</p>
            </div>

            <div className="glass rounded-2xl p-6">
              <p className="text-white/60 text-sm mb-1">AI Confidence</p>
              <p className="text-3xl font-bold text-green-400">95%</p>
            </div>
          </div>

          <div className="space-y-3 text-left mb-8">
            {[
              `Complete material quantity calculations for ${project.plotSize} sq.ft`,
              `Labor cost breakdown (₹${(project.breakdown.labor / 100000).toFixed(2)}L) and scheduling`,
              `${durationDays}-day detailed project timeline`,
              '3D house structure & layer visualization',
              'AI-powered material quality recommendations',
              'Integrated budget and invoice tracking dashboard'
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                <span className="text-white/80">{item}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="glass text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </button>
            <button className="glass text-white py-3 px-4 rounded-xl font-semibold hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Plan
            </button>
            <button
              onClick={() => navigate('/app/dashboard')}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Dashboard
            </button>
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-2">What's Next?</h3>
          <p className="text-white/70 text-sm">
            Explore your dashboard to view detailed analytics, track progress in real-time,
            collaborate with your contractor, and get AI-powered recommendations throughout your construction journey.
          </p>
        </div>
      </div>
    </div>
  );
}
