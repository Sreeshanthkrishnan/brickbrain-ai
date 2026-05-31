import { useState } from 'react';
import { useNavigate } from 'react-router';
import { MapPin, Home, Layers, Building2, Sparkles, Briefcase } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AIEstimationForm() {
  const navigate = useNavigate();
  const { calculateEstimate, project } = useApp();
  const [formData, setFormData] = useState({
    projectName: project.projectName || 'My Dream House',
    plotSize: project.plotSize.toString(),
    floors: project.floors.toString(),
    location: project.location,
    constructionType: project.constructionType,
    materialQuality: project.materialQuality,
    budgetRange: project.budgetRange
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    calculateEstimate({
      projectName: formData.projectName,
      plotSize: Number(formData.plotSize),
      floors: Number(formData.floors),
      location: formData.location,
      constructionType: formData.constructionType,
      materialQuality: formData.materialQuality as any,
      budgetRange: formData.budgetRange,
      rooms: project.rooms || 4,
      bedrooms: project.bedrooms || 2,
      kitchens: project.kitchens || 1
    });
    navigate('/app/estimate/result');
  };


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-[#FF6B00]" />
            AI Cost Estimation
          </h1>
          <p className="text-white/70 mt-1">Get instant accurate construction cost estimates</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-white/90 text-sm font-medium">Project Name</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                <input
                  type="text"
                  value={formData.projectName}
                  onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  placeholder="e.g. Whitefield Residential Villa"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Plot Size (sq.ft)</label>
              <div className="relative">
                <Home className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="number"
                  value={formData.plotSize}
                  onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  placeholder="Enter plot size"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Number of Floors</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <select
                  value={formData.floors}
                  onChange={(e) => setFormData({ ...formData, floors: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none"
                  required
                >
                  <option value="1">1 Floor (Ground)</option>
                  <option value="2">2 Floors (G+1)</option>
                  <option value="3">3 Floors (G+2)</option>
                  <option value="4">4 Floors (G+3)</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Location</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50 pointer-events-none" />
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl pl-12 pr-10 py-3 text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none cursor-pointer"
                  required
                >
                  <option value="" disabled>Select Location</option>
                  <optgroup label="North & West India" className="bg-[#0B1F3A] text-white font-semibold">
                    <option value="Mumbai, Maharashtra">Mumbai, Maharashtra</option>
                    <option value="Pune, Maharashtra">Pune, Maharashtra</option>
                    <option value="Rajasthan (Jaipur)">Rajasthan (Jaipur)</option>
                    <option value="Rajasthan (Udaipur)">Rajasthan (Udaipur)</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                  </optgroup>
                  <optgroup label="South India" className="bg-[#0B1F3A] text-white font-semibold">
                    <option value="Goa">Goa</option>
                    <option value="Kerala (Kochi)">Kerala (Kochi)</option>
                    <option value="Kerala (Trivandrum)">Kerala (Trivandrum)</option>
                    <option value="Andhra Pradesh (Visakhapatnam)">Andhra Pradesh (Visakhapatnam)</option>
                    <option value="Andhra Pradesh (Vijayawada)">Andhra Pradesh (Vijayawada)</option>
                    <option value="Telangana (Hyderabad)">Telangana (Hyderabad)</option>
                    <option value="Bangalore, Karnataka">Bangalore, Karnataka</option>
                    <option value="Chennai, Tamil Nadu">Chennai, Tamil Nadu</option>
                  </optgroup>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-white/60">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                  </svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Construction Type</label>
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <select
                  value={formData.constructionType}
                  onChange={(e) => setFormData({ ...formData, constructionType: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] transition-colors appearance-none"
                  required
                >
                  <option value="Residential">Residential</option>
                  <option value="Commercial">Commercial</option>
                  <option value="Industrial">Industrial</option>
                  <option value="Mixed-Use">Mixed-Use</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm font-medium">Material Quality</label>
            <div className="grid grid-cols-3 gap-3">
              {['Basic', 'Standard', 'Premium'].map((quality) => (
                <button
                  key={quality}
                  type="button"
                  onClick={() => setFormData({ ...formData, materialQuality: quality })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    formData.materialQuality === quality
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-lg shadow-[#FF6B00]/30'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {quality}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm font-medium">Budget Range</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['20-30 Lakhs', '30-40 Lakhs', '40-50 Lakhs', '50+ Lakhs'].map((range) => (
                <button
                  key={range}
                  type="button"
                  onClick={() => setFormData({ ...formData, budgetRange: range })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    formData.budgetRange === range
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-lg shadow-[#FF6B00]/30'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  ₹{range}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Generate Estimate
            </button>
          </div>
        </form>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-3">How AI Estimation Works</h3>
          <div className="space-y-2 text-white/70 text-sm">
            <p>• Analyzes real-time material costs from 500+ suppliers</p>
            <p>• Considers local labor rates and availability</p>
            <p>• Factors in location-specific construction regulations</p>
            <p>• Provides 95% accuracy with confidence scoring</p>
          </div>
        </div>
      </div>
    </div>
  );
}
