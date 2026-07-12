import { useState } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { Mail, ArrowLeft } from 'lucide-react';
import Mascot from '../../components/mascot/Mascot';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSent(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-mesh px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Mascot expression={sent ? 'happy' : 'thinking'} size={70} message={sent ? 'Đã gửi email rồi! 📧' : 'Quên mật khẩu à? Để mình giúp! 🐸'} />
          <h1 className="mt-4 text-3xl font-bold text-white">{sent ? 'Check Your Email' : 'Reset Password'}</h1>
        </div>

        {sent ? (
          <div className="glass-card p-6 text-center">
            <p className="text-dark-300">We've sent a password reset link to <span className="text-primary-400 font-medium">{email}</span></p>
            <Link to="/login" className="inline-block mt-6 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-semibold transition-colors">
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
            <p className="text-sm text-dark-400">Enter your email and we'll send you a reset link.</p>
            <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 focus-within:border-primary-500/50">
              <Mail size={18} className="text-dark-500" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com"
                className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-dark-500" />
            </div>
            <button type="submit" className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all">
              Send Reset Link
            </button>
          </form>
        )}

        <Link to="/login" className="flex items-center justify-center gap-2 text-dark-400 hover:text-dark-200 text-sm mt-6">
          <ArrowLeft size={16} /> Back to Login
        </Link>
      </motion.div>
    </div>
  );
}
