import { useState } from 'react';
import { MobileHeader } from '@/components/Navigation';

interface AuthScreenProps {
  onBack: () => void;
  onSignIn: (name: string) => void;
}

export function AuthScreen({ onBack, onSignIn }: AuthScreenProps) {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'signin' && email && password) {
      onSignIn(email.split('@')[0] || 'User');
    } else if (mode === 'register' && name && email && password) {
      onSignIn(name);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] pb-20 md:pb-0">
      <MobileHeader title={mode === 'signin' ? 'Sign In' : 'Register'} showBack onBack={onBack} />
      
      <div className="max-w-md mx-auto px-4 py-6 md:py-12">
        {/* Logo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center mx-auto mb-3 shadow-md">
            <span className="text-[#0A1628] font-black text-base">KPFL</span>
          </div>
          <h1 className="text-xl font-black text-[#0F1729]">
            {mode === 'signin' ? 'Welcome Back' : 'Join KPFL'}
          </h1>
          <p className="text-[#6B7280] text-sm mt-1">
            {mode === 'signin' 
              ? 'Sign in to your account' 
              : 'Create your account'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div>
                <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                  placeholder="Enter your name"
                  required
                />
              </div>
            )}
            
            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4B5563] mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {mode === 'signin' && (
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4 rounded border-[#D1D5DB]" />
                  <span className="text-[#4B5563]">Remember me</span>
                </label>
                <button type="button" className="text-[#E8A912] font-medium hover:underline">
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#0A1628] text-white py-3 rounded-lg font-bold text-sm hover:bg-[#142238] transition-colors"
            >
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          {/* Role info */}
          <div className="mt-5 p-3 bg-[#F4F6F8] rounded-lg">
            <p className="text-[10px] text-[#6B7280] mb-1.5">Account Types:</p>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded font-medium">
                User
              </span>
              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-[10px] rounded font-medium">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-[#9CA3AF] mt-1.5">
              Admin access requires special authorization
            </p>
          </div>

          {/* Toggle */}
          <div className="mt-5 text-center text-sm">
            <span className="text-[#4B5563]">
              {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            </span>
            <button
              type="button"
              onClick={() => setMode(mode === 'signin' ? 'register' : 'signin')}
              className="text-[#E8A912] font-semibold hover:underline"
            >
              {mode === 'signin' ? 'Register' : 'Sign In'}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-[#9CA3AF] text-center mt-5">
          By continuing, you agree to KPFL's Terms and Privacy Policy
        </p>
      </div>
    </div>
  );
}
