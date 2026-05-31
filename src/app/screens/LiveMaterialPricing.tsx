import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, RefreshCw, MapPin, Search, Plus, Trash2, ShoppingCart, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PricingItem {
  name: string;
  basePrice: number;
  change: string;
  trend: 'up' | 'down' | 'stable';
  suppliers: number;
}

interface RequiredMaterial {
  name: string;
  pricePerUnit: number;
  quantity: number;
}

export default function LiveMaterialPricing() {
  const { requiredList, addToRequiredList, updateQuantity, removeFromRequiredList, updateCartPrices } = useApp();
  const [city, setCity] = useState('Bangalore, Karnataka');
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('Just now');
  const [searchQuery, setSearchQuery] = useState('');

  const getCityPriceFactor = () => {
    if (city.includes('Mumbai')) return 1.12;
    if (city.includes('Pune')) return 1.08;
    if (city.includes('Delhi')) return 1.08;
    if (city.includes('Rajasthan')) return 0.90;
    if (city.includes('Goa')) return 0.98;
    if (city.includes('Kerala')) return 1.04;
    if (city.includes('Andhra')) return 1.02;
    if (city.includes('Telangana')) return 1.03;
    if (city.includes('Bangalore')) return 1.00;
    if (city.includes('Chennai')) return 0.95;
    return 1.0;
  };

  const factor = getCityPriceFactor();

  const pricing: PricingItem[] = [
    { name: 'Cement (50kg bag)', basePrice: 420, change: '+2.4%', trend: 'up', suppliers: 24 },
    { name: 'Steel TMT (per kg)', basePrice: 68, change: '+5.2%', trend: 'up', suppliers: 18 },
    { name: 'Sand (per cu.ft)', basePrice: 55, change: '-1.8%', trend: 'down', suppliers: 31 },
    { name: 'Bricks (per piece)', basePrice: 9, change: '0%', trend: 'stable', suppliers: 42 },
    { name: 'Aggregate 20mm (per cu.ft)', basePrice: 80, change: '+0.8%', trend: 'up', suppliers: 15 },
    { name: 'Marble (per sq.ft)', basePrice: 185, change: '-3.2%', trend: 'down', suppliers: 28 },
    { name: 'Granite (per sq.ft)', basePrice: 95, change: '+1.5%', trend: 'up', suppliers: 22 },
    { name: 'Paint Premium (per liter)', basePrice: 300, change: '-0.5%', trend: 'down', suppliers: 35 }
  ];

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
      const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastUpdated(`Refreshed at ${time}`);
    }, 1000);
  };

  // Filter materials based on search query
  const filteredPricing = pricing.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Compute grand total
  const checklistTotal = requiredList.reduce((sum, item) => sum + (item.pricePerUnit * item.quantity), 0);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-8 h-8 text-[#FF6B00]" />
              Live Material Pricing
            </h1>
            <p className="text-white/70 mt-1">Real-time prices from 500+ verified suppliers</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              className="glass px-4 py-2 rounded-xl text-white hover:bg-white/10 transition-all flex items-center gap-2"
              disabled={refreshing}
            >
              <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin text-[#FF6B00]' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* City Filter Dropdown */}
        <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#FF6B00]" />
            <span className="text-white font-medium">Select Region:</span>
          </div>
          <div className="relative w-full sm:w-64">
            <select
              value={city}
              onChange={(e) => {
                const cityName = e.target.value;
                setCity(cityName);
                
                // Update pricing factors on existing list items if needed
                const localFactor = cityName.includes('Mumbai') ? 1.12
                  : cityName.includes('Pune') ? 1.08
                  : cityName.includes('Delhi') ? 1.08
                  : cityName.includes('Rajasthan') ? 0.90
                  : cityName.includes('Goa') ? 0.98
                  : cityName.includes('Kerala') ? 1.04
                  : cityName.includes('Andhra') ? 1.02
                  : cityName.includes('Telangana') ? 1.03
                  : cityName.includes('Chennai') ? 0.95
                  : 1.0;

                updateCartPrices(localFactor, pricing);
              }}
              className="w-full bg-[#0B1F3A] border border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-white focus:outline-none focus:border-[#FF6B00] cursor-pointer appearance-none"
            >
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

        {/* Live status banner */}
        <div className="glass rounded-2xl p-4 flex justify-between items-center text-sm flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-white/70">Live Updates Connected</span>
          </div>
          <span className="text-white/50">{lastUpdated}</span>
        </div>

        {/* REQUIRED MATERIALS CHECKLIST */}
        <div className="glass rounded-3xl p-6 border border-white/10">
          <div className="flex items-center gap-2.5 mb-4">
            <ShoppingCart className="w-6 h-6 text-[#FF6B00]" />
            <h2 className="text-xl font-bold text-white">Required Materials Checklist</h2>
          </div>

          {requiredList.length === 0 ? (
            <div className="text-center py-8 text-white/50 border border-dashed border-white/10 rounded-2xl bg-white/0">
              <p>Your required materials checklist is empty.</p>
              <p className="text-xs text-white/40 mt-1">Use the search bar or browse below to add required materials.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/10 text-white/60 text-sm">
                      <th className="py-2.5">Material</th>
                      <th className="py-2.5">Unit Price ({city.split(',')[0]})</th>
                      <th className="py-2.5">Quantity Required</th>
                      <th className="py-2.5">Subtotal</th>
                      <th className="py-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requiredList.map((item, index) => (
                      <tr key={index} className="border-b border-white/5 text-white/90 text-sm">
                        <td className="py-3 font-medium">{item.name}</td>
                        <td className="py-3 text-[#FF8F3D]">₹{item.pricePerUnit.toLocaleString()}</td>
                        <td className="py-3">
                          <input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.name, parseInt(e.target.value) || 0)}
                            className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-white focus:outline-none focus:border-[#FF6B00]"
                          />
                        </td>
                        <td className="py-3 font-semibold">₹{(item.pricePerUnit * item.quantity).toLocaleString()}</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => removeFromRequiredList(item.name)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <div>
                  <p className="text-white/50 text-xs">Estimated Materials Cost</p>
                  <p className="text-3xl font-extrabold text-[#FF6B00]">₹{checklistTotal.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SEARCH BAR CARD */}
        <div className="glass rounded-2xl p-4 flex items-center relative">
          <Search className="absolute left-7 w-5 h-5 text-white/40" />
          <input
            type="text"
            placeholder="Search material types (e.g. Cement, Steel, Granite...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
          />
        </div>

        {/* PRICING GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredPricing.map((item, index) => {
            const currentPrice = Math.round(item.basePrice * factor);
            const isAdded = requiredList.some(r => r.name === item.name);
            const addedQty = requiredList.find(r => r.name === item.name)?.quantity || 0;

            return (
              <div key={index} className="glass rounded-2xl p-6 hover:bg-white/5 transition-all flex flex-col justify-between gap-4 border border-white/5">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold mb-1 text-lg">{item.name}</h3>
                      <p className="text-white/50 text-xs">{item.suppliers} suppliers in {city.split(',')[0]}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
                        item.trend === 'up'
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                          : item.trend === 'down'
                          ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                          : 'bg-white/5 text-white/60 border border-white/10'
                      }`}
                    >
                      {item.trend === 'up' && <TrendingUp className="w-3.5 h-3.5" />}
                      {item.trend === 'down' && <TrendingDown className="w-3.5 h-3.5" />}
                      {item.change}
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-white/60 text-xs mb-1">Current Price</p>
                    <p className="text-3xl font-bold text-[#FF6B00]">₹{currentPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                  <span className="text-white/40 text-xs">Updated hourly</span>
                  <button
                    onClick={() => addToRequiredList(item.name, currentPrice)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      isAdded 
                        ? 'bg-green-500/20 border border-green-500/30 text-green-400 hover:bg-green-500/30'
                        : 'bg-white/5 border border-white/10 text-white hover:bg-white/10 hover:border-[#FF6B00]/40'
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Added ({addedQty})
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5 text-[#FF6B00]" />
                        Add to Checklist
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredPricing.length === 0 && (
            <div className="col-span-full text-center py-12 text-white/40">
              <p>No materials matching "{searchQuery}" found.</p>
            </div>
          )}
        </div>

        {/* Pricing Trends summary */}
        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Price Trends In {city.split(',')[0]} This Week</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Steel prices increased significantly</span>
              <span className="text-red-400 font-medium">+{Math.round(5.2 * factor * 10) / 10}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Marble prices dropped</span>
              <span className="text-green-400 font-medium">-{Math.round(3.2 / factor * 10) / 10}%</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-white/70">Cement prices stable with minor increase</span>
              <span className="text-yellow-400 font-medium">+{Math.round(2.4 * factor * 10) / 10}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
