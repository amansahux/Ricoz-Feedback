import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate } from 'react-router';
import { Mail, Lock, LogIn, Sparkles, ArrowRight } from 'lucide-react';
import { loginSchema } from '../../validation/auth.schema';
import useAuth from '../../hook/useAuth';
import Input from '../../../../shared/components/Input';
import Button from '../../../../shared/components/Button';

export default function Login() {
  const { login, isLoggingIn, isAuthenticated, isHydrating, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onTouched',
  });

  if (!isHydrating && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data) => {
    await login(data);
  };

  return (
    <div className="min-h-screen bg-slate-950 relative flex items-center justify-center px-4 py-12 overflow-hidden selection:bg-red-500 selection:text-white">
      {/* Background Decorative Gradients & Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-red-600/20 to-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -right-20 w-80 h-80 bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-600 to-red-500 text-white shadow-lg shadow-red-500/30 mb-4 ring-1 ring-white/20">
            <Sparkles size={24} />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white font-poppins">
            Welcome back to <span className="bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent">RECOZ</span>
          </h1>
          <p className="text-slate-400 text-sm mt-2">
            Turn customer feedback into actionable insights
          </p>
        </div>

        {/* Card */}
        <div className="backdrop-blur-xl bg-slate-900/70 border border-slate-800/80 rounded-3xl shadow-2xl p-8 sm:p-10">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-start gap-2.5">
              <span className="text-red-400 font-bold">!</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <Input
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="you@company.com"
              autoComplete="email"
              error={errors.email?.message}
              {...register('email')}
            />

            <div className="space-y-1">
              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••"
                autoComplete="current-password"
                error={errors.password?.message}
                {...register('password')}
              />
            </div>

            <Button
              type="submit"
              loading={isLoggingIn}
              className="w-full py-3 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-semibold rounded-xl shadow-lg shadow-red-600/25 hover:shadow-red-600/40 transition-all duration-200 mt-2"
            >
              <LogIn size={18} />
              <span>Sign in to Dashboard</span>
            </Button>
          </form>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-slate-800/60 text-center">
            <p className="text-slate-400 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-red-400 hover:text-red-300 font-semibold inline-flex items-center gap-1 transition"
              >
                Create one now <ArrowRight size={14} />
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}