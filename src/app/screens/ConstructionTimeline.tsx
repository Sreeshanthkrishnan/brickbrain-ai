import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

export default function ConstructionTimeline() {
  const navigate = useNavigate();
  const { milestones } = useApp();

  const getCalendarDate = (dayNum: number) => {
    const startDate = new Date('2026-01-15');
    startDate.setDate(startDate.getDate() + dayNum - 1);
    return startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

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
      startCal: getCalendarDate(startDay),
      endCal: getCalendarDate(endDay),
      status: m.status,
      progress: m.status === 'completed' ? 100 : m.status === 'in-progress' ? m.progress : 0,
      startDay,
      endDay
    };
  });


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
              <Calendar className="w-8 h-8 text-[#FF6B00]" />
              Construction Timeline
            </h1>
            <p className="text-white/70 mt-1">Interactive project timeline and Gantt chart</p>
          </div>
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

        {/* Visual Gantt Chart Planner */}
        <div className="glass rounded-3xl p-6 overflow-x-auto">
          <h2 className="text-xl font-bold text-white mb-6">Start-to-Finish Gantt Planner</h2>
          
          {/* Gantt Header / Timeline Scale */}
          <div className="relative h-8 border-b border-white/10 mb-4 min-w-[600px]">
            <div className="absolute left-[0%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 1</div>
            <div className="absolute left-[16.6%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 30</div>
            <div className="absolute left-[33.3%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 60</div>
            <div className="absolute left-[50%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 90</div>
            <div className="absolute left-[66.6%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 120</div>
            <div className="absolute left-[83.3%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 150</div>
            <div className="absolute left-[100%] -translate-x-1/2 text-[10px] text-white/40 font-mono">Day 180</div>
            
            {/* Grid lines */}
            <div className="absolute left-0 top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[16.6%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[33.3%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[50%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[66.6%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[83.3%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
            <div className="absolute left-[100%] top-8 bottom-0 w-px bg-white/5 h-[280px]"></div>
          </div>

          {/* Gantt Rows */}
          <div className="space-y-4 min-w-[600px] relative">
            {phases.map((phase, index) => {
              const duration = durations[index] || 20;
              const startDay = phase.startDay;
              const leftOffset = ((startDay - 1) / 180) * 100;
              const width = (duration / 180) * 100;

              return (
                <div key={index} className="grid grid-cols-4 items-center gap-4 py-2 border-b border-white/5 last:border-0">
                  <div className="col-span-1 pr-2">
                    <p className="text-white font-semibold text-xs truncate" title={phase.name}>{phase.name}</p>
                    <p className="text-white/40 text-[10px] font-mono">{duration} days</p>
                  </div>
                  <div className="col-span-3 relative h-8 bg-white/5 rounded-lg overflow-hidden border border-white/5 flex items-center">
                    <div
                      className="absolute top-0 bottom-0 bg-gradient-to-r from-white/10 to-white/5 rounded-lg flex items-center justify-between px-2 text-[9px] font-mono text-white/70"
                      style={{
                        left: `${leftOffset}%`,
                        width: `${width}%`,
                        minWidth: '60px'
                      }}
                    >
                      <div
                        className={`absolute left-0 top-0 bottom-0 rounded-lg ${
                          phase.status === 'completed'
                            ? 'bg-gradient-to-r from-green-500/40 to-emerald-500/40'
                            : phase.status === 'in-progress'
                            ? 'bg-gradient-to-r from-[#FF6B00]/40 to-[#FF8F3D]/40 animate-pulse'
                            : 'bg-white/5'
                        }`}
                        style={{ width: `${phase.progress}%` }}
                      />
                      <span className="z-10 pl-1 font-bold">{phase.startCal}</span>
                      <span className="z-10 pr-1 font-bold">{phase.endCal}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tracker: Finished vs Remaining */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Finished Checklist */}
          <div className="glass rounded-3xl p-6 border border-green-500/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
              Finished ({phases.filter(p => p.status === 'completed').length})
            </h3>
            <div className="space-y-3">
              {phases.filter(p => p.status === 'completed').map((phase, idx) => (
                <div key={idx} className="bg-green-500/5 border border-green-500/20 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white text-sm font-semibold">{phase.name}</h4>
                    <p className="text-green-400 text-xs mt-0.5 font-medium">Completed</p>
                  </div>
                  <span className="text-white/60 text-xs font-mono">{phase.endCal}</span>
                </div>
              ))}
              {phases.filter(p => p.status === 'completed').length === 0 && (
                <p className="text-white/40 text-xs py-4 text-center">No completed phases yet.</p>
              )}
            </div>
          </div>

          {/* Want to Finish Checklist */}
          <div className="glass rounded-3xl p-6 border border-[#FF6B00]/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00]"></span>
              Want to Finish ({phases.filter(p => p.status !== 'completed').length})
            </h3>
            <div className="space-y-3">
              {phases.filter(p => p.status !== 'completed').map((phase, idx) => (
                <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="text-white text-sm font-semibold">{phase.name}</h4>
                    <p className="text-white/40 text-xs mt-0.5">{phase.duration} • Current: {phase.progress}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[#FF6B00] text-[10px] uppercase font-bold tracking-wider">Deadline</p>
                    <p className="text-white font-semibold text-xs font-mono">{phase.endCal}</p>
                  </div>
                </div>
              ))}
              {phases.filter(p => p.status !== 'completed').length === 0 && (
                <p className="text-green-400 text-xs py-4 text-center">🎉 All phases completed successfully!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
