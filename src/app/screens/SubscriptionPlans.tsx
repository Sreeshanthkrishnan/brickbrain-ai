import { useState } from 'react';
import { CreditCard, Check, X, ShieldCheck, Sparkles } from 'lucide-react';

export default function SubscriptionPlans() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'form' | 'success'>('idle');
  const [currentPlan, setCurrentPlan] = useState('Basic (Free)');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const plans = [
    {
      name: 'Basic',
      price: billingCycle === 'monthly' ? 999 : 799,
      features: ['1 Active Project', 'Basic AI Estimation', 'Material Calculator', 'Budget Tracking', 'Email Support'],
      popular: false
    },
    {
      name: 'Professional',
      price: billingCycle === 'monthly' ? 2499 : 1999,
      features: ['5 Active Projects', 'Advanced AI Recommendations', '3D Visualization', 'Team Collaboration', 'Priority Support', 'Digital Twin', 'Defect Detection'],
      popular: true
    },
    {
      name: 'Enterprise',
      price: billingCycle === 'monthly' ? 4999 : 3999,
      features: ['Unlimited Projects', 'Full AI Suite', 'White-label Reports', 'Dedicated Account Manager', '24/7 Premium Support', 'Custom Integrations', 'API Access', 'Training Sessions'],
      popular: false
    }
  ];

  const handleSubscribeClick = (planName: string) => {
    setSelectedPlan(planName);
    setPaymentStep('form');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTimeout(() => {
      setPaymentStep('success');
      if (selectedPlan) {
        setCurrentPlan(`${selectedPlan} (${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'})`);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            Choose Your <span className="text-[#FF6B00]">Plan</span>
          </h1>
          <p className="text-white/70 text-lg">Scale your construction planning with BrickBrain AI</p>

          <div className="mt-4 inline-flex items-center gap-1 text-sm bg-white/5 p-1 rounded-full border border-white/10">
            <span className="text-white/50 text-xs px-2">Current: {currentPlan}</span>
          </div>

          <div className="mt-6 flex justify-center items-center gap-3">
            <span className={`text-sm ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-white/60'}`}>Monthly</span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-12 h-6 bg-[#FF6B00] rounded-full relative transition-colors"
            >
              <div
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                  billingCycle === 'yearly' ? 'right-1' : 'left-1'
                }`}
              ></div>
            </button>
            <span className={`text-sm flex items-center gap-1.5 ${billingCycle === 'yearly' ? 'text-[#FF6B00] font-bold' : 'text-white/60'}`}>
              Yearly (Save 20%)
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`glass rounded-3xl p-8 relative flex flex-col justify-between transition-all hover:scale-[1.02] ${
                plan.popular ? 'border-2 border-[#FF6B00] bg-gradient-to-b from-white/5 to-[#FF6B00]/5' : ''
              }`}
            >
              <div>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] px-6 py-1 rounded-full text-white text-sm font-semibold">
                    Most Popular
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-1">
                    <span className="text-white/60 text-lg">₹</span>
                    <span className="text-4xl font-bold text-white">
                      {plan.price.toLocaleString()}
                    </span>
                    <span className="text-white/60 text-sm">/mo</span>
                  </div>
                  <p className="text-white/50 text-xs">
                    {billingCycle === 'yearly' ? `Billed ₹${(plan.price * 12).toLocaleString()}/year` : 'Billed monthly'}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-[#FF6B00] flex-shrink-0 mt-0.5" />
                      <span className="text-white/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => handleSubscribeClick(plan.name)}
                className={`w-full py-3 rounded-xl font-semibold transition-all ${
                  currentPlan.startsWith(plan.name)
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : plan.popular
                    ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white hover:shadow-lg hover:shadow-[#FF6B00]/50'
                    : 'glass text-white hover:bg-white/10'
                }`}
              >
                {currentPlan.startsWith(plan.name) ? 'Active Plan' : 'Subscribe Now'}
              </button>
            </div>
          ))}
        </div>

        <div className="glass rounded-2xl p-6 text-center">
          <CreditCard className="w-12 h-12 text-[#FF6B00] mx-auto mb-3" />
          <h3 className="text-white font-semibold mb-2">All Plans Include</h3>
          <p className="text-white/70 text-sm">14-day free trial • Cancel anytime • Secure payments • Money-back guarantee</p>
        </div>
      </div>

      {paymentStep !== 'idle' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl w-full max-w-md p-6 border border-white/10 relative">
            <button
              onClick={() => setPaymentStep('idle')}
              className="absolute top-4 right-4 text-white/70 hover:text-white"
            >
              <X className="w-6 h-6" />
            </button>

            {paymentStep === 'form' ? (
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <CreditCard className="w-6 h-6 text-[#FF6B00]" />
                  <h2 className="text-2xl font-bold text-white">Subscribe to {selectedPlan}</h2>
                </div>
                <p className="text-white/60 text-sm">
                  Simulating secure checkout for ₹
                  {plans.find((p) => p.name === selectedPlan)?.price.toLocaleString()}/mo
                </p>

                <div className="pt-2">
                  <label className="block text-white/70 text-sm font-medium mb-1">Cardholder Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1">Card Number</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').substring(0, 16))}
                    placeholder="4111 2222 3333 4444"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1">Expiry (MM/YY)</label>
                    <input
                      type="text"
                      required
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value.substring(0, 5))}
                      placeholder="12/28"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-1">CVV</label>
                    <input
                      type="password"
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').substring(0, 3))}
                      placeholder="***"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-white/60 bg-white/5 p-3 rounded-xl border border-white/5">
                  <ShieldCheck className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span>Your mock transaction is fully encrypted and safe.</span>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/40 transition-all font-semibold"
                >
                  Pay & Upgrade
                </button>
              </form>
            ) : (
              <div className="text-center py-6 space-y-4">
                <div className="w-16 h-16 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white">Upgrade Successful!</h3>
                  <p className="text-white/70 mt-1">
                    Welcome to the <strong>{selectedPlan}</strong> plan.
                  </p>
                </div>
                <p className="text-xs text-white/50">
                  Your billing cycle has started. A mock receipt has been sent to demo@brickbrain.ai.
                </p>
                <button
                  onClick={() => setPaymentStep('idle')}
                  className="w-full bg-[#FF6B00] text-white py-2 rounded-xl font-medium transition-all"
                >
                  Return to Plans
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
