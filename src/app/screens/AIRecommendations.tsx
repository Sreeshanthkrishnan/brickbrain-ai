import { Brain, TrendingDown, Lightbulb, AlertCircle } from 'lucide-react';

export default function AIRecommendations() {
  const recommendations = [
    {
      type: 'cost-saving',
      title: 'Reduce Steel Wastage',
      description: 'Switch to pre-cut TMT bars to reduce wastage by 8%. Estimated savings: ₹18,500',
      impact: 'High',
      savings: '₹18,500',
      icon: TrendingDown,
      color: 'green'
    },
    {
      type: 'material',
      title: 'Alternative Material Suggestion',
      description: 'Use AAC blocks instead of red bricks for faster construction and better insulation',
      impact: 'Medium',
      savings: '₹12,000',
      icon: Lightbulb,
      color: 'blue'
    },
    {
      type: 'warning',
      title: 'Weather Alert',
      description: 'Heavy rainfall predicted next week. Recommend scheduling roofing work after monsoon',
      impact: 'High',
      savings: 'Avoid delays',
      icon: AlertCircle,
      color: 'yellow'
    },
    {
      type: 'cost-saving',
      title: 'Bulk Purchase Discount',
      description: 'Order 250 cement bags together to get 12% supplier discount',
      impact: 'High',
      savings: '₹12,600',
      icon: TrendingDown,
      color: 'green'
    },
    {
      type: 'optimization',
      title: 'Labor Optimization',
      description: 'Reduce helper count by 3 during electrical phase. Optimal team size: 9 workers',
      impact: 'Medium',
      savings: '₹13,500',
      icon: Lightbulb,
      color: 'purple'
    }
  ];

  const totalSavings = recommendations
    .filter(r => r.savings.startsWith('₹'))
    .reduce((sum, r) => sum + parseInt(r.savings.replace(/[₹,]/g, '')), 0);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Brain className="w-8 h-8 text-[#FF6B00]" />
            AI Recommendations
          </h1>
          <p className="text-white/70 mt-1">Smart insights to optimize your construction project</p>
        </div>

        <div className="glass rounded-3xl p-6 text-center">
          <p className="text-white/70 text-sm mb-2">Potential Budget Savings</p>
          <h2 className="text-4xl font-bold text-green-400 mb-1">
            ₹{(totalSavings / 1000).toFixed(1)}K
          </h2>
          <p className="text-white/60 text-sm">From 5 active recommendations</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-xl ${
                  rec.color === 'green'
                    ? 'bg-green-500/20'
                    : rec.color === 'blue'
                    ? 'bg-blue-500/20'
                    : rec.color === 'yellow'
                    ? 'bg-yellow-500/20'
                    : 'bg-purple-500/20'
                }`}>
                  <rec.icon className={`w-6 h-6 ${
                    rec.color === 'green'
                      ? 'text-green-400'
                      : rec.color === 'blue'
                      ? 'text-blue-400'
                      : rec.color === 'yellow'
                      ? 'text-yellow-400'
                      : 'text-purple-400'
                  }`} />
                </div>

                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-white font-semibold text-lg">{rec.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        rec.impact === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {rec.impact} Impact
                      </span>
                      {rec.savings.startsWith('₹') && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400">
                          Save {rec.savings}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-white/70 text-sm mb-4">{rec.description}</p>

                  <button className="text-[#FF6B00] text-sm font-medium hover:underline">
                    Apply Recommendation →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">How AI Recommendations Work</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-white/70">
            <div>
              <span className="text-[#FF6B00] font-semibold">Real-time Analysis</span>
              <p className="mt-1">Continuously monitors market prices, weather, and project data</p>
            </div>
            <div>
              <span className="text-[#FF6B00] font-semibold">Pattern Recognition</span>
              <p className="mt-1">Learns from 10,000+ successful construction projects</p>
            </div>
            <div>
              <span className="text-[#FF6B00] font-semibold">Predictive Insights</span>
              <p className="mt-1">Anticipates delays, cost overruns, and optimization opportunities</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
