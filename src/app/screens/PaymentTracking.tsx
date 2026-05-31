import { useState, useEffect } from 'react';
import { CreditCard, CheckCircle, Clock, Plus, Receipt, IndianRupee } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function PaymentTracking() {
  const { invoices, payInvoice, addExpense } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState({
    vendor: '',
    material: '',
    quantity: '',
    unitPrice: '',
    amount: ''
  });

  // Auto calculate amount when quantity or unit price changes
  useEffect(() => {
    const qty = Number(formData.quantity) || 0;
    const price = Number(formData.unitPrice) || 0;
    setFormData(prev => ({ ...prev, amount: (qty * price).toString() }));
  }, [formData.quantity, formData.unitPrice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor || !formData.material || !formData.amount) return;
    
    addExpense({
      vendor: formData.vendor,
      material: `${formData.material} (${formData.quantity})`,
      quantity: formData.quantity,
      amount: Number(formData.amount)
    });
    
    alert('Expense recorded and added to schedule!');
    setFormData({ vendor: '', material: '', quantity: '', unitPrice: '', amount: '' });
    setShowAddModal(false);
  };

  const paidInvoices = invoices.filter(inv => inv.status === 'Paid');
  const pendingInvoices = invoices.filter(inv => inv.status === 'Pending');

  const totalPaid = paidInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = pendingInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalUpcoming = Math.round(totalPaid * 0.35); // Simulated upcoming schedule

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <CreditCard className="w-8 h-8 text-[#FF6B00]" />
              Payment Tracking
            </h1>
            <p className="text-white/70 mt-1">Monitor milestone-based payments and log expenses</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-4 py-2.5 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center gap-2 cursor-pointer font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Expense
          </button>
        </div>

        {/* Record Expense Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <div className="glass rounded-3xl p-6 max-w-md w-full border border-white/20 space-y-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center gap-2">
                <Receipt className="w-5 h-5 text-[#FF6B00]" />
                <h3 className="text-white font-bold text-xl">Record Project Expense</h3>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Vendor / Payee</label>
                  <input
                    type="text"
                    required
                    value={formData.vendor}
                    onChange={e => setFormData(prev => ({ ...prev, vendor: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="e.g. Balaji Steel Works"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-white/80 text-sm">Material / Service</label>
                  <input
                    type="text"
                    required
                    value={formData.material}
                    onChange={e => setFormData(prev => ({ ...prev, material: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="e.g. Steel rebar reinforcement"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-white/80 text-sm">Quantity</label>
                    <input
                      type="number"
                      required
                      value={formData.quantity}
                      onChange={e => setFormData(prev => ({ ...prev, quantity: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
                      placeholder="e.g. 50"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-white/80 text-sm">Unit Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={formData.unitPrice}
                      onChange={e => setFormData(prev => ({ ...prev, unitPrice: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
                      placeholder="e.g. 68"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-white/80 text-sm flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-[#FF6B00]" /> Total Amount (₹)
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={e => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#FF6B00]"
                    placeholder="Total amount"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-2 rounded-xl border border-white/10 text-white hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2 rounded-xl bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white font-semibold hover:shadow-lg"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass rounded-2xl p-6">
            <CheckCircle className="w-8 h-8 text-green-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Paid</p>
            <p className="text-3xl font-bold text-white">₹{(totalPaid / 100000).toFixed(2)}L</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <Clock className="w-8 h-8 text-yellow-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Pending</p>
            <p className="text-3xl font-bold text-white">₹{(totalPending / 100000).toFixed(2)}L</p>
          </div>

          <div className="glass rounded-2xl p-6">
            <CreditCard className="w-8 h-8 text-blue-400 mb-3" />
            <p className="text-white/60 text-sm mb-1">Upcoming</p>
            <p className="text-3xl font-bold text-white">₹{(totalUpcoming / 100000).toFixed(2)}L</p>
          </div>
        </div>

        {/* Payment list */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Payment Schedule</h2>

          <div className="space-y-4">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="glass rounded-xl p-5 border border-white/5 hover:bg-white/5 transition-all">
                <div className="flex items-start justify-between mb-3 flex-wrap gap-4">
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">{invoice.vendor}</h3>
                    <p className="text-white/60 text-sm">{invoice.date}</p>
                    {invoice.status === 'Paid' && (
                      <p className="text-white/50 text-xs mt-1">via Digital Transfer</p>
                    )}
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-white mb-2">₹{invoice.amount.toLocaleString()}</p>
                    <span className={`px-4 py-1 rounded-full text-sm font-medium ${
                      invoice.status === 'Paid'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {invoice.status}
                    </span>
                  </div>
                </div>

                {invoice.status === 'Pending' && (
                  <button
                    onClick={() => payInvoice(invoice.id)}
                    className="w-full mt-3 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer"
                  >
                    Make Payment
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
