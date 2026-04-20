import React from 'react';
import { motion } from 'framer-motion';
import { Lock, LogIn } from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';

interface AuthWallProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  height?: string;
  className?: string;
}

/**
 * AuthWall Component.
 * Blurs premium content for guests and prompts for login.
 */
export default function AuthWall({ 
  children, 
  title = 'Premium Feature Locked', 
  description = 'Sign in to access your personalized match day data.',
  height = 'auto',
  className = ''
}: AuthWallProps) {
  const user = useVenueStore((state) => state.user);

  if (user) return <>{children}</>;

  return (
    <div className={`relative group ${className}`} style={{ height }}>
      {/* Blurred Content Fragment */}
      <div className="blur-md select-none pointer-events-none opacity-40 transition-all filter brightness-50 h-full w-full">
        {children}
      </div>

      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center bg-slate-950/80 backdrop-blur-[1px] overflow-hidden rounded-inherit"
      >
        <div className="bg-slate-900 border border-white/10 p-6 md:p-8 rounded-[2rem] shadow-2xl space-y-3 w-[85%] max-w-[320px] mx-auto">
           <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-pink-500 to-violet-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-pink-500/20">
              <Lock className="text-white" size={24} />
           </div>
           
           <div>
              <h4 className="text-xl font-black text-white leading-tight">{title}</h4>
              <p className="text-[11px] font-medium text-slate-400 mt-2 leading-relaxed">
                {description}
              </p>
           </div>

           <div className="pt-2">
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">Identity Required</p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="w-full bg-white text-slate-950 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-100 transition active:scale-95 shadow-xl"
              >
                <LogIn size={14} /> View Sign In Options
              </button>
           </div>
        </div>
      </motion.div>
    </div>
  );
}
