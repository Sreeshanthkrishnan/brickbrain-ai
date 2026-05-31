import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Receipt, Calendar, IndianRupee, Package } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ExpenseEntry() {
  const navigate = useNavigate();
  const { addExpense, expenses } = useApp();
  const [formData, setFormData] = useState({
    vendor: 'ABC Cement Suppliers',
    material: 'Cement',
    quantity: '50',
    unitPrice: '420',
    amount: '21000',
    date: new Date().toISOString().split('T')[0],
    category: 'Materials'
  });

  // Auto calculate amount when quantity or unit price changes
  useEffect(() => {
    const qty = Number(formData.quantity) || 0;
    const price = Number(formData.unitPrice) || 0;
    setFormData(prev => ({ ...prev, amount: (qty * price).toString() }));
  }, [formData.quantity, formData.unitPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addExpense({
      vendor: formData.vendor,
      material: `${formData.material} (${formData.quantity})`,
      quantity: formData.quantity,
      amount: Number(formData.amount)
    });
    alert('Expense recorded successfully!');
    navigate('/app/budget');
  };

  const recentExpenses = expenses.slice(0, 3).map(e => ({
    vendor: e.vendor,
    material: e.material,
    amount: `₹${e.amount.toLocaleString()}`,
    date: e.date
  }));


  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Receipt className="w-8 h-8 text-[#FF6B00]" />
            Expense Entry
          </h1>
          <p className="text-white/70 mt-1">Record and track project expenses</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 lg:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Vendor Name</label>
              <input
                type="text"
                value={formData.vendor}
                onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                placeholder="Enter vendor name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Material/Service</label>
              <div className="relative">
                <Package className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={formData.material}
                  onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  placeholder="Enter material"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Quantity</label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Unit Price</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="number"
                  value={formData.unitPrice}
                  onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  placeholder="Enter price"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Total Amount</label>
              <div className="relative">
                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                  placeholder="Total amount"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-white/90 text-sm font-medium">Date</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-white/90 text-sm font-medium">Category</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['Materials', 'Labor', 'Equipment', 'Other'].map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setFormData({ ...formData, category })}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${
                    formData.category === category
                      ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-lg shadow-[#FF6B00]/30'
                      : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate('/app/budget')}
              className="flex-1 border border-white/20 text-white py-3 rounded-xl font-semibold hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
            >
              Save Expense
            </button>
          </div>
        </form>

        <div className="glass rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {recentExpenses.map((expense, index) => (
              <div key={index} className="flex items-center justify-between glass rounded-xl p-4">
                <div>
                  <p className="text-white font-medium">{expense.material}</p>
                  <p className="text-white/60 text-sm">{expense.vendor}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#FF6B00] font-bold">{expense.amount}</p>
                  <p className="text-white/60 text-xs">{expense.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
