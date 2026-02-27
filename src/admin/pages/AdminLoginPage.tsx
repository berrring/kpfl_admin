import { FormEvent, useState } from 'react';
import { loginAdmin } from '@/admin/api';

interface AdminLoginPageProps {
  onSuccess: () => void;
}

export function AdminLoginPage({ onSuccess }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await loginAdmin(email, password);
      onSuccess();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F8] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_12px_34px_rgba(15,23,41,0.08)] p-6">
        <div className="mb-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#F5C742] to-[#E8A912] flex items-center justify-center mx-auto shadow-[0_6px_20px_rgba(232,169,18,0.3)]">
            <span className="text-[#0A1628] font-black text-sm">KPFL</span>
          </div>
          <h1 className="mt-4 text-2xl font-black text-[#0F1729]">Admin Login</h1>
          <p className="mt-1 text-sm text-[#6B7280]">Sign in to manage clubs, players, matches, and news</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={event => setEmail(event.target.value)}
              className="input-field"
              placeholder="admin@kpfl.kg"
            />
          </div>

          <div>
            <label className="block mb-1.5 text-xs font-semibold text-[#4B5563]">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={event => setPassword(event.target.value)}
              className="input-field"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm px-3 py-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-lg font-bold text-sm bg-[#0A1628] text-white hover:bg-[#142238] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
