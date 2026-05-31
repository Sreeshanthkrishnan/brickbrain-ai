import { useState } from 'react';
import { Users, IndianRupee, Plus, Minus } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LaborPlanning() {
  const { project } = useApp();
  const [counts, setCounts] = useState<{ [key: string]: number }>({
    Masons: 8,
    Electricians: 3,
    Plumbers: 2,
    Carpenters: 4,
    Painters: 3,
    Helpers: 12
  });

  const dailyWages: { [key: string]: number } = {
    Masons: 800,
    Electricians: 1000,
    Plumbers: 900,
    Carpenters: 850,
    Painters: 700,
    Helpers: 500
  };

  const totalDays: { [key: string]: number } = {
    Masons: 90,
    Electricians: 45,
    Plumbers: 30,
    Carpenters: 60,
    Painters: 35,
    Helpers: 90
  };

  const roles = ['Masons', 'Electricians', 'Plumbers', 'Carpenters', 'Painters', 'Helpers'];

  const handleIncrement = (role: string) => {
    setCounts(prev => ({ ...prev, [role]: prev[role] + 1 }));
  };

  const handleDecrement = (role: string) => {
    setCounts(prev => ({ ...prev, [role]: Math.max(0, prev[role] - 1) }));
  };

  const laborCategories = roles.map(role => {
    const count = counts[role];
    const wage = dailyWages[role];
    const days = totalDays[role];
    const cost = count * wage * days;
    return {
      role,
      count,
      dailyWage: `₹${wage.toLocaleString()}`,
      totalDays: days,
      cost,
      totalCost: `₹${cost.toLocaleString()}`
    };
  });

  const totalLaborCost = laborCategories.reduce((sum, item) => sum + item.cost, 0);


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-[#FF6B00]" />
            Labor Planning
          </h1>
          <p className="text-white/70 mt-1">Workforce and wage planning for your project</p>
        </div>

        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-white/70 text-sm mb-2">Total Labor Cost</p>
          <h2 className="text-4xl font-bold text-white mb-2">
            ₹{(totalLaborCost / 100000).toFixed(2)} Lakhs
          </h2>
          <p className="text-white/60 text-sm">For 90 working days</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {laborCategories.map((labor, index) => (
            <div key={index} className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-white font-semibold text-lg">{labor.role}</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDecrement(labor.role)}
                    className="p-1 bg-white/15 hover:bg-[#FF6B00] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="text-white font-semibold min-w-8 text-center bg-white/5 py-1 px-2.5 rounded-lg border border-white/10">
                    {labor.count}
                  </span>
                  <button
                    onClick={() => handleIncrement(labor.role)}
                    className="p-1 bg-white/15 hover:bg-[#FF6B00] text-white rounded-lg transition-colors cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Daily Wage</span>
                  <span className="text-white font-medium">{labor.dailyWage}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/60">Total Days</span>
                  <span className="text-white font-medium">{labor.totalDays} days</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between">
                  <span className="text-white/60 text-sm">Total Cost</span>
                  <span className="text-[#FF6B00] font-bold text-lg">{labor.totalCost}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Labor Distribution</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {laborCategories.map((labor, index) => {
              const percentage = ((parseInt(labor.totalCost.replace(/[₹,]/g, '')) / totalLaborCost) * 100).toFixed(1);
              return (
                <div key={index} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-2">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="rgba(255,255,255,0.1)"
                        strokeWidth="8"
                        fill="none"
                      />
                      <circle
                        cx="40"
                        cy="40"
                        r="36"
                        stroke="#FF6B00"
                        strokeWidth="8"
                        fill="none"
                        strokeDasharray={`${(parseFloat(percentage) / 100) * 226} 226`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-white font-bold">{percentage}%</span>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{labor.role}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
