import { motion } from 'motion/react';

interface MascotProps {
  expression?: 'happy' | 'thinking' | 'encouraging' | 'surprised' | 'cool' | 'savage';
  size?: number;
  animate?: boolean;
  message?: string;
}

export default function Mascot({ expression = 'happy', size = 80, animate = true, message }: MascotProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <motion.div
        className="relative"
        animate={animate ? { y: [0, -6, 0] } : {}}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        style={{ width: size, height: size }}
      >
        <svg viewBox="0 0 80 80" width={size} height={size}>
          {/* Buri AI - Samurai Frog */}
          {/* Body */}
          <ellipse cx="40" cy="48" rx="28" ry="24" fill="#16A34A" />
          {/* Belly */}
          <ellipse cx="40" cy="52" rx="20" ry="16" fill="#DCFCE7" />
          
          {/* Samurai Armor / Kimono Collar */}
          <path d="M 16 50 L 40 65 L 64 50 L 58 70 L 22 70 Z" fill="#1E293B" />
          <path d="M 40 65 L 25 50" stroke="#F59E0B" strokeWidth="2" />
          <path d="M 40 65 L 55 50" stroke="#F59E0B" strokeWidth="2" />

          {/* Left eye bump */}
          <circle cx="28" cy="28" r="14" fill="#16A34A" />
          {/* Right eye bump */}
          <circle cx="52" cy="28" r="14" fill="#16A34A" />
          {/* Left eye white */}
          <circle cx="28" cy="26" r="9" fill="white" />
          {/* Right eye white */}
          <circle cx="52" cy="26" r="9" fill="white" />
          
          {/* Expressions */}
          {/* Pupils */}
          <circle cx={expression === 'thinking' ? 26 : 30} cy="25" r="4" fill="#0F172A" />
          <circle cx={expression === 'thinking' ? 50 : 54} cy="25" r="4" fill="#0F172A" />
          
          {/* Eye shine */}
          <circle cx="31" cy="23" r="1.5" fill="white" opacity="0.8" />
          <circle cx="55" cy="23" r="1.5" fill="white" opacity="0.8" />
          
          {/* Mouth */}
          {expression === 'happy' || expression === 'encouraging' ? (
            <path d="M 28 46 Q 40 56 52 46" stroke="#064E3B" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : expression === 'surprised' ? (
            <ellipse cx="40" cy="48" rx="5" ry="4" fill="#064E3B" />
          ) : expression === 'savage' ? (
            <path d="M 30 48 Q 40 44 50 48" stroke="#064E3B" strokeWidth="2" fill="none" strokeLinecap="round" />
          ) : (
            <path d="M 32 46 Q 40 48 48 46" stroke="#064E3B" strokeWidth="2" fill="none" strokeLinecap="round" />
          )}

          {/* Cheeks */}
          <circle cx="22" cy="42" r="4" fill="#FCA5A5" opacity="0.5" />
          <circle cx="58" cy="42" r="4" fill="#FCA5A5" opacity="0.5" />
          
          {/* Samurai Headband (Hachimaki) */}
          <rect x="12" y="16" width="56" height="5" rx="1" fill="#EF4444" />
          <circle cx="40" cy="18.5" r="2" fill="white" />
          {/* Headband tails blowing in wind */}
          <path d="M 66 17 C 72 14, 75 18, 78 15" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 66 19 C 70 20, 72 24, 75 22" stroke="#EF4444" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Sunglasses for Cool/Savage */}
          {(expression === 'cool' || expression === 'savage') && (
            <g>
              <rect x="20" y="21" width="18" height="10" rx="3" fill="#0F172A" />
              <rect x="42" y="21" width="18" height="10" rx="3" fill="#0F172A" />
              <line x1="38" y1="26" x2="42" y2="26" stroke="#0F172A" strokeWidth="2" />
              <path d="M 22 23 L 34 23" stroke="white" strokeWidth="1" opacity="0.3" />
            </g>
          )}
        </svg>
      </motion.div>

      {/* Speech bubble */}
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          className="relative glass-card px-4 py-2 max-w-xs text-sm text-dark-200 text-center"
        >
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-3 h-3 bg-dark-800/60 rotate-45 border-l border-t border-dark-700/50" />
          {message}
        </motion.div>
      )}
    </div>
  );
}
