import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { TrendingUp, CheckCircle, Clock, AlertCircle, Edit2, Save, MapPin, Building, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectProgress() {
  const navigate = useNavigate();
  const { milestones, project, projects, updateProject } = useApp();

  const [name, setName] = useState(project.projectName || '');
  const [location, setLocation] = useState(project.location || '');
  const [status, setStatus] = useState(project.status || 'In Progress');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');

  // Keep state updated if project details change from backend sync
  useEffect(() => {
    setName(project.projectName || '');
    setLocation(project.location || '');
    setStatus(project.status || 'In Progress');
  }, [project]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const normalizedNewName = name.trim().toLowerCase();
    const normalizedCurrentName = project.projectName.toLowerCase();

    if (normalizedNewName !== normalizedCurrentName) {
      const nameExists = projects.some(p => p.projectName.toLowerCase() === normalizedNewName);
      if (nameExists) {
        setSaveMessage('Project is there. Try other name.');
        return;
      }
    }

    setIsSaving(true);
    setSaveMessage('');
    try {
      await updateProject({
        projectName: name.trim(),
        location: location,
        status: status as 'Completed' | 'In Progress'
      });
      setSaveMessage('Project details updated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (err) {
      setSaveMessage('Error updating project details.');
    } finally {
      setIsSaving(false);
    }
  };

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
              <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
              Project Progress Tracking
            </h1>
            <p className="text-white/70 mt-1">Real-time construction progress monitoring</p>
          </div>
        </div>

        {/* Edit Project Details Card */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <Edit2 className="w-5 h-5 text-[#FF6B00]" />
            Edit Project Details
          </h2>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5" /> Project Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-white/20 text-sm"
                  placeholder="Enter project name"
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-white/60 font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Location
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-white/20 text-sm"
                  placeholder="Enter location"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-4">
                <span className="text-xs text-white/60 font-medium">Project Status:</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setStatus('In Progress')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      status === 'In Progress'
                        ? 'bg-[#FF6B00] text-white shadow-md shadow-[#FF6B00]/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatus('Completed')}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                      status === 'Completed'
                        ? 'bg-green-500 text-white shadow-md shadow-green-500/20'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Completed
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {saveMessage && (
                  <span className={`text-xs ${saveMessage.includes('Error') ? 'text-red-400' : 'text-green-400'}`}>
                    {saveMessage}
                  </span>
                )}
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-5 py-2.5 bg-[#FF6B00] hover:bg-[#FF8F3D] disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-lg shadow-[#FF6B00]/25 cursor-pointer flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </form>
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
