import { useApp } from '../context/AppContext';
import { UserCheck, Calendar, Check, X } from 'lucide-react';

export default function AttendanceMonitoring() {
  const { workers, setAttendance } = useApp();

  const presentCount = workers.filter(t => t.status === 'Present').length;
  const absentCount = workers.filter(t => t.status === 'Absent').length;

  const todayStr = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <UserCheck className="w-8 h-8 text-[#FF6B00]" />
            Attendance Monitoring
          </h1>
          <p className="text-white/70 mt-1">Daily worker attendance tracking</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm mb-1">Today's Date</p>
              <p className="text-2xl font-bold text-white">{todayStr}</p>
            </div>
            <Calendar className="w-12 h-12 text-[#FF6B00]" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-1">Total Workers</p>
            <p className="text-3xl font-bold text-white">{workers.length}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-1">Present</p>
            <p className="text-3xl font-bold text-green-400">{presentCount}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <p className="text-white/60 text-sm mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-400">{absentCount}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Today's Attendance</h2>
            <p className="text-xs text-white/50">* Click toggle buttons or badges to change attendance</p>
          </div>

          <div className="space-y-3">
            {workers.map((worker) => (
              <div key={worker.id} className="glass rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] rounded-full flex items-center justify-center text-white font-bold">
                    {worker.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{worker.name}</p>
                    <p className="text-white/60 text-sm">{worker.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-white/60 text-sm">Check-in</p>
                    <p className="text-white font-medium">{worker.status === 'Present' ? '08:00 AM' : '-'}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setAttendance(worker.id, 'Present')}
                      className={`p-2 rounded-lg transition-all ${
                        worker.status === 'Present'
                          ? 'bg-green-500 text-white font-semibold shadow-md shadow-green-500/20'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                      title="Mark Present"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setAttendance(worker.id, 'Absent')}
                      className={`p-2 rounded-lg transition-all ${
                        worker.status === 'Absent'
                          ? 'bg-red-500 text-white font-semibold shadow-md shadow-red-500/20'
                          : 'bg-white/5 text-white/40 hover:bg-white/10'
                      }`}
                      title="Mark Absent"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <span
                    onClick={() => setAttendance(worker.id, worker.status === 'Present' ? 'Absent' : 'Present')}
                    className={`px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all ${
                      worker.status === 'Present'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {worker.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Weekly Summary</h3>
          <div className="grid grid-cols-7 gap-2 text-center">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const count = index === 4 ? presentCount : Math.floor(Math.random() * 2) + (workers.length - 2);
              return (
                <div key={index} className="glass rounded-lg p-3">
                  <p className="text-white/60 text-xs mb-2">{day}</p>
                  <p className="text-white font-bold text-sm">
                    {count}/{workers.length}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
