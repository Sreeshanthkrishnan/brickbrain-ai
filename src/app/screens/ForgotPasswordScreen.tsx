import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Mail, KeyRound, ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const getApiUrl = () => {
    const customUrl = localStorage.getItem('brickbrain_api_url');
    if (customUrl) return customUrl;
    // Default to relative path so Vite proxy (or production relative path) works seamlessly
    return '';
  };


  // Step 1: Send OTP to real email inbox
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to send verification OTP code.');
      }

      if (data.devOtp && typeof data.devOtp === 'string' && data.devOtp.length === 6) {
        setOtp(data.devOtp.split(''));
      }
      setSuccessMsg(data.message || 'OTP code sent! Please check your email inbox.');
      setStep('otp');

    } catch (err: any) {
      setErrorMsg(err.message || 'Could not connect to authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP + Reset Password in a single 2-step request
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join('');

    if (otpCode.length !== 6) {
      setErrorMsg('Please enter the full 6-digit OTP code sent to your email.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const res = await fetch(`${getApiUrl()}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          otp: otpCode,
          newPassword: newPassword,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Password reset failed. Please verify your OTP code.');
      }

      setSuccessMsg('Password updated successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
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
        onClick={() => (step === 'otp' ? setStep('email') : navigate('/login'))}
        className="absolute top-6 left-6 z-20 text-white/70 hover:text-white flex items-center gap-2 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-5 h-5" />
        {step === 'otp' ? 'Back to Email' : 'Back'}
      </button>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="inline-flex bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-4 rounded-2xl mb-4">
              <KeyRound className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white">
              {step === 'email' ? 'Forgot Password?' : 'Reset Password'}
            </h1>
            <p className="text-white/70">
              {step === 'email'
                ? "Enter your email to receive a real 6-digit OTP code"
                : 'Enter the 6-digit OTP sent to your email and your new password'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-3 text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3 text-emerald-400 text-sm">
              <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {step === 'email' ? (
            /* STEP 1: Enter Email Form */
            <form onSubmit={handleSendOTP} className="glass rounded-3xl p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-white/90 text-sm font-medium">Email Address</label>
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
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP to Inbox...
                  </>
                ) : (
                  'Send OTP'
                )}
              </button>
            </form>
          ) : (
            /* STEP 2: Enter OTP + New Password Form (Unified 2-Step) */
            <form onSubmit={handleResetPassword} className="glass rounded-3xl p-8 space-y-6">
              <div className="space-y-4">
                <label className="text-white/90 text-sm font-medium text-center block">
                  6-Digit Verification Code
                </label>
                <div className="flex gap-2 justify-center">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOTPChange(index, e.target.value)}
                      className="w-11 h-13 bg-white/5 border border-white/10 rounded-xl text-white text-center text-xl font-semibold focus:outline-none focus:border-[#FF6B00] transition-colors"
                      required
                    />
                  ))}
                </div>

                <div className="text-right">
                  <button
                    type="button"
                    onClick={handleSendOTP}
                    disabled={loading}
                    className="text-[#FF6B00] text-xs hover:underline cursor-pointer"
                  >
                    Resend OTP Code
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-white/90 text-sm font-medium">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-12 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                      placeholder="Enter new password (min 6 chars)"
                      minLength={6}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying & Resetting...
                  </>
                ) : (
                  'Verify OTP & Reset Password'
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
