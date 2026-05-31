import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectProgress() {
  const { milestones } = useApp();

  const tasks = milestones.map((m, index) => {
    let daysLeft = 0;
    if (m.status === 'in-progress') daysLeft = Math.round((100 - m.progress) * 0.3) || 5;
    else if (m.status === 'pending') daysLeft = 15 * (index - 2) + 5;

    return {
      name: m.name,
      progress: m.status === 'completed' ? 100 : m.status === 'in-progress' ? m.progress : 0,
      status: m.status === 'pending' ? 'upcoming' as const : m.status as 'completed' | 'in-progress',
      daysLeft
    };
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const upcomingCount = tasks.filter(t => t.status === 'upcoming').length;

  const overallProgress = tasks.reduce((sum, task) => sum + task.progress, 0) / tasks.length;


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
            Project Progress Tracking
          </h1>
          <p className="text-white/70 mt-1">Real-time construction progress monitoring</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="text-center mb-6">
            <p className="text-white/70 text-sm mb-2">Overall Project Progress</p>
            <h2 className="text-5xl font-bold text-white mb-4">{overallProgress.toFixed(1)}%</h2>
            <p className="text-white/60">40 days completed • 140 days remaining</p>
          </div>

          <div className="relative w-full bg-white/10 rounded-full h-4">
            <div
              className="h-4 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D]"
              style={{ width: `${overallProgress}%` }}
            ></div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-green-400 mb-1">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">{completedCount} Completed</span>
              </div>
              <p className="text-white/60 text-sm">Tasks finished</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-[#FF6B00] mb-1">
                <Clock className="w-5 h-5" />
                <span className="font-semibold">{inProgressCount} In Progress</span>
              </div>
              <p className="text-white/60 text-sm">Active tasks</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 text-white/70 mb-1">
                <AlertCircle className="w-5 h-5" />
                <span className="font-semibold">{upcomingCount} Upcoming</span>
              </div>
              <p className="text-white/60 text-sm">Scheduled</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Task Progress Details</h2>

          <div className="space-y-4">
            {tasks.map((task, index) => (
              <div key={index} className="glass rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {task.status === 'completed' && (
                      <CheckCircle className="w-5 h-5 text-green-400" />
                    )}
                    {task.status === 'in-progress' && (
                      <Clock className="w-5 h-5 text-[#FF6B00] animate-pulse" />
                    )}
                    {task.status === 'upcoming' && (
                      <AlertCircle className="w-5 h-5 text-white/40" />
                    )}
                    <h3 className="text-white font-semibold">{task.name}</h3>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-white/60 text-sm">
                      {task.status === 'completed'
                        ? 'Completed'
                        : task.status === 'in-progress'
                        ? `${task.daysLeft} days left`
                        : `Starts in ${task.daysLeft} days`}
                    </span>
                    <span className="text-white font-semibold">{task.progress}%</span>
                  </div>
                </div>

                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      task.status === 'completed'
                        ? 'bg-green-500'
                        : task.status === 'in-progress'
                        ? 'bg-[#FF6B00]'
                        : 'bg-white/20'
                    }`}
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
