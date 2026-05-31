import { useState } from 'react';
import { Users, UserCheck, UserX, Phone, Calendar, IndianRupee, Plus, X } from 'lucide-react';
import { useApp, Worker } from '../context/AppContext';

export default function TeamManagement() {
  const { workers, addWorker } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [role, setRole] = useState('Mason');
  const [wage, setWage] = useState(600);
  const [status, setStatus] = useState<'Present' | 'Absent'>('Present');

  const activeCount = workers.filter(t => t.status === 'Present').length;
  const onLeaveCount = workers.filter(t => t.status === 'Absent').length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addWorker({
      name,
      role,
      wage: Number(wage),
      status
    });

    setName('');
    setRole('Mason');
    setWage(600);
    setStatus('Present');
    setShowAddModal(false);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-[#FF6B00]" />
            Team Management
          </h1>
          <p className="text-white/70 mt-1">Manage workers and site personnel</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <Users className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Total Team Members</p>
            <p className="text-3xl font-bold text-white">{workers.length}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <UserCheck className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Active Workers</p>
            <p className="text-3xl font-bold text-white">{activeCount}</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <UserX className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">On Leave</p>
            <p className="text-3xl font-bold text-white">{onLeaveCount}</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Team Directory</h2>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 flex items-center gap-1 transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {workers.map((member) => (
              <div key={member.id} className="glass rounded-2xl p-5 hover:bg-white/5 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold">{member.name}</h3>
                        <p className="text-white/60 text-sm">{member.role}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        member.status === 'Present'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {member.status === 'Present' ? 'Active' : 'On Leave'}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-white/70">
                      <p className="flex items-center gap-1.5">
                        <IndianRupee className="w-3.5 h-3.5 text-white/50" />
                        Daily Wage: ₹{member.wage}/day
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-white/50" />
                        +91 98765 {43210 + Number(member.id)}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-white/50" />
                        Joined: Jan 2026
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl w-full max-w-md p-6 border border-white/10 relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Users className="w-6 h-6 text-[#FF6B00]" />
              Add Team Member
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Rajesh Kumar"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0b1329] border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  >
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Mason (Lead)">Mason (Lead)</option>
                    <option value="Mason">Mason</option>
                    <option value="Electrician">Electrician</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Helper">Helper</option>
                  </select>
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Daily Wage (₹)</label>
                  <input
                    type="number"
                    required
                    value={wage}
                    onChange={(e) => setWage(Number(e.target.value))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm font-medium mb-1">Status</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'Present'}
                      onChange={() => setStatus('Present')}
                      className="text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span>Active</span>
                  </label>
                  <label className="flex items-center gap-2 text-white cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      checked={status === 'Absent'}
                      onChange={() => setStatus('Absent')}
                      className="text-[#FF6B00] focus:ring-[#FF6B00]"
                    />
                    <span>On Leave</span>
                  </label>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all font-semibold"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
