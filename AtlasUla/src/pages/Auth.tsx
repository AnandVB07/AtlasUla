import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card, Input } from '../components/UI';
import { KeyRound, Mail, Sparkles, AlertCircle, Compass } from 'lucide-react';
import { toast } from 'react-hot-toast';

export const Auth: React.FC = () => {
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  
  // Inputs state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isForgot) {
        if (!email) {
          toast.error('Please enter your email address.');
          setLoading(false);
          return;
        }
        await resetPassword(email);
        setIsForgot(false);
      } else if (isLogin) {
        if (!email || !password) {
          toast.error('Fill in all email and password fields.');
          setLoading(false);
          return;
        }
        await login(email, password);
        navigate(from, { replace: true });
      } else {
        if (!email || !password || !name) {
          toast.error('Fill in name, email, and password fields.');
          setLoading(false);
          return;
        }
        await signup(email, password, name);
        navigate(from, { replace: true });
      }
    } catch (error: any) {
      console.error(error);
      const code = error.code || '';
      if (code.includes('auth/invalid-credential') || code.includes('wrong-password')) {
        toast.error('Invalid credentials. Check email or password.');
      } else if (code.includes('auth/email-already-in-use')) {
        toast.error('Email is already registered.');
      } else if (code.includes('auth/weak-password')) {
        toast.error('Password must be at least 6 characters.');
      } else {
        toast.error(error.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (e: any) {
      console.error(e);
      toast.error('Google Sign-in failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Background circular glows */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Main card */}
      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand */}
        <div className="flex flex-col items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center border border-white/10 glow-primary">
            <Compass className="w-6 h-6 text-white animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sora tracking-wide">
            AtlasUla
          </h2>
          <p className="text-xs text-textSecondary">Your AI Travel Companion</p>
        </div>

        <Card variant="glass" className="p-8 shadow-2xl relative border-white/10 bg-card/65 backdrop-blur-md">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white font-sora">
              {isForgot 
                ? 'Reset Password' 
                : isLogin 
                  ? 'Sign in to AtlasUla' 
                  : 'Create your account'}
            </h3>
            <p className="text-xs text-textSecondary mt-1">
              {isForgot 
                ? 'Enter your email to receive recovery link' 
                : isLogin 
                  ? 'Welcome back! Let\'s plan your next adventure.' 
                  : 'Start planning your personalized trips today.'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && !isForgot && (
              <Input
                label="Full Name"
                placeholder="John Doe"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            <Input
              label="Email Address"
              placeholder="example@domain.com"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {!isForgot && (
              <Input
                label="Password"
                placeholder="••••••••"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            )}

            {/* Remember & forgot */}
            {isLogin && !isForgot && (
              <div className="flex justify-between items-center text-xs">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-textSecondary">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded border-white/10 bg-white/5"
                  />
                  Remember Me
                </label>
                <button
                  type="button"
                  onClick={() => setIsForgot(true)}
                  className="text-primary-light hover:text-white font-semibold transition-colors cursor-pointer"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="primary"
              fullWidth
              disabled={loading}
              className="mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : isForgot ? (
                'Send Recovery Email'
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Divider */}
          {!isForgot && (
            <div className="relative my-6 text-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
              <span className="relative bg-background/5 px-3 text-[10px] uppercase font-bold text-textSecondary tracking-wider">
                Or Continue With
              </span>
            </div>
          )}

          {/* Google login */}
          {!isForgot && (
            <Button
              onClick={handleGoogleLogin}
              variant="outline"
              fullWidth
              disabled={loading}
              className="gap-2.5"
            >
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
              </svg>
              Google
            </Button>
          )}

          {/* Footer switches */}
          <div className="text-center mt-6 text-xs text-textSecondary font-medium">
            {isForgot ? (
              <button
                type="button"
                onClick={() => setIsForgot(false)}
                className="text-primary-light hover:text-white font-bold transition-colors cursor-pointer"
              >
                Back to Sign In
              </button>
            ) : isLogin ? (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(false)}
                  className="text-primary-light hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Sign Up Free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setIsLogin(true)}
                  className="text-primary-light hover:text-white font-bold transition-colors cursor-pointer"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
