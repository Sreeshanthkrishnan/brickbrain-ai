import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { User, Mail, Phone, MapPin, Building2, Calendar, Check, X, Lock, LogOut } from 'lucide-react';

export default function UserProfile() {
  const navigate = useNavigate();
  const { user, updateUser, project, expenses, logout } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name);
  const [role, setRole] = useState(user.role);
  const [email, setEmail] = useState(user.email);
  const [phoneVal, setPhoneVal] = useState(user.phone);

  // Security password states
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      alert('Please fill out all password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    alert('Password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const stats = [
    { label: 'Active Projects', value: '1' },
    { label: 'Completed', value: '0' },
    { label: 'Total Spent', value: `₹${(totalSpent / 100000).toFixed(2)}L` },
    { label: 'Member Since', value: 'Jan 2026' }
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name,
      role,
      email,
      phone: phoneVal
    });
    setIsEditing(false);
  };

  const getInitials = (userName: string) => {
    return userName
      ? userName
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .substring(0, 2)
      : 'JD';
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <User className="w-8 h-8 text-[#FF6B00]" />
            User Profile
          </h1>
          <p className="text-white/70 mt-1">Manage your account information</p>
        </div>

        <div className="glass rounded-3xl p-8">
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] rounded-full flex items-center justify-center text-white font-bold text-3xl mb-4 shadow-lg shadow-[#FF6B00]/20">
              {getInitials(user.name)}
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.name}</h2>
            <p className="text-[#FF6B00] font-medium">{user.role}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <div key={index} className="glass rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-white/60 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Role / Persona</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-[#0b1329] text-white border border-white/10 rounded-xl px-3 py-2 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  >
                    <option value="Homeowner">Homeowner</option>
                    <option value="Contractor">Contractor</option>
                    <option value="Site Supervisor">Site Supervisor</option>
                    <option value="Architect">Architect</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    value={phoneVal}
                    onChange={(e) => setPhoneVal(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/40 flex items-center justify-center gap-2 transition-all"
                >
                  <Check className="w-5 h-5" />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setName(user.name);
                    setRole(user.role);
                    setEmail(user.email);
                    setPhoneVal(user.phone);
                    setIsEditing(false);
                  }}
                  className="px-5 bg-white/10 text-white rounded-xl font-semibold hover:bg-white/20 flex items-center justify-center gap-2 transition-all"
                >
                  <X className="w-5 h-5" />
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <Mail className="w-6 h-6 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm">Email</p>
                  <p className="text-white font-medium">{user.email}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <Phone className="w-6 h-6 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm">Phone</p>
                  <p className="text-white font-medium">{user.phone}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <MapPin className="w-6 h-6 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm">Location</p>
                  <p className="text-white font-medium">{project.location}</p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <Building2 className="w-6 h-6 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm">Current Project</p>
                  <p className="text-white font-medium">
                    {project.floors}-Story {project.constructionType} ({project.plotSize} sq.ft)
                  </p>
                </div>
              </div>

              <div className="glass rounded-xl p-5 flex items-center gap-4">
                <Calendar className="w-6 h-6 text-[#FF6B00]" />
                <div className="flex-1">
                  <p className="text-white/60 text-sm">Member Since</p>
                  <p className="text-white font-medium">January 15, 2026</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer"
                >
                  Edit Profile
                </button>
                <button
                  onClick={() => {
                    logout();
                    navigate('/welcome');
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-600/50 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-5 h-5" />
                  Log Out
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Security Settings Card */}
        <div className="glass rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <Lock className="w-6 h-6 text-[#FF6B00]" />
            Security Settings
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="block text-white/70 text-sm font-medium">Old Password</label>
                <input
                  type="password"
                  required
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-white/70 text-sm font-medium">New Password</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
              <div className="space-y-1">
                <label className="block text-white/70 text-sm font-medium">Confirm New Password</label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] transition-colors placeholder:text-white/20"
                  placeholder="••••••••"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/40 transition-all text-sm cursor-pointer"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
