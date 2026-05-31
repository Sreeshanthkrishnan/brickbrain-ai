import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Briefcase, MapPin, Calendar, Building2, Sparkles, Search, Plus, Trash2, Box, Layers, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ProjectsScreen() {
  const navigate = useNavigate();
  const { projects, deleteProject, updateProject } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'Completed' | 'In Progress'>('Completed');

  const handleDelete = (name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from your portfolio?`)) {
      deleteProject(name);
    }
  };

  // Filter projects by search query and active status tab
  const filteredProjects = projects.filter(proj => {
    const matchesSearch = proj.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          proj.constructionType.toLowerCase().includes(searchQuery.toLowerCase());
    
    const projStatus = proj.status || 'In Progress';
    const matchesStatus = projStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Briefcase className="w-8 h-8 text-[#FF6B00]" />
              Projects Portfolio
            </h1>
            <p className="text-white/70 mt-1">Review your calculated estimates and saved builds</p>
          </div>
          <button
            onClick={() => navigate('/app/estimate')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-5 py-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/40 transition-all flex items-center gap-2 cursor-pointer font-semibold"
          >
            <Plus className="w-5 h-5" />
            New Project Estimate
          </button>
        </div>

        {/* Search and Filters */}
        <div className="glass rounded-3xl p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {(['Completed', 'In Progress'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    statusFilter === status
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-lg shadow-[#FF6B00]/30'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {status} Projects
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search projects, locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj, idx) => {
            const materialSpent = Math.round(proj.totalCost * 0.55);
            const cementCount = Math.round((materialSpent * 0.3) / 420);
            const steelCount = Math.round((materialSpent * 0.25) / 68);
            const brickCount = Math.round((materialSpent * 0.2) / 9);

            const projStatus = proj.status || 'In Progress';
            const projDate = proj.date || 'Active';

            return (
              <div
                key={`${proj.projectName}-${idx}`}
                className={`glass border rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group ${
                  projStatus === 'Completed' 
                    ? 'from-green-500/5 to-emerald-500/5 border-green-500/20 text-green-400' 
                    : 'from-blue-500/5 to-indigo-500/5 border-blue-500/20 text-blue-400'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-xs font-mono">PRJ-{(idx + 8000).toString()}</span>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        projStatus === 'Completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-blue-500/20 text-blue-400'
                      }`}>
                        {projStatus}
                      </span>
                      <button
                        onClick={() => handleDelete(proj.projectName)}
                        className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                        title="Delete project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white group-hover:text-[#FF8F3D] transition-colors">
                      {proj.projectName}
                    </h3>
                    <p className="text-white/60 text-sm leading-relaxed">
                      Custom {proj.constructionType.toLowerCase()} build configured with {proj.materialQuality.toLowerCase()} grade materials and high energy efficiency.
                    </p>
                  </div>

                  {/* Specs Info Grid */}
                  <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-white/70 border-t border-white/5">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      <span className="truncate">{proj.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      <span>{projDate}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      <span>{proj.floors} Floor{proj.floors > 1 ? 's' : ''} ({proj.plotSize * proj.floors} sq.ft)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-[#FF6B00] flex-shrink-0" />
                      <span>{proj.rooms} Rooms ({proj.bedrooms} Bed, {proj.kitchens} Kit)</span>
                    </div>
                  </div>

                  {/* Detailed material estimation summary */}
                  <div className="bg-black/35 rounded-2xl p-4 space-y-2 text-xs text-white/70 border border-white/5">
                    <p className="font-semibold text-white flex items-center gap-1">
                      <Box className="w-3.5 h-3.5 text-[#FF6B00]" />
                      Estimated Material Composition:
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-[10px]">
                      <div>
                        <span className="text-white/40 block">Cement</span>
                        <span className="font-bold text-white">{cementCount.toLocaleString()} Bags</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Steel Rebar</span>
                        <span className="font-bold text-white">{steelCount.toLocaleString()} kg</span>
                      </div>
                      <div>
                        <span className="text-white/40 block">Red Bricks</span>
                        <span className="font-bold text-white">{brickCount.toLocaleString()} pcs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Display */}
                <div className="flex items-end justify-between pt-6 mt-6 border-t border-white/5">
                  <div>
                    <p className="text-white/40 text-[10px] uppercase font-semibold">Total Cost/Budget</p>
                    <p className="text-2xl font-extrabold text-white">₹{proj.totalCost.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => {
                      updateProject(proj);
                      navigate('/app/dashboard');
                    }}
                    className="flex items-center gap-1 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/25 text-[#FF6B00] text-xs font-bold px-4 py-2 rounded-xl transition-all cursor-pointer border border-[#FF6B00]/20"
                  >
                    Load Project <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProjects.length === 0 && (
            <div className="col-span-full text-center py-16 text-white/40 glass rounded-3xl border border-white/10">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20 text-[#FF6B00]" />
              <p className="text-lg font-medium text-white">No {statusFilter.toLowerCase()} projects found</p>
              <p className="text-sm text-white/50 mt-1 max-w-md mx-auto">
                Start by estimating construction costs and customized parameters on the AI Estimator screen.
              </p>
              <button
                onClick={() => navigate('/app/estimate')}
                className="mt-6 inline-flex items-center gap-2 bg-[#FF6B00]/10 hover:bg-[#FF6B00]/20 text-[#FF6B00] border border-[#FF6B00]/30 px-5 py-2.5 rounded-xl font-semibold transition-all cursor-pointer"
              >
                Estimate First Project <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
