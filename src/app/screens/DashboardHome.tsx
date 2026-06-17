import { useNavigate } from 'react-router';
import {
  DollarSign,
  Boxes,
  Hammer,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  ArrowUpRight,
  Brain,
  Calculator
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function DashboardHome() {
  const navigate = useNavigate();
  const { project, expenses, milestones, notifications, projects, updateProject } = useApp();

  // 1. Calculate dynamic values
  const totalCostVal = project.totalCost;
  const laborCostVal = project.breakdown.labor;

  // Material usage calculation
  const materialExpenses = expenses.filter(e => 
    ['Cement', 'Steel Rebars', 'Sand', 'Red Bricks', 'Aggregate', 'Paint'].some(m => e.material.includes(m))
  );
  const materialSpent = materialExpenses.reduce((sum, e) => sum + e.amount, 0);
  const materialEstimate = project.breakdown.materials;
  const materialUsagePercent = materialEstimate > 0 ? Math.round((materialSpent / materialEstimate) * 100) : 0;

  // Timeline progress
  const completedMilestones = milestones.filter(m => m.status === 'completed').length;
  const totalMilestones = milestones.length;
  const progressPercent = totalMilestones > 0 ? Math.round(milestones.reduce((sum, m) => sum + m.progress, 0) / totalMilestones) : 0;

  const stats = [
    {
      label: 'Total Estimated Cost',
      value: `₹${totalCostVal.toLocaleString()}`,
      change: '+12.5%',
      icon: DollarSign,
      color: 'from-[#FF6B00] to-[#FF8F3D]'
    },
    {
      label: 'Material Spent',
      value: `₹${materialSpent.toLocaleString()}`,
      change: `${materialUsagePercent}% of budget`,
      icon: Boxes,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Labor Budget',
      value: `₹${laborCostVal.toLocaleString()}`,
      change: '+8.3%',
      icon: Hammer,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'Timeline Progress',
      value: `${completedMilestones}/${totalMilestones} Milestones`,
      change: `${progressPercent}% complete`,
      icon: Clock,
      color: 'from-purple-500 to-purple-600'
    }
  ];

  // Map notifications to AI insights
  const aiInsights = notifications.slice(0, 3).map(n => ({
    type: n.type,
    message: n.message,
    action: n.type === 'warning' ? 'Check defects' : n.type === 'success' ? 'View timeline' : 'View live directory',
    path: n.type === 'warning' ? '/app/defects' : n.type === 'success' ? '/app/timeline' : '/app/pricing'
  }));

  // If no notifications, fallback to default insights
  if (aiInsights.length === 0) {
    aiInsights.push(
      { type: 'warning', message: 'Steel prices increased by 5% this week', action: 'View alternatives', path: '/app/pricing' },
      { type: 'success', message: 'Budget savings opportunity identified in material waste', action: 'View details', path: '/app/recommendations' }
    );
  }

  // Get active milestones for recent activity
  const recentActivities = milestones.slice(0, 4).map(m => ({
    task: m.name,
    progress: m.status === 'completed' ? 100 : m.status === 'in-progress' ? m.progress : 0,
    status: m.status
  }));


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">Dashboard</h1>
              <p className="text-white/70">Welcome back to BrickBrain</p>
            </div>

            {/* Active Project Switcher Dropdown */}
            {projects && projects.length > 0 && (
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-1.5 ml-0 md:ml-4 select-none">
                <span className="text-[10px] text-[#FF8F3D] font-bold uppercase tracking-wider">Project:</span>
                <select
                  value={project.projectName}
                  onChange={(e) => {
                    const target = projects.find(p => p.projectName === e.target.value);
                    if (target) updateProject(target);
                  }}
                  className="bg-transparent text-white text-xs font-semibold focus:outline-none cursor-pointer pr-4"
                >
                  {projects.map(p => (
                    <option key={p.projectName} value={p.projectName} className="bg-[#0B1F3A] text-white">
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
          <button
            onClick={() => navigate('/app/estimate')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer font-semibold"
          >
            <Calculator className="w-5 h-5" />
            New Estimate
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="glass rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-green-400 text-sm font-medium flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-white/60 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 glass rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">AI Insights</h2>
              <div className="flex items-center gap-2 text-[#FF6B00]">
                <Brain className="w-5 h-5" />
                <span className="text-sm font-medium">3 New</span>
              </div>
            </div>

            <div className="space-y-3">
              {aiInsights.map((insight, index) => (
                <div
                  key={index}
                  onClick={() => navigate(insight.path)}
                  className="glass rounded-xl p-4 flex items-start gap-3 hover:bg-white/5 transition-all cursor-pointer"
                >
                  {insight.type === 'warning' && (
                    <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  )}
                  {insight.type === 'success' && (
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  )}
                  {insight.type === 'info' && (
                    <TrendingUp className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-white text-sm">{insight.message}</p>
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(insight.path); }}
                      className="text-[#FF6B00] text-xs mt-1 hover:underline cursor-pointer"
                    >
                      {insight.action} →
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/app/recommendations')}
              className="w-full text-[#FF6B00] text-sm font-medium py-2 rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              View All Insights <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          <div className="glass rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-white">Recent Activity</h2>

            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-white/90 text-sm">{activity.task}</p>
                    <span className="text-white/60 text-xs">{activity.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        activity.status === 'completed'
                          ? 'bg-green-500'
                          : activity.status === 'in-progress'
                          ? 'bg-[#FF6B00]'
                          : 'bg-white/20'
                      }`}
                      style={{ width: `${activity.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => navigate('/app/progress')}
              className="w-full text-[#FF6B00] text-sm font-medium py-2 rounded-lg hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              View Progress <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => navigate('/app/materials')}
            className="glass rounded-2xl p-6 hover:bg-white/5 transition-all text-left"
          >
            <Boxes className="w-8 h-8 text-[#FF6B00] mb-3" />
            <h3 className="text-white font-semibold mb-1">Material Calculator</h3>
            <p className="text-white/60 text-sm">Calculate precise quantities</p>
          </button>

          <button
            onClick={() => navigate('/app/3d-house')}
            className="glass rounded-2xl p-6 hover:bg-white/5 transition-all text-left"
          >
            <Boxes className="w-8 h-8 text-[#FF6B00] mb-3" />
            <h3 className="text-white font-semibold mb-1">3D Visualization</h3>
            <p className="text-white/60 text-sm">View your project in 3D</p>
          </button>

          <button
            onClick={() => navigate('/app/timeline')}
            className="glass rounded-2xl p-6 hover:bg-white/5 transition-all text-left"
          >
            <Clock className="w-8 h-8 text-[#FF6B00] mb-3" />
            <h3 className="text-white font-semibold mb-1">Timeline Planner</h3>
            <p className="text-white/60 text-sm">Track project milestones</p>
          </button>
        </div>
      </div>
    </div>
  );
}
