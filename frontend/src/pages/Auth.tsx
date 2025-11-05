import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react';
import { toast } from 'sonner';
import gsap from 'gsap';
import { Separator } from '@/components/ui/separator';

type AuthMode = 'login' | 'signup' | 'forgot';

interface LoginForm {
  email: string;
  password: string;
}

interface SignupForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface ForgotForm {
  email: string;
}

const Auth = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, isAuthenticated } = useStore();
  
  const loginForm = useForm<LoginForm>();
  const signupForm = useForm<SignupForm>();
  const forgotForm = useForm<ForgotForm>();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    // Logo animation
    gsap.fromTo(
      '.auth-logo',
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    );

    // Card animation
    gsap.fromTo(
      '.auth-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, delay: 0.2, ease: 'power2.out' }
    );

    // Floating shapes animation
    gsap.to('.floating-shape', {
      y: '+=20',
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
      stagger: 0.5
    });
  }, []);

  useEffect(() => {
    if (mode === 'signup') {
      gsap.fromTo(
        '.form-field',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.1, ease: 'power2.out' }
      );
    }
  }, [mode]);

  const calculatePasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.match(/[a-z]/)) strength += 25;
    if (password.match(/[A-Z]/)) strength += 25;
    if (password.match(/[0-9]/)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const onLogin = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Welcome back to NihonLab! 🎌');
      navigate('/');
    } catch (error) {
      toast.error('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  const onSignup = async (data: SignupForm) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    try {
      await signup(data.name, data.email, data.password);
      
      // Success animation
      gsap.fromTo(
        '.success-icon',
        { scale: 0, rotation: -180 },
        { scale: 1, rotation: 0, duration: 0.6, ease: 'elastic.out(1, 0.5)' }
      );
      
      toast.success('Account created successfully! 🎉');
      setTimeout(() => navigate('/'), 500);
    } catch (error) {
      toast.error('Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const onGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogle();
      toast.success('Welcome to NihonLab! 🎌');
      navigate('/app/dashboard');
    } catch (error) {
      toast.error('Google sign-in failed');
    } finally {
      setIsLoading(false);
    }
  };

  const onForgotPassword = async (data: ForgotForm) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResetSent(true);
      
      gsap.fromTo(
        '.reset-popup',
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
      );
      
      toast.success('Password reset link sent to your email! 📧');
    } catch (error) {
      toast.error('Failed to send reset link');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950 relative overflow-hidden flex items-center justify-center p-4">
      {/* Floating shapes background */}
      <div className="floating-shape absolute top-20 left-20 w-64 h-64 bg-indigo-200/30 dark:bg-indigo-500/10 rounded-full blur-3xl" />
      <div className="floating-shape absolute bottom-20 right-20 w-96 h-96 bg-purple-200/30 dark:bg-purple-500/10 rounded-full blur-3xl" />
      <div className="floating-shape absolute top-1/2 left-1/2 w-72 h-72 bg-pink-200/30 dark:bg-pink-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <motion.div
          className="auth-logo text-center mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            NihonLab
          </h1>
          <p className="text-muted-foreground mt-2 font-body">
            Master Japanese with Motion and Fun
          </p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="auth-card bg-card rounded-2xl shadow-2xl p-8 backdrop-blur-sm border border-border"
          layout
        >
          <AnimatePresence mode="wait">
            {mode === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-6 text-foreground">
                  Welcome Back
                </h2>
                <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                  <div className="form-field space-y-2">
                    <Label htmlFor="email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...loginForm.register('email', { required: true })}
                      />
                    </div>
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...loginForm.register('password', { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Forgot password?
                  </button>

                  <Button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl transition-all hover:scale-105 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                </form>

                <div className="my-6">
                  <Separator className="my-4" />
                  <p className="text-center text-sm text-muted-foreground -mt-3 bg-card px-2 mx-auto w-fit">
                    or continue with
                  </p>
                </div>

                <Button
                  onClick={onGoogleLogin}
                  variant="outline"
                  className="w-full py-6 rounded-xl transition-all hover:scale-105 hover:bg-muted"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign in with Google
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Sign up
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-6 text-foreground">
                  Create Account
                </h2>
                <form onSubmit={signupForm.handleSubmit(onSignup)} className="space-y-4">
                  <div className="form-field space-y-2">
                    <Label htmlFor="name" className="text-foreground">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your name"
                        className="pl-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...signupForm.register('name', { required: true })}
                      />
                    </div>
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="signup-email" className="text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="you@example.com"
                        className="pl-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...signupForm.register('email', { required: true })}
                      />
                    </div>
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="signup-password" className="text-foreground">Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...signupForm.register('password', { 
                          required: true,
                          onChange: handlePasswordChange
                        })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {passwordStrength > 0 && (
                      <div className="space-y-1">
                        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                          <motion.div
                            className={`h-full ${
                              passwordStrength === 100 ? 'bg-green-500' :
                              passwordStrength >= 75 ? 'bg-yellow-500' :
                              passwordStrength >= 50 ? 'bg-orange-500' : 'bg-red-500'
                            }`}
                            initial={{ width: 0 }}
                            animate={{ width: `${passwordStrength}%` }}
                            transition={{ duration: 0.3 }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {passwordStrength === 100 ? 'Strong password' :
                           passwordStrength >= 75 ? 'Good password' :
                           passwordStrength >= 50 ? 'Fair password' : 'Weak password'}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="form-field space-y-2">
                    <Label htmlFor="confirm-password" className="text-foreground">Confirm Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        className="pl-10 pr-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                        {...signupForm.register('confirmPassword', { required: true })}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-6 rounded-xl transition-all hover:scale-105 shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Creating account...' : 'Create Account'}
                  </Button>
                </form>

                <div className="my-6">
                  <Separator className="my-4" />
                  <p className="text-center text-sm text-muted-foreground -mt-3 bg-card px-2 mx-auto w-fit">
                    or continue with
                  </p>
                </div>

                <Button
                  onClick={onGoogleLogin}
                  variant="outline"
                  className="w-full py-6 rounded-xl transition-all hover:scale-105 hover:bg-muted"
                  disabled={isLoading}
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
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
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign up with Google
                </Button>

                <div className="mt-6 text-center">
                  <p className="text-sm text-muted-foreground">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('login')}
                      className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
                    >
                      Sign in
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-2xl font-heading font-semibold mb-2 text-foreground">
                  Reset Password
                </h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Enter your email and we'll send you a reset link
                </p>

                {!resetSent ? (
                  <form onSubmit={forgotForm.handleSubmit(onForgotPassword)} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="forgot-email" className="text-foreground">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                        <Input
                          id="forgot-email"
                          type="email"
                          placeholder="you@example.com"
                          className="pl-10 focus:ring-2 focus:ring-indigo-500 transition-all"
                          {...forgotForm.register('email', { required: true })}
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-6 rounded-xl transition-all hover:scale-105 shadow-lg"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending...' : 'Send Reset Link'}
                    </Button>
                  </form>
                ) : (
                  <motion.div
                    className="reset-popup text-center py-8"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Check your email</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a password reset link to your email
                    </p>
                  </motion.div>
                )}

                <div className="mt-6 text-center">
                  <button
                    onClick={() => {
                      setMode('login');
                      setResetSent(false);
                    }}
                    className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
                  >
                    Back to login
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
