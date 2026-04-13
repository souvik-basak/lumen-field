import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Clock, Navigation, AlertTriangle, QrCode, Train, Car } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSmartSuggestions } from '../../hooks/useSmartSuggestions';

export default function FanDashboard() {
  const { gameEvents, waitTimes, liveScore, alerts } = useVenueStore();
  const suggestions = useSmartSuggestions();
  
  const upcomingEvent = gameEvents.find(e => e.timeToEventMinutes !== null && e.timeToEventMinutes > 0);
  const criticalGates = waitTimes.filter(w => w.type === 'exit' && w.density === 'Critical');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 space-y-5 md:space-y-8 pt-6 hidden-scrollbar pb-24 md:pb-12 max-w-7xl mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-8">
        
        {/* Core Middle/Left Content */}
        <div className="lg:col-span-8 flex flex-col gap-5 md:gap-8">
          {/* Hero Welcome / Live Game Score */}
          <motion.section variants={itemVariants} className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-800 flex-shrink-0">
            <div className="absolute inset-0 bg-slate-800/80 z-0"></div>
            <div className="relative z-10 p-5 md:p-8 flex flex-col justify-center items-center text-center">
              
              <div className="flex justify-between w-full items-center mb-3">
                 <div className="flex flex-col items-center flex-1">
                   <span className="text-4xl md:text-6xl font-black text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]">{liveScore.scoreA}</span>
                   <span className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{liveScore.teamA}</span>
                 </div>
                 
                 <div className="flex flex-col items-center px-4 md:px-8 border-x border-slate-700">
                    <span className="text-xs md:text-sm font-black text-pink-500 tracking-widest">{liveScore.period}</span>
                    <span className="text-3xl md:text-4xl font-mono font-bold text-white tracking-widest mt-0.5">{liveScore.clock}</span>
                 </div>
                 
                 <div className="flex flex-col items-center flex-1">
                   <span className="text-4xl md:text-6xl font-black text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.8)]">{liveScore.scoreB}</span>
                   <span className="text-[10px] md:text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{liveScore.teamB}</span>
                 </div>
              </div>

              {upcomingEvent && (
                <div className="bg-black/30 rounded-full px-4 py-1.5 flex gap-2 items-center text-xs font-semibold text-slate-300 mt-2 md:mt-4 border border-slate-700">
                  <Clock size={12} className="text-pink-400" /> 
                  {upcomingEvent.title} in <span className="text-pink-400">{upcomingEvent.timeToEventMinutes}m</span>
                </div>
              )}
            </div>
          </motion.section>

          {/* Quick Action Hub */}
          <motion.section variants={itemVariants} className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 md:gap-4">
            <Link to="/fan/food" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]">
                <span className="text-xl md:text-2xl">🍔</span>
              </div>
              <span className="font-bold text-xs tracking-wide">Order Food</span>
            </Link>
            <Link to="/fan/navigate" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                <Navigation size={22} />
              </div>
              <span className="font-bold text-xs tracking-wide">Find Toilet</span>
            </Link>
            <Link to="/fan/merch" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <span className="text-xl md:text-2xl">👕</span>
              </div>
              <span className="font-bold text-xs tracking-wide">Merch</span>
            </Link>
            <Link to="/fan/transit" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]">
                <Train size={22} />
              </div>
              <span className="font-bold text-xs tracking-wide">Smart Transit</span>
            </Link>
            <Link to="/fan/parking" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                <Car size={22} />
              </div>
              <span className="font-bold text-xs tracking-wide">Parking</span>
            </Link>
          </motion.section>

          {/* Dynamic Congestion Alerts */}
          {criticalGates.length > 0 && (
            <motion.section variants={itemVariants}>
              <div className="bg-red-500/10 border border-red-500/30 rounded-2xl md:rounded-[2rem] p-4 md:p-6 flex gap-3 md:gap-4 items-start shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5 md:mt-0" strokeWidth={2.5} size={24} />
                <div>
                  <h3 className="font-bold text-red-500 md:text-lg tracking-tight">Congestion Alert</h3>
                  <p className="text-xs md:text-sm font-medium text-red-200 mt-1 leading-relaxed">
                    Avoid <span className="font-bold">{criticalGates.map(g => g.name).join(', ')}</span>. Use alternative routes suggested in the Map.
                  </p>
                </div>
              </div>
            </motion.section>
          )}

          {/* Smart Suggestions */}
          <motion.section variants={itemVariants} className="glass-dark rounded-[2rem] p-5 md:p-8 border border-white/5 pb-8 min-h-[400px]">
            <h3 className="font-black mb-6 text-slate-100 tracking-tight md:text-xl flex items-center gap-2">
               <span className="p-2 bg-sky-500/10 rounded-lg text-sky-400">✨</span>
               Smart Suggestions
            </h3>
            
            <div className="relative">
              <AnimatePresence mode="popLayout">
                <ul className="space-y-6">
                  {suggestions.map((suggestion) => (
                    <motion.li 
                      key={suggestion.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      className="flex gap-4 items-start p-4 rounded-3xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group"
                    >
                      <div className="relative shrink-0 mt-1">
                        <div 
                          className="w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110"
                          style={{ backgroundColor: suggestion.accentColor }}
                        >
                          <suggestion.icon size={20} strokeWidth={2.5} />
                        </div>
                        <div 
                          className="absolute -inset-1 rounded-2xl blur-md opacity-40 group-hover:opacity-60 transition-opacity"
                          style={{ backgroundColor: suggestion.accentColor }}
                        ></div>
                      </div>

                      <div>
                        <span className="font-bold text-white block mb-0.5 tracking-tight">{suggestion.title}</span> 
                        <p className="text-xs md:text-sm text-slate-400 font-medium leading-relaxed">
                          {suggestion.text}
                        </p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </AnimatePresence>
            </div>
          </motion.section>
        </div>

        {/* Right Sidebar Area (Ticket) */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Digital Ticket / Pass Entry */}
          <motion.section variants={itemVariants} className="md:hidden lg:block bg-gradient-to-tr from-sky-600 via-violet-600 to-pink-600 rounded-[2rem] p-1 shadow-xl mb-6">
            <div className="bg-slate-900/90 rounded-[1.8rem] backdrop-blur-md overflow-hidden relative">
               <div className="absolute top-0 right-8 w-16 h-8 bg-sky-500/20 rounded-b-full blur-xl"></div>
               <div className="p-5 md:p-8 flex justify-between items-center border-b border-white/10 border-dashed">
                  <div>
                    <h2 className="text-[10px] md:text-xs uppercase font-bold tracking-widest text-slate-400">Match Day Ticket</h2>
                    <p className="text-xl md:text-2xl font-black mt-1 text-white">VIP Club Pass</p>
                    <p className="text-sm font-semibold text-sky-400 mt-1">Gate 3 • Sec 104 • Row N • Seat 12</p>
                  </div>
                  <div className="w-12 h-12 md:w-20 md:h-20 bg-white rounded-lg md:rounded-2xl flex items-center justify-center p-1 cursor-pointer hover:scale-105 transition-transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)] shrink-0 ml-4">
                    <QrCode className="text-black w-full h-full" />
                  </div>
               </div>
               
               <div className="bg-slate-800/50 p-4 md:p-6 py-3 md:py-4 flex justify-between items-center text-xs md:text-sm font-semibold text-slate-300">
                 <span>Tap QR to enter VIP zone</span>
                 <span className="text-pink-400 font-black uppercase tracking-wider">Ready</span>
               </div>
               
               {/* Notched cutouts */}
               <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-slate-950 absolute -left-4 top-[50%] -mt-3 md:-mt-4 shadow-inner border-r border-slate-700/50"></div>
               <div className="w-6 md:w-8 h-6 md:h-8 rounded-full bg-slate-950 absolute -right-4 top-[50%] -mt-3 md:-mt-4 shadow-inner border-l border-slate-700/50"></div>
            </div>
          </motion.section>

          {/* Live Commentary Log */}
          <motion.section variants={itemVariants} className="flex-1 flex flex-col glass-dark rounded-[2.5rem] border border-white/5 overflow-hidden">
             <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="font-black text-slate-200 flex items-center gap-2">
                   <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                   Live Commentary
                </h3>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Match Record</span>
             </div>
             
             <div className="p-4 space-y-4 overflow-y-auto max-h-[400px] custom-scrollbar">
                <AnimatePresence initial={false}>
                   {useVenueStore.getState().matchCommentary.length === 0 ? (
                      <p className="text-center text-slate-500 text-xs py-8 italic">Waiting for kick-off events...</p>
                   ) : (
                      useVenueStore.getState().matchCommentary.map((entry, idx) => (
                        <motion.div 
                          key={idx}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`flex gap-3 p-3 rounded-2xl ${entry.type === 'goal' ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-white/5'}`}
                        >
                           <span className={`text-[10px] font-black w-8 shrink-0 ${entry.type === 'goal' ? 'text-emerald-400' : 'text-slate-500'}`}>{entry.time}</span>
                           <p className={`text-xs font-medium leading-relaxed ${entry.type === 'goal' ? 'text-emerald-100' : 'text-slate-300'}`}>
                             {entry.type === 'goal' && <span className="mr-1">⚽</span>}
                             {entry.text}
                           </p>
                        </motion.div>
                      ))
                   )}
                </AnimatePresence>
             </div>
          </motion.section>
        </div>

      </div>
    </motion.div>
  );
}
