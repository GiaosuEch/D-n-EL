import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Mascot from '../../components/mascot/Mascot';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields'); return; }
    const success = await login(email, password);
    if (success) navigate('/app');
    else setError('Invalid credentials');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-mesh px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Mascot expression="happy" size={70} message="Chào mừng trở lại! 🎉" />
          <h1 className="mt-4 text-3xl font-bold text-white">Welcome Back</h1>
          <p className="text-dark-400 mt-1">Log in to continue your journey</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {error && <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-xl">{error}</div>}

          <div>
            <label className="text-sm text-dark-300 mb-1 block">Email</label>
            <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 focus-within:border-primary-500/50">
              <Mail size={18} className="text-dark-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-dark-500" />
            </div>
          </div>

          <div>
            <label className="text-sm text-dark-300 mb-1 block">Password</label>
            <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 focus-within:border-primary-500/50">
              <Lock size={18} className="text-dark-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-dark-500" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-dark-500 hover:text-dark-300">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-dark-400 cursor-pointer">
              <input type="checkbox" className="rounded border-dark-600 bg-dark-800 text-primary-500" /> Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-400 hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-dark-700" /></div>
            <div className="relative flex justify-center"><span className="px-4 text-sm text-dark-500 bg-dark-900">or continue with</span></div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button type="button" className="py-3 border border-dark-700 rounded-xl text-dark-300 hover:bg-dark-800 transition-colors text-sm font-medium">
              🔵 Google
            </button>
            <button type="button" className="py-3 border border-dark-700 rounded-xl text-dark-300 hover:bg-dark-800 transition-colors text-sm font-medium">
              ⚫ GitHub
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-dark-400 mt-6">
          Don't have an account? <Link to="/register" className="text-primary-400 hover:underline font-medium">Sign up free</Link>
        </p>
      </motion.div>
    </div>
  );
}
