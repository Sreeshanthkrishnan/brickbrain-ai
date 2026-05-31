import { useState } from 'react';
import { Newspaper, Search, Calendar, Clock, ArrowUpRight, ShieldAlert, Sparkles, BookOpen, DollarSign } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  category: 'Construction' | 'Materials' | 'Safety' | 'Budget';
  summary: string;
  content: string;
  date: string;
  readTime: string;
  color: string;
  icon: any;
}

export default function AINewsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const categories = ['All', 'Construction', 'Materials', 'Safety', 'Budget'];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Revolutionizing Home Construction with 3D Printed Concrete',
      category: 'Construction',
      summary: 'How 3D printing is reducing material waste by 60% and lowering home building costs in suburban developments.',
      content: '3D concrete printing is shifting from a futuristic novelty to a practical construction method. By using automated robotic arms that layer specialized concrete mixes, builders can create complex curved walls and structural components in a fraction of standard framing times. This technology reduces material waste by up to 60% and significantly limits active labor requirements, making it a promising solution for affordable and sustainable housing. Industry experts predict that by 2030, nearly 10% of new residential starts in major urban areas will utilize some form of 3D printing technology.',
      date: 'May 30, 2026',
      readTime: '4 min read',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      icon: Sparkles
    },
    {
      id: '2',
      title: 'Steel and Cement Prices Project 4% Drop Next Month',
      category: 'Materials',
      summary: 'Market analysis forecasts an easing of import tariffs and increased local production, leading to price stabilization.',
      content: 'A recent comprehensive analysis of global and domestic logistics indices reveals an impending price adjustment in key construction raw materials. Due to the suspension of local environmental tariffs on coal and a 12% rise in domestic steel mill output, the wholesale price of structural steel and grade-53 OPC cement is projected to fall by approximately 3.5% to 5% across major regions like Bangalore, Mumbai, and Delhi. Builders are advised to delay bulk procurement by 2–3 weeks to leverage these upcoming savings.',
      date: 'May 28, 2026',
      readTime: '3 min read',
      color: 'from-[#FF6B00]/20 to-[#FF8F3D]/20 border-[#FF6B00]/30',
      icon: DollarSign
    },
    {
      id: '3',
      title: 'Essential Monsoon Site Safety Protocols for High-Rise Structures',
      category: 'Safety',
      summary: 'As monsoon season approaches, review critical scaffolding safety rules and electrical insulation practices.',
      content: 'Site safety becomes paramount during monsoon cycles. Wet scaffolding, muddy footing hazards, and waterlogged excavation pits pose major structural risks. The National Safety Council recommends weekly scaffold anchor inspection checks, installing rubber-matted wire lines, grounding all portable power generators, and enforcing high-visibility rain gear. Ensuring proper site drainage and tarp coverings for exposed rebar can prevent costly rust damage and work stoppages.',
      date: 'May 25, 2026',
      readTime: '5 min read',
      color: 'from-red-500/20 to-orange-500/20 border-red-500/30',
      icon: ShieldAlert
    },
    {
      id: '4',
      title: '5 Smart Budget-Saving Tips for Foundation Laying',
      category: 'Budget',
      summary: 'Learn how to optimize trenching depths, choose local aggregate grades, and reduce concrete wastage.',
      content: 'The foundation consumes roughly 15-20% of your total construction budget. Saving costs here requires precision rather than compromising quality. Key strategies include: 1) Executing soil test profiles early to avoid over-engineering footings, 2) Ordering ready-mix concrete (RMC) from local suppliers within a 15km radius to reduce transit delays, 3) Reusing wooden formwork shuttering up to 4 times, and 4) Sourcing local stone aggregate grades. Preventing cement dust runoff can reduce overall waste by 8%.',
      date: 'May 22, 2026',
      readTime: '6 min read',
      color: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
      icon: BookOpen
    },
    {
      id: '5',
      title: 'Green Concrete: The Future of Environmentally Friendly Pillars',
      category: 'Construction',
      summary: 'How fly ash and industrial slag composites are creating carbon-negative foundations with higher compression strength.',
      content: 'Green concrete, which replaces Portland cement with industrial fly ash, blast furnace slag, or silica fume, is gaining massive traction. This composite not only diverts waste from landfills but also reacts chemically to form a tighter molecular matrix, which yields up to 15% higher compressive strength over a 90-day curing cycle. In addition to shrinking the project carbon footprint, green concrete is highly resistant to acid rain and sulfate corrosion, making it perfect for coastal regions like Goa and Kerala.',
      date: 'May 18, 2026',
      readTime: '4 min read',
      color: 'from-blue-500/20 to-indigo-500/20 border-blue-500/30',
      icon: Sparkles
    },
    {
      id: '6',
      title: 'Aggregates and Sand Market Supply Chain Update',
      category: 'Materials',
      summary: 'New government sand mining quotas in western states set to relieve dry supply shortages and lower truck rates.',
      content: 'Supply constraints for fine river sand are expected to ease following the release of new riverbed mining quotas. Over the past six months, sand price inflation reached record highs, forcing many builders to pivot to Manufactured Sand (M-Sand). The recent policy change will increase natural sand supply by an estimated 25%, bringing truck rates down by ₹2,000 to ₹3,500. M-Sand remain the recommended alternative for structural plastering due to its uniform grain grading and lack of organic impurities.',
      date: 'May 15, 2026',
      readTime: '3 min read',
      color: 'from-[#FF6B00]/20 to-[#FF8F3D]/20 border-[#FF6B00]/30',
      icon: DollarSign
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Newspaper className="w-8 h-8 text-[#FF6B00]" />
              AI News & Insights
            </h1>
            <p className="text-white/70 mt-1">Daily updates on construction, material prices, safety, and smart budgeting</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="glass rounded-3xl p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => {
                    setSelectedCategory(category);
                    setSelectedArticle(null);
                  }}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-lg shadow-[#FF6B00]/30'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {category === 'All' ? 'All Feed' : `${category} News`}
                </button>
              ))}
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <input
                type="text"
                placeholder="Search news and tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
            </div>
          </div>
        </div>

        {selectedArticle ? (
          /* Detailed Article View */
          <div className="glass rounded-3xl p-6 lg:p-8 space-y-6">
            <button
              onClick={() => setSelectedArticle(null)}
              className="text-[#FF6B00] hover:underline text-sm font-medium flex items-center gap-1 cursor-pointer"
            >
              ← Back to all news
            </button>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-[#FF6B00]/20 text-[#FF6B00] text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
                  {selectedArticle.category}
                </span>
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {selectedArticle.date}
                </span>
                <span className="text-white/50 text-xs flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {selectedArticle.readTime}
                </span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white leading-tight">{selectedArticle.title}</h2>
              <p className="text-white/80 font-medium text-lg border-l-4 border-[#FF6B00] pl-4 italic">
                {selectedArticle.summary}
              </p>
              <div className="text-white/70 leading-relaxed text-base pt-4 space-y-4">
                {selectedArticle.content.split('\n\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article) => {
              const IconComponent = article.icon;
              return (
                <div
                  key={article.id}
                  onClick={() => setSelectedArticle(article)}
                  className={`glass border rounded-3xl p-6 flex flex-col justify-between hover:scale-[1.02] hover:bg-white/5 transition-all duration-300 cursor-pointer group ${article.color}`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="bg-white/10 text-white text-xs font-semibold px-2.5 py-1 rounded-lg uppercase tracking-wider">
                        {article.category}
                      </span>
                      <div className="bg-white/5 p-2.5 rounded-xl group-hover:bg-[#FF6B00]/20 transition-colors">
                        <IconComponent className="w-5 h-5 text-[#FF6B00]" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-white font-bold text-lg leading-snug group-hover:text-[#FF8F3D] transition-colors line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-white/60 text-sm line-clamp-3">
                        {article.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-6 mt-6 border-t border-white/5 text-xs text-white/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{article.date}</span>
                    </div>
                    <div className="flex items-center gap-2 group-hover:text-[#FF6B00] transition-colors">
                      <span>Read More</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredArticles.length === 0 && (
              <div className="col-span-full text-center py-16 text-white/50">
                <Newspaper className="w-16 h-16 mx-auto mb-4 opacity-25" />
                <p className="text-lg font-medium">No articles match your search criteria</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="text-[#FF6B00] hover:underline mt-2 cursor-pointer text-sm"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
