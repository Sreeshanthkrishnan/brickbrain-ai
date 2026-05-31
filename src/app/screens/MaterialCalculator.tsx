import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Package, TrendingUp, Receipt, Send, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function MaterialCalculator() {
  const navigate = useNavigate();
  const { project, addInvoice } = useApp();
  const [addedPayments, setAddedPayments] = useState<Record<string, boolean>>({});
  
  const [customExpense, setCustomExpense] = useState({
    material: 'Cement',
    customName: '',
    vendor: 'Ultratech Cement Depot',
    quantity: '',
    unitPrice: '',
  });

  const area = project.plotSize * project.floors;

  // Dynamically calculate based on area and materials portion of estimate
  const cementBags = Math.round(area * 0.4);
  const cementCost = cementBags * 420;

  const steelKg = Math.round(area * 4.2);
  const steelCost = steelKg * 68;

  const sandCuFt = Math.round(area * 1.8);
  const sandCost = sandCuFt * 55;

  const bricksPcs = Math.round(area * 11.5);
  const bricksCost = bricksPcs * 9;

  const aggregateCuFt = Math.round(area * 0.85);
  const aggregateCost = aggregateCuFt * 80;

  const paintLiters = Math.round(area * 0.18);
  const paintCost = paintLiters * 300;

  const materials = [
    { name: 'Cement (50kg bags)', quantity: `${cementBags.toLocaleString()} bags`, cost: `₹${cementCost.toLocaleString()}`, rawCost: cementCost, defaultVendor: 'Ultratech Cement Depot', icon: '🏗️' },
    { name: 'Steel (TMT Bars)', quantity: `${steelKg.toLocaleString()} kg`, cost: `₹${steelCost.toLocaleString()}`, rawCost: steelCost, defaultVendor: 'Tata Tiscon Distributors', icon: '⚙️' },
    { name: 'Sand (Cubic Feet)', quantity: `${sandCuFt.toLocaleString()} cu.ft`, cost: `₹${sandCost.toLocaleString()}`, rawCost: sandCost, defaultVendor: 'Sagar Sand Suppliers', icon: '🏖️' },
    { name: 'Bricks (Standard)', quantity: `${bricksPcs.toLocaleString()} pieces`, cost: `₹${bricksCost.toLocaleString()}`, rawCost: bricksCost, defaultVendor: 'Kamdhenu Brick Kiln', icon: '🧱' },
    { name: 'Aggregate (20mm)', quantity: `${aggregateCuFt.toLocaleString()} cu.ft`, cost: `₹${aggregateCost.toLocaleString()}`, rawCost: aggregateCost, defaultVendor: 'Standard Blue Metal', icon: '🪨' },
    { name: 'Paint (Liters)', quantity: `${paintLiters.toLocaleString()} liters`, cost: `₹${paintCost.toLocaleString()}`, rawCost: paintCost, defaultVendor: 'Asian Paints Dealer', icon: '🎨' }
  ];

  const handleAddMaterialToPayments = (name: string, vendor: string, amount: number) => {
    addInvoice({
      vendor,
      amount,
      status: 'Pending'
    });
    setAddedPayments(prev => ({ ...prev, [name]: true }));
    setTimeout(() => {
      setAddedPayments(prev => ({ ...prev, [name]: false }));
    }, 3000);
  };

  const handleAddCustomExpense = (e: React.FormEvent) => {
    e.preventDefault();
    const name = customExpense.material === 'Custom' ? customExpense.customName : customExpense.material;
    const qty = Number(customExpense.quantity) || 0;
    const price = Number(customExpense.unitPrice) || 0;
    const total = qty * price;

    if (!name || qty <= 0 || price <= 0) {
      alert('Please enter valid quantity and price details.');
      return;
    }

    addInvoice({
      vendor: customExpense.vendor || 'Local Vendor',
      amount: total,
      status: 'Pending'
    });

    alert(`Successfully sent pending payment request for ${name} (Amount: ₹${total.toLocaleString()}) to Payment Tracking!`);
    setCustomExpense({
      material: 'Cement',
      customName: '',
      vendor: 'Ultratech Cement Depot',
      quantity: '',
      unitPrice: '',
    });
    navigate('/app/payments');
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Package className="w-8 h-8 text-[#FF6B00]" />
            Material Calculator
          </h1>
          <p className="text-white/70 mt-1">Precise quantity calculations and payment ledger integration</p>
        </div>

        {/* Required Materials Pre-calculated Card Grid */}
        <div className="glass rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Estimated Materials Needed</h2>
            <button
              onClick={() => navigate('/app/pricing')}
              className="text-[#FF6B00] text-sm font-medium hover:underline flex items-center gap-1 cursor-pointer"
            >
              View Live Pricing <TrendingUp className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {materials.map((material, index) => (
              <div key={index} className="glass rounded-2xl p-5 hover:bg-white/5 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{material.icon}</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{material.quantity.split(' ')[0]}</p>
                      <p className="text-white/50 text-xs">{material.quantity.split(' ').slice(1).join(' ')}</p>
                    </div>
                  </div>
                  <h3 className="text-white font-semibold mb-2">{material.name}</h3>
                </div>
                
                <div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/10 mb-3">
                    <span className="text-white/60 text-sm">Estimated Cost</span>
                    <span className="text-[#FF6B00] font-bold">{material.cost}</span>
                  </div>
                  
                  <button
                    onClick={() => handleAddMaterialToPayments(material.name, material.defaultVendor, material.rawCost)}
                    className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      addedPayments[material.name]
                        ? 'bg-green-500/20 border-green-500/30 text-green-400'
                        : 'bg-[#FF6B00]/10 border-[#FF6B00]/25 text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white'
                    }`}
                  >
                    {addedPayments[material.name] ? (
                      <>
                        <Check className="w-3.5 h-3.5" /> Added to Schedule
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" /> Add to Payments
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Input Form and Breakdown Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Custom Invoice Form */}
          <div className="glass rounded-3xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2 mb-2">
              <Receipt className="w-5 h-5 text-[#FF6B00]" />
              Send Material Expense to Payment Ledger
            </h3>
            <p className="text-white/70 text-xs">
              Calculate a specific custom quantity and dispatch it to your Payment Schedule as a <strong className="text-yellow-400">Pending</strong> invoice.
            </p>
            <form onSubmit={handleAddCustomExpense} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-semibold">Material Type</label>
                  <select
                    value={customExpense.material}
                    onChange={e => {
                      const mat = e.target.value;
                      let vendor = 'Local Vendor';
                      if (mat === 'Cement') vendor = 'Ultratech Cement Depot';
                      if (mat === 'Steel') vendor = 'Tata Tiscon Distributors';
                      if (mat === 'Sand') vendor = 'Sagar Sand Suppliers';
                      if (mat === 'Bricks') vendor = 'Kamdhenu Brick Kiln';
                      if (mat === 'Aggregate') vendor = 'Standard Blue Metal';
                      if (mat === 'Paint') vendor = 'Asian Paints Dealer';
                      setCustomExpense(prev => ({ ...prev, material: mat, vendor }));
                    }}
                    className="w-full bg-[#0b1329] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                  >
                    <option value="Cement">Cement</option>
                    <option value="Steel">Steel</option>
                    <option value="Sand">Sand</option>
                    <option value="Bricks">Bricks</option>
                    <option value="Aggregate">Aggregate</option>
                    <option value="Paint">Paint</option>
                    <option value="Custom">Custom Material...</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-semibold">Vendor / Supplier</label>
                  <input
                    type="text"
                    required
                    value={customExpense.vendor}
                    onChange={e => setCustomExpense(prev => ({ ...prev, vendor: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="Supplier name"
                  />
                </div>
              </div>

              {customExpense.material === 'Custom' && (
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-semibold">Custom Material Name</label>
                  <input
                    type="text"
                    required
                    value={customExpense.customName}
                    onChange={e => setCustomExpense(prev => ({ ...prev, customName: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="Enter custom material name (e.g. Electrical Cables)"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-semibold">Quantity</label>
                  <input
                    type="number"
                    required
                    value={customExpense.quantity}
                    onChange={e => setCustomExpense(prev => ({ ...prev, quantity: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="e.g. 100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/80 text-xs font-semibold">Unit Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={customExpense.unitPrice}
                    onChange={e => setCustomExpense(prev => ({ ...prev, unitPrice: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="e.g. 420"
                  />
                </div>
              </div>

              {Number(customExpense.quantity) > 0 && Number(customExpense.unitPrice) > 0 && (
                <div className="bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-xl p-3 flex justify-between items-center text-xs">
                  <span className="text-white/70">Calculated Total Cost:</span>
                  <span className="text-[#FF6B00] font-bold text-sm">
                    ₹{(Number(customExpense.quantity) * Number(customExpense.unitPrice)).toLocaleString()}
                  </span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white text-xs font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> Send to Payment Tracking
              </button>
            </form>
          </div>

          {/* Calculation Breakdown */}
          <div className="glass rounded-3xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-semibold mb-4 border-b border-white/10 pb-2">Calculation Breakdown</h3>
              <div className="space-y-3 text-white/70 text-sm">
                <div className="flex justify-between">
                  <span>Total Built-up Area</span>
                  <span className="text-white font-medium">{area.toLocaleString()} sq.ft</span>
                </div>
                <div className="flex justify-between">
                  <span>Number of Floors</span>
                  <span className="text-white font-medium">{project.floors} ({project.floors > 1 ? `G+${project.floors - 1}` : 'Ground Floor'})</span>
                </div>
                <div className="flex justify-between">
                  <span>Wall Thickness</span>
                  <span className="text-white font-medium">9 inches (Standard)</span>
                </div>
                <div className="flex justify-between">
                  <span>Foundation Type</span>
                  <span className="text-white font-medium">RCC with Plinth Beam</span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-white/10 mt-6 flex justify-between items-center">
              <span className="text-white font-semibold">Total Material Cost Estimate</span>
              <span className="text-[#FF6B00] font-bold text-xl">₹{project.breakdown.materials.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => navigate('/app/estimate')}
            className="glass text-white py-3 rounded-xl font-semibold hover:bg-white/10 transition-all cursor-pointer"
          >
            Recalculate Estimate
          </button>
          <button
            onClick={() => navigate('/app/payments')}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer text-center"
          >
            Go to Payment Ledger
          </button>
        </div>
      </div>
    </div>
  );
}
