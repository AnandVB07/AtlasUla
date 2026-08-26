import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { Plane, Compass, Lock, Mail, User, Shield, Sparkles } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Auth: React.FC = () => {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setIsForgotPassword(false);
      } else if (isLogin) {
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        await signup(email, password, displayName);
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Google Auth Cancelled.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row items-stretch justify-center relative select-none">
      {/* Decorative backdrop glow */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />

      {/* Brand Side Panel */}
      <div className="hidden md:flex md:w-[45%] bg-gradient-to-br from-card to-background border-r border-white/5 flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#7C5CFF_1px,transparent_1px)] [background-size:24px_24px]" />
        
        {/* Logo */}
        <div className="flex items-center gap-2 relative z-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center glow-primary">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora font-black text-xl tracking-tight text-white">AtlasUla</span>
        </div>

        {/* Brand message */}
        <div className="space-y-4 relative z-10 max-w-sm">
          <div className="inline-flex items-center gap-1 bg-white/5 border border-white/5 rounded-full px-3 py-1 text-[10px] font-bold text-accent uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-accent animate-pulse" /> Travel gamified
          </div>
          <h2 className="text-3xl font-black text-white font-sora tracking-tight leading-snug">
            Your travel itinerary is waiting.
          </h2>
          <p className="text-xs text-textSecondary leading-relaxed">
            Plan multi-day excursions with AI, monitor trip budgets, earn achievements, and catalog your memories inside an encrypted scrapbook.
          </p>
        </div>

        {/* Footer info */}
        <p className="text-[10px] text-textSecondary/40 relative z-10">
          © {new Date().getFullYear()} AtlasUla. All rights reserved.
        </p>
      </div>

      {/* Interactive Form Panel */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12">
        <Card variant="solid" className="w-full max-w-md p-8 bg-card/40 border-white/5">
          <div className="text-center space-y-2 mb-6">
            <h1 className="text-2xl font-black text-white font-sora tracking-tight">
              {isForgotPassword ? 'Reset Password' : isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-textSecondary">
              {isForgotPassword 
                ? 'Enter your email to receive recovery instructions.' 
                : isLogin 
                  ? 'Access your saved trips and travel profile.' 
                  : 'Start planning your next adventure with Gemini AI.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Display Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-3.5 w-4.5 h-4.5 text-textSecondary" />
                  <input
                    type="text"
                    placeholder="e.g. John Doe"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 w-4.5 h-4.5 text-textSecondary" />
                <input
                  type="email"
                  placeholder="e.g. pilot@atlasula.ai"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Password</label>
                  {isLogin && (
                    <button 
                      type="button" 
                      onClick={() => setIsForgotPassword(true)}
                      className="text-[10px] text-primary-light hover:underline font-semibold cursor-pointer"
                    >
                      Forgot?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-3.5 w-4.5 h-4.5 text-textSecondary" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full glass-input rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none"
                  />
                </div>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="py-3 text-sm font-bold uppercase tracking-wider cursor-pointer"
            >
              {loading 
                ? 'Syncing details...' 
                : isForgotPassword 
                  ? 'Send Recovery link' 
                  : isLogin 
                    ? 'Sign In' 
                    : 'Sign Up'}
            </Button>
          </form>

          {/* Social Auth Separator */}
          {!isForgotPassword && (
            <div className="space-y-4 mt-6">
              <div className="relative flex py-2 items-center">
                <div className="flex-grow border-t border-white/5"></div>
                <span className="flex-shrink mx-4 text-[10px] text-textSecondary/40 font-bold uppercase tracking-wider">Or continue with</span>
                <div className="flex-grow border-t border-white/5"></div>
              </div>

              <button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full py-2.5 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 flex items-center justify-center gap-2 hover:bg-white/10 transition-all text-xs font-semibold cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                Google Authentication
              </button>
            </div>
          )}

          {/* Toggle buttons */}
          <div className="text-center mt-6 text-xs text-textSecondary font-semibold">
            {isForgotPassword ? (
              <button 
                onClick={() => setIsForgotPassword(false)}
                className="text-primary-light hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            ) : isLogin ? (
              <span>
                Don't have an account?{' '}
                <button 
                  onClick={() => setIsLogin(false)}
                  className="text-primary-light hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button 
                  onClick={() => setIsLogin(true)}
                  className="text-primary-light hover:underline cursor-pointer"
                >
                  Sign In instead
                </button>
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
