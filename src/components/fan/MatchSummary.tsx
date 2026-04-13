import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, X, BarChart3, Star, RotateCcw } from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';

export default function MatchSummary() {
  const { matchStatus, liveScore, resetMatch } = useVenueStore();

  if (matchStatus !== 'finished') return null;

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-lg bg-slate-900 border border-emerald-500/30 rounded-[3rem] shadow-[0_0_50px_rgba(16,185,129,0.2)] overflow-hidden"
      >
        <div className="p-8 text-center bg-gradient-to-b from-emerald-500/20 to-transparent">
           <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              <Trophy size={40} className="text-slate-900" />
           </div>
           
           <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tight">Full Time Result</h2>
           <p className="text-emerald-400 font-bold text-sm uppercase tracking-widest">Match Day Conclusion</p>
        </div>

        <div className="px-8 py-4 flex justify-between items-center text-center">
           <div className="flex-1">
              <p className="text-4xl font-black text-white">{liveScore.scoreA}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{liveScore.teamA}</p>
           </div>
           
           <div className="px-6 border-x border-white/5">
              <span className="text-sm font-black text-slate-500 italic">VS</span>
           </div>
           
           <div className="flex-1">
              <p className="text-4xl font-black text-white">{liveScore.scoreB}</p>
              <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">{liveScore.teamB}</p>
           </div>
        </div>

        {/* Stats Grid */}
        <div className="p-8 grid grid-cols-2 gap-4">
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Possession</p>
              <p className="text-xl font-black text-sky-400">54% - 46%</p>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Shots on Target</p>
              <p className="text-xl font-black text-pink-400">8 - 6</p>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">Yellow Cards</p>
              <p className="text-xl font-black text-yellow-400">2 - 3</p>
           </div>
           <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase mb-1">XP Earned</p>
              <div className="flex items-center gap-1.5">
                 <Star size={14} className="text-yellow-500 fill-yellow-500" />
                 <p className="text-xl font-black text-white">+850</p>
              </div>
           </div>
        </div>

        <div className="p-8 pt-0">
           <button 
             onClick={resetMatch}
             className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl transition shadow-lg flex items-center justify-center gap-3 active:scale-95"
           >
             <RotateCcw size={20} />
             Start Next Match Day
           </button>
           <p className="text-center text-[10px] text-slate-500 mt-4 font-bold uppercase tracking-wider">
             New events, offers, and challenges will reset locally.
           </p>
        </div>
      </motion.div>
    </div>
  );
}
