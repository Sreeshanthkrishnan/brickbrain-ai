import { Calendar, Clock } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ConstructionTimeline() {
  const { milestones } = useApp();

  // Mapping dynamic milestones to Gantt timeline structures
  const durations = [15, 25, 30, 20, 25, 20, 30, 15];
  
  let currentDay = 1;
  const phases = milestones.map((m, index) => {
    const duration = durations[index] || 20;
    const startDay = currentDay;
    const endDay = currentDay + duration - 1;
    currentDay += duration;

    return {
      name: m.name,
      duration: `${duration} days`,
      start: `Day ${startDay}`,
      end: `Day ${endDay}`,
      status: m.status,
      progress: m.status === 'completed' ? 100 : m.status === 'in-progress' ? m.progress : 0
    };
  });


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-[#FF6B00]" />
            Construction Timeline
          </h1>
          <p className="text-white/70 mt-1">Interactive project timeline and Gantt chart</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <Clock className="w-8 h-8 text-[#FF6B00] mb-3" />
            <p className="text-white/60 text-sm mb-1">Total Duration</p>
            <p className="text-2xl font-bold text-white">180 Days</p>
            <p className="text-white/50 text-xs mt-1">~6 months</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Calendar className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Start Date</p>
            <p className="text-2xl font-bold text-white">Jan 15, 2026</p>
            <p className="text-white/50 text-xs mt-1">Foundation begins</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Calendar className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Expected Completion</p>
            <p className="text-2xl font-bold text-white">Jul 13, 2026</p>
            <p className="text-white/50 text-xs mt-1">Final handover</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Project Phases</h2>
          <div className="space-y-4">
            {phases.map((phase, index) => (
              <div key={index} className="glass rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{phase.name}</h3>
                    <p className="text-white/50 text-sm">{phase.start} - {phase.end} ({phase.duration})</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                    phase.status === 'completed'
                      ? 'bg-green-500/20 text-green-400'
                      : phase.status === 'in-progress'
                      ? 'bg-[#FF6B00]/20 text-[#FF6B00]'
                      : 'bg-white/10 text-white/60'
                  }`}>
                    {phase.status === 'completed' ? 'Completed' : phase.status === 'in-progress' ? 'In Progress' : 'Upcoming'}
                  </div>
                </div>

                <div className="relative">
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        phase.status === 'completed'
                          ? 'bg-green-500'
                          : phase.status === 'in-progress'
                          ? 'bg-[#FF6B00]'
                          : 'bg-white/20'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-white/60 text-xs mt-1 text-right">{phase.progress}% complete</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
