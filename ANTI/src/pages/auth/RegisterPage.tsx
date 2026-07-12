import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { Mail, Lock, User, Eye } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import Mascot from '../../components/mascot/Mascot';
import { languages } from '../../data/languages';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [targetLang, setTargetLang] = useState('en');
  const [error, setError] = useState('');
  const { register, isLoading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!name || !email || !password) { setError('Please fill in all fields'); return; }
      if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
      setError('');
      setStep(2);
      return;
    }
    const success = await register(email, password, name);
    if (success) navigate('/app');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950 bg-mesh px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <Mascot expression="encouraging" size={70} message={step === 1 ? 'Hãy tạo tài khoản nào! 🌟' : 'Chọn ngôn ngữ muốn học! 🐸'} />
          <h1 className="mt-4 text-3xl font-bold text-white">{step === 1 ? 'Create Your Account' : 'Choose Your Language'}</h1>
          <p className="text-dark-400 mt-1">{step === 1 ? 'Start your language learning journey today' : 'Which language do you want to master?'}</p>
        </div>

        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-2">
            <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-primary-500' : 'bg-dark-700'}`} />
            <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-primary-500' : 'bg-dark-700'}`} />
          </div>

          {error && <div className="p-3 bg-error/10 border border-error/20 text-error text-sm rounded-xl">{error}</div>}

          {step === 1 ? (
            <>
              <div>
                <label className="text-sm text-dark-300 mb-1 block">Full Name</label>
                <div className="flex items-center gap-2 bg-dark-800 border border-dark-700 rounded-xl px-4 py-3 focus-within:border-primary-500/50">
                  <User size={18} className="text-dark-500" />
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe"
                    className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-dark-500" />
                </div>
              </div>
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
                  <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Min 6 characters"
                    className="bg-transparent border-none outline-none text-white w-full text-sm placeholder-dark-500" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-dark-500"><Eye size={18} /></button>
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
              {languages.map((lang) => (
                <button key={lang.id} type="button" onClick={() => setTargetLang(lang.id)}
                  className={`p-3 rounded-xl text-left transition-all ${targetLang === lang.id ? 'bg-primary-500/20 border-2 border-primary-500' : 'bg-dark-800 border-2 border-transparent hover:border-dark-600'}`}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <p className="text-sm font-medium text-white mt-1">{lang.name}</p>
                  <p className="text-xs text-dark-400">{lang.difficulty}</p>
                </button>
              ))}
            </div>
          )}

          <button type="submit" disabled={isLoading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all disabled:opacity-50"
          >
            {isLoading ? 'Creating...' : step === 1 ? 'Next →' : 'Start Learning 🐸'}
          </button>

          {step === 2 && (
            <button type="button" onClick={() => setStep(1)} className="w-full py-2 text-dark-400 hover:text-dark-200 text-sm">← Back</button>
          )}
        </form>

        <p className="text-center text-sm text-dark-400 mt-6">
          Already have an account? <Link to="/login" className="text-primary-400 hover:underline font-medium">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
