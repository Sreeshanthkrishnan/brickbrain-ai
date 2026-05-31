import { Target, CheckCircle, Circle, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectMilestones() {
  const { milestones, toggleMilestone } = useApp();

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Target className="w-8 h-8 text-[#FF6B00]" />
            Project Milestones
          </h1>
          <p className="text-white/70 mt-1">Track key construction milestones</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-white/60 text-sm">Overall Progress</p>
              <p className="text-2xl font-bold text-white">{progressPercent}%</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Milestones Completed</p>
              <p className="text-2xl font-bold text-[#FF6B00]">{completedCount} of {totalCount}</p>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-3">
            <div
              className="h-3 rounded-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>


        <div className="glass rounded-3xl p-6">
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-white/10"></div>

            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="relative flex gap-4">
                  <div className={`relative z-10 flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
                    milestone.status === 'completed'
                      ? 'bg-green-500'
                      : milestone.status === 'in-progress'
                      ? 'bg-[#FF6B00]'
                      : 'bg-white/10'
                  }`}>
                    {milestone.status === 'completed' && <CheckCircle className="w-6 h-6 text-white" />}
                    {milestone.status === 'in-progress' && <Clock className="w-6 h-6 text-white animate-pulse" />}
                    {milestone.status === 'pending' && <Circle className="w-6 h-6 text-white/60" />}
                  </div>

                  <div className="flex-1 glass rounded-2xl p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-white font-semibold text-lg">{milestone.name}</h3>
                      <span className="text-white/60 text-sm whitespace-nowrap ml-4">
                        {milestone.date !== 'Pending' ? milestone.date : 'Upcoming'}
                      </span>
                    </div>
                    <p className="text-white/70 text-sm">
                      {milestone.status === 'completed'
                        ? `Milestone successfully achieved and locked.`
                        : milestone.status === 'in-progress'
                        ? `Currently in progress, running at ${milestone.progress}% completion.`
                        : `Upcoming construction phase schedule pending.`}
                    </p>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                        milestone.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : milestone.status === 'in-progress'
                          ? 'bg-[#FF6B00]/20 text-[#FF6B00]'
                          : 'bg-white/10 text-white/60'
                      }`}>
                        {milestone.status === 'completed' && 'Completed'}
                        {milestone.status === 'in-progress' && 'In Progress'}
                        {milestone.status === 'pending' && 'Pending'}
                      </div>
                      <button
                        onClick={() => toggleMilestone(milestone.id)}
                        className="text-xs bg-white/5 hover:bg-[#FF6B00] border border-white/10 text-white hover:border-transparent py-1.5 px-3 rounded-lg transition-colors cursor-pointer"
                      >
                        {milestone.status === 'completed' ? 'Reopen Phase' : 'Mark Complete'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
