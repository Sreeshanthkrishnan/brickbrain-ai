import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, KeyRound, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('otp');
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    alert('OTP verified! Redirecting to reset password...');
    navigate('/login');
  };

  const handleOTPChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0B1F3A] via-[#1A3556] to-[#0B1F3A]"></div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FF6B00] rounded-full opacity-10 blur-3xl"></div>

      <button
        onClick={() => navigate('/login')}
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-4 rounded-2xl mb-4">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">Forgot Password?</h1>
            <p className="text-white/70">
              {step === 'email'
                ? "Enter your email and we'll send you an OTP"
                : 'Enter the 6-digit OTP sent to your email'}
            </p>
          </div>

          {step === 'email' ? (
            <form onSubmit={handleSendOTP} className="glass rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-white/90 text-sm">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="glass rounded-3xl p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex gap-3 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      className="w-12 h-14 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:border-[#FF6B00] transition-colors"
                    />
                  ))}
                </div>

                <button
                  type="button"
                  className="w-full text-[#FF6B00] text-sm hover:underline"
                >
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all"
              >
                Verify OTP
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
