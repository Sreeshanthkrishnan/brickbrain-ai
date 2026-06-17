import { useNavigate } from 'react-router';
import { Download, Share2, CheckCircle, TrendingDown, ArrowLeft } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { useApp } from '../context/AppContext';

export default function CostEstimationResult() {
  const navigate = useNavigate();
  const { project } = useApp();

  const costBreakdown = [
    { name: 'Material Cost', value: project.breakdown.materials, color: '#FF6B00' },
    { name: 'Labor Cost', value: project.breakdown.labor, color: '#1A3556' },
    { name: 'Interior Cost', value: project.breakdown.interior, color: '#60A5FA' },
    { name: 'Tax & Legal', value: project.breakdown.tax, color: '#34D399' }
  ];

  const totalCost = project.totalCost;

  const detailedCosts = [
    { category: 'Foundation & Structure', amount: Math.round(project.breakdown.materials * 0.45) },
    { category: 'Walls & Masonry', amount: Math.round(project.breakdown.materials * 0.25) },
    { category: 'Roofing', amount: Math.round(project.breakdown.materials * 0.15) },
    { category: 'Electrical Work', amount: Math.round(project.breakdown.labor * 0.3) },
    { category: 'Plumbing', amount: Math.round(project.breakdown.labor * 0.2) },
    { category: 'Flooring & Tiles', amount: Math.round(project.breakdown.interior * 0.4) },
    { category: 'Painting', amount: Math.round(project.breakdown.interior * 0.2) },
    { category: 'Doors & Windows', amount: Math.round(project.breakdown.interior * 0.3) },
    { category: 'Tax & Compliance', amount: project.breakdown.tax }
  ];


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10 cursor-pointer flex items-center justify-center flex-shrink-0"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 text-white/80" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-400" />
              {project.projectName || 'Cost Estimation Result'}
            </h1>
            <p className="text-white/70 mt-1">AI-powered construction budget estimation summary</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-8 text-center">
          <p className="text-white/70 text-sm mb-2">Total Estimated Cost</p>
          <h2 className="text-5xl font-bold text-white mb-4">
            ₹{(totalCost / 100000).toFixed(2)} Lakhs
          </h2>
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm">
            <TrendingDown className="w-4 h-4" />
            12% lower than market average
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-6">Cost Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={costBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `₹${(value / 100000).toFixed(2)} L`}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                />
                <Legend
                  formatter={(value) => <span className="text-white/90">{value}</span>}
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-3xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Summary</h3>
            <div className="space-y-4">
              {costBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-white/90">{item.name}</span>
                  </div>
                  <span className="text-white font-semibold">
                    ₹{(item.value / 100000).toFixed(2)} L
                  </span>
                </div>
              ))}
              <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-white font-semibold">Total</span>
                <span className="text-2xl font-bold text-[#FF6B00]">
                  ₹{(totalCost / 100000).toFixed(2)} L
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Detailed Cost Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detailedCosts.map((item, index) => (
              <div key={index} className="glass rounded-xl p-4">
                <p className="text-white/70 text-sm mb-1">{item.category}</p>
                <p className="text-xl font-bold text-white">
                  ₹{(item.amount / 100000).toFixed(2)} L
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate('/app/materials')}
            className="flex-1 glass text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all"
          >
            View Materials
          </button>
          <button
            onClick={() => navigate('/app/budget')}
            className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
          >
            Create Budget Plan
          </button>
        </div>
      </div>
    </div>
  );
}
