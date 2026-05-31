import { Wallet, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useApp } from '../context/AppContext';

export default function BudgetTracking() {
  const { project, expenses } = useApp();

  const totalPlanned = project.totalCost;
  const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(0, totalPlanned - totalSpent);
  const percentageUsed = totalPlanned > 0 ? ((totalSpent / totalPlanned) * 100).toFixed(1) : '0';

  const monthlyData = [
    { month: 'Jan', planned: Math.round(totalPlanned * 0.12), actual: Math.round(totalPlanned * 0.11) },
    { month: 'Feb', planned: Math.round(totalPlanned * 0.14), actual: Math.round(totalPlanned * 0.15) },
    { month: 'Mar', planned: Math.round(totalPlanned * 0.13), actual: Math.round(totalPlanned * 0.12) },
    { month: 'Apr', planned: Math.round(totalPlanned * 0.16), actual: Math.round(totalPlanned * 0.15) },
    { month: 'May', planned: Math.round(totalPlanned * 0.15), actual: totalSpent },
    { month: 'Jun', planned: Math.round(totalPlanned * 0.1), actual: 0 }
  ];


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Wallet className="w-8 h-8 text-[#FF6B00]" />
            Budget Tracking
          </h1>
          <p className="text-white/70 mt-1">Monitor project expenses and budget health</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Total Budget</p>
            <p className="text-3xl font-bold text-white">₹{(totalPlanned / 100000).toFixed(2)} L</p>
            <p className="text-white/50 text-xs mt-1">Allocated for project</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Total Spent</p>
            <p className="text-3xl font-bold text-[#FF6B00]">₹{(totalSpent / 100000).toFixed(2)} L</p>
            <p className="text-green-400 text-xs mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {percentageUsed}% utilized
            </p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-2">Remaining</p>
            <p className="text-3xl font-bold text-green-400">₹{(remaining / 100000).toFixed(2)} L</p>
            <p className="text-white/50 text-xs mt-1">{(100 - parseFloat(percentageUsed)).toFixed(1)}% available</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Planned vs Actual Spending</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData}>
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
                formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Legend />
              <Bar dataKey="planned" fill="#60A5FA" name="Planned" />
              <Bar dataKey="actual" fill="#FF6B00" name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Spending Trend</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
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
                formatter={(value: number) => `₹${(value / 1000).toFixed(0)}K`}
              />
              <Legend />
              <Line type="monotone" dataKey="planned" stroke="#60A5FA" strokeWidth={2} name="Planned" />
              <Line type="monotone" dataKey="actual" stroke="#FF6B00" strokeWidth={2} name="Actual" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
