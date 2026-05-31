import { Info, Target, Eye, Zap, Users, Award } from 'lucide-react';

export default function AboutBrickBrain() {
  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <div className="inline-flex bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-6 rounded-3xl mb-4">
            <Info className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            About <span className="text-[#FF6B00]">BrickBrain</span>
          </h1>
          <p className="text-white/70 text-lg">AI-Powered Construction Planning Platform</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Target className="w-6 h-6 text-[#FF6B00]" />
            Our Mission
          </h2>
          <p className="text-white/70 leading-relaxed">
            BrickBrain aims to revolutionize the construction industry by making intelligent project planning accessible to everyone. We combine cutting-edge AI technology with deep construction expertise to help homeowners, contractors, and engineers build smarter, faster, and more cost-effectively.
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
            <Eye className="w-6 h-6 text-[#FF6B00]" />
            Our Vision
          </h2>
          <p className="text-white/70 leading-relaxed">
            To become the world's most trusted AI construction planning platform, empowering millions of people to transform their building dreams into reality with confidence, transparency, and efficiency.
          </p>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Zap className="w-6 h-6 text-[#FF6B00]" />
            Technology Stack
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { name: 'AI & Machine Learning', desc: 'TensorFlow, PyTorch, Neural Networks' },
              { name: 'Computer Vision', desc: 'Real-time defect detection & analysis' },
              { name: 'Cloud Infrastructure', desc: 'AWS, Azure, scalable architecture' },
              { name: 'Real-time Data', desc: 'Live pricing feeds from 500+ suppliers' },
              { name: '3D Visualization', desc: 'WebGL, Three.js rendering engine' },
              { name: 'Mobile & Web', desc: 'React, React Native, PWA' }
            ].map((tech, index) => (
              <div key={index} className="glass rounded-xl p-4">
                <p className="text-white font-semibold mb-1">{tech.name}</p>
                <p className="text-white/60 text-sm">{tech.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-[#FF6B00]" />
            Key Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              'AI Cost Estimation (95% accuracy)',
              'Real-time Material Pricing',
              '3D House Visualization',
              'Digital Twin Technology',
              'AI Defect Detection',
              'Smart Budget Tracking',
              'Team Collaboration Tools',
              'Automated Reporting'
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-white/80">
                <div className="w-2 h-2 bg-[#FF6B00] rounded-full"></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-3xl p-8 text-center">
          <Users className="w-12 h-12 text-[#FF6B00] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Join 10,000+ Users</h2>
          <p className="text-white/70 mb-6">Building smarter with BrickBrain across 15+ countries</p>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-3xl font-bold text-white">10K+</p>
              <p className="text-white/60 text-sm">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">5K+</p>
              <p className="text-white/60 text-sm">Projects Completed</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-white">₹500Cr+</p>
              <p className="text-white/60 text-sm">Managed Budget</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <p className="text-white/70 text-sm">Version 2.1.0 • © 2026 BrickBrain Technologies</p>
          <p className="text-white/50 text-xs mt-1">Built with AI for the Future of Construction</p>
        </div>
      </div>
    </div>
  );
}
