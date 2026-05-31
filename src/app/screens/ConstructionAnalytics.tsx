import { BarChart3, TrendingUp, Clock, Users } from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

export default function ConstructionAnalytics() {
  const { project, expenses, milestones } = useApp();

  const costData = [
    { category: 'Materials', value: project.breakdown.materials, color: '#FF6B00' },
    { category: 'Labor', value: project.breakdown.labor, color: '#60A5FA' },
    { category: 'Interior', value: project.breakdown.interior, color: '#34D399' },
    { category: 'Tax & Legal', value: project.breakdown.tax, color: '#FBBF24' }
  ];

  const efficiencyData = [
    { month: 'Jan', efficiency: 85 },
    { month: 'Feb', efficiency: 88 },
    { month: 'Mar', efficiency: 92 },
    { month: 'Apr', efficiency: 87 }
  ];

  const area = project.plotSize * project.floors;
  const materialConsumption = [
    { material: 'Cement', planned: Math.round(area * 0.4), actual: Math.round(area * 0.4 * 0.92) },
    { material: 'Steel', planned: Math.round(area * 4.2), actual: Math.round(area * 4.2 * 0.89) },
    { material: 'Bricks', planned: Math.round(area * 11.5), actual: Math.round(area * 11.5 * 0.95) },
    { material: 'Sand', planned: Math.round(area * 1.8), actual: Math.round(area * 1.8 * 0.90) }
  ];


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-[#FF6B00]" />
            Construction Analytics
          </h1>
          <p className="text-white/70 mt-1">Comprehensive project performance insights</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <TrendingUp className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Overall Efficiency</p>
            <p className="text-3xl font-bold text-white">88%</p>
            <p className="text-green-400 text-xs mt-1">+5% from last month</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Clock className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Schedule Performance</p>
            <p className="text-3xl font-bold text-white">92%</p>
            <p className="text-white/50 text-xs mt-1">On track</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Users className="w-8 h-8 text-purple-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Labor Efficiency</p>
            <p className="text-3xl font-bold text-white">85%</p>
            <p className="text-white/50 text-xs mt-1">Productive hours</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Cost Analytics</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={costData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={90}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {costData.map((entry, index) => (
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
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-6">Labor Efficiency Trend</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="month" stroke="#fff" />
                <YAxis stroke="#fff" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(11, 31, 58, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Bar dataKey="efficiency" fill="#FF6B00" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Material Consumption Analysis</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={materialConsumption}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="material" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(11, 31, 58, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  color: '#fff'
                }}
              />
              <Legend />
              <Bar dataKey="planned" fill="#60A5FA" name="Planned" />
              <Bar dataKey="actual" fill="#FF6B00" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
