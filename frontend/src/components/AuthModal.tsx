import { useState } from 'react';
import { X, Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../lib/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [resetOtp, setResetOtp] = useState('');
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth(); // We'll handle signup/verify manually here to manage state
  const { success, error: toastError } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isForgotPassword) {
        await api.forgotPassword({ email });
        success('Password reset OTP sent to your email!');
        setIsForgotPassword(false);
        setIsResetPassword(true);
      } else if (isResetPassword) {
        await api.resetPassword({ email, otp: resetOtp, password: newPassword });
        success('Password reset successfully! You can now sign in.');
        setIsResetPassword(false);
        setIsSignUp(false);
      } else if (isSignUp) {
        if (!showOTP) {
          // Step 1: Request Signup (Send OTP)
          await api.signup({ name, email, password, passwordConfirm: password });
          setShowOTP(true);
          success('OTP sent to your email!');
        } else {
          // Step 2: Verify OTP
          const res = await api.verifyOTP({ email, otp });
          localStorage.setItem('token', res.data.token);
          localStorage.setItem('user', JSON.stringify(res.data.data.user));
          window.location.reload();
        }
      } else {
        await signIn({ email, password });
        success('Welcome back!');
        onClose();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
      toastError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    window.location.href = `${backendUrl}/api/v1/users/auth/google`;
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative overflow-hidden border border-white/10">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-white mb-2">
              {isForgotPassword ? 'Forgot Password' : isResetPassword ? 'Reset Password' : isSignUp ? (showOTP ? 'Verify Email' : 'Create Account') : 'Welcome Back'}
            </h2>
            <p className="text-white/60">
              {isForgotPassword ? 'Enter your email to receive a reset OTP' : isResetPassword ? 'Enter the OTP from your email and your new password' : isSignUp ? (showOTP ? 'Enter the code sent to your email' : 'Start your adventure today') : 'Sign in to continue'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && !showOTP && (
              <div className="relative">
                <User className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                  placeholder="Full Name"
                  required
                />
              </div>
            )}

            {isForgotPassword && (
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                  placeholder="Email Address"
                  required
                />
              </div>
            )}

            {isResetPassword && (
              <>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                  <input
                    type="text"
                    value={resetOtp}
                    onChange={(e) => setResetOtp(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                    placeholder="Enter Reset OTP"
                    required
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                    placeholder="New Password"
                    required
                  />
                </div>
              </>
            )}

            {!showOTP && !isForgotPassword && !isResetPassword && (
              <>
                <div className="relative">
                  <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                    placeholder="Email Address"
                    required
                  />
                </div>

                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-5 h-5 text-white/40" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-emerald-500/50 transition"
                    placeholder="Password"
                    required
                  />
                </div>
                {!isSignUp && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-white/40 hover:text-white transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}
              </>
            )}

            {showOTP && (
              <div className="relative">
                <div className="flex justify-center space-x-2">
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full text-center tracking-[0.5em] text-2xl font-bold py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/20 focus:outline-none focus:border-emerald-500/50 transition"
                    placeholder="000000"
                    maxLength={6}
                    required
                  />
                </div>
                <p className="text-center text-xs text-white/40 mt-2">Check your email for the OTP</p>
              </div>
            )}

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'Processing...' : isForgotPassword ? 'Send Reset OTP' : isResetPassword ? 'Reset Password' : isSignUp ? (showOTP ? 'Verify & Create Account' : 'Send OTP') : 'Sign In'}</span>
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          {!showOTP && !isForgotPassword && !isResetPassword && (
            <>
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-slate-900 px-2 text-white/40">Or continue with</span>
                </div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-white/90 transition flex items-center justify-center space-x-2"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
                <span>Sign in with Google</span>
              </button>
            </>
          )}

          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (isForgotPassword || isResetPassword) {
                  setIsForgotPassword(false);
                  setIsResetPassword(false);
                } else {
                  setIsSignUp(!isSignUp);
                }
                setShowOTP(false);
                setError('');
              }}
              className="text-white/60 hover:text-white transition text-sm hover:underline"
            >
              {isForgotPassword || isResetPassword ? 'Back to Login' : isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
