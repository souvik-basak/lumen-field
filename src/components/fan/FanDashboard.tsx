import { motion } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Clock, Navigation, AlertTriangle, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function FanDashboard() {
  const { gameEvents, waitTimes, liveScore } = useVenueStore();
  
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
          <motion.section variants={itemVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <Link to="/fan/food" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400 drop-shadow-[0_0_10px_rgba(14,165,233,0.4)]">
                <span className="text-2xl md:text-3xl">🍔</span>
              </div>
              <span className="font-bold text-sm tracking-wide">Order Food</span>
            </Link>
            <Link to="/fan/navigate" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-violet-500/10 flex items-center justify-center text-violet-400 drop-shadow-[0_0_10px_rgba(139,92,246,0.4)]">
                <Navigation size={28} />
              </div>
              <span className="font-bold text-sm tracking-wide">Find Toilet</span>
            </Link>
            <Link to="/fan/merch" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_10px_rgba(16,185,129,0.4)]">
                <span className="text-2xl md:text-3xl">👕</span>
              </div>
              <span className="font-bold text-sm tracking-wide">Merch</span>
            </Link>
            <Link to="/fan/parking" className="block glass p-4 md:p-6 rounded-[2rem] flex flex-col items-center justify-center gap-3 hover:bg-white/20 transition cursor-pointer active:scale-95 border-b-2 border-slate-900 border-white/5">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400 drop-shadow-[0_0_10px_rgba(249,115,22,0.4)]">
                <span className="text-2xl md:text-3xl">🚗</span>
              </div>
              <span className="font-bold text-sm tracking-wide">Parking</span>
            </Link>
          </motion.section>

          {/* Dynamic Alerts */}
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
          <motion.section variants={itemVariants} className="glass-dark rounded-[2rem] p-5 md:p-8 border border-white/5 pb-6">
            <h3 className="font-black mb-4 text-slate-100 tracking-tight md:text-lg">Smart Suggestions</h3>
            <ul className="space-y-4">
              {upcomingEvent?.timeToEventMinutes && upcomingEvent.timeToEventMinutes < 20 && (
                <li className="flex gap-3 items-start p-2 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-pink-500 shrink-0 mt-1.5 md:mt-1 shadow-[0_0_8px_rgba(236,72,153,0.8)]"></div>
                  <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                    <span className="font-bold text-white block mb-0.5 md:mb-1">Wait Time Spike Anticipated:</span> 
                    Lines directly spike precisely at {upcomingEvent.title}. Pre-order food and drinks ahead of time via the app to skip the 25+ min rush.
                  </p>
                </li>
              )}
              <li className="flex gap-3 items-start p-2 md:p-4 rounded-xl md:rounded-2xl hover:bg-white/5 transition-colors cursor-pointer border border-transparent hover:border-white/5">
                <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-sky-500 shrink-0 mt-1.5 md:mt-1 shadow-[0_0_8px_rgba(14,165,233,0.8)]"></div>
                <p className="text-xs md:text-sm text-slate-300 font-medium leading-relaxed">
                  <span className="font-bold text-white block mb-0.5 md:mb-1">Optimal Route Found:</span> 
                  Restroom Sec 102 has only a 2 min wait right now. Perfect time to go before {liveScore.period} ends.
                </p>
              </li>
            </ul>
          </motion.section>
        </div>

        {/* Right Sidebar Area (Ticket) */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Digital Ticket / Pass Entry */}
          <motion.section variants={itemVariants} className="md:hidden lg:block bg-gradient-to-tr from-sky-600 via-violet-600 to-pink-600 rounded-[2rem] p-1 shadow-xl">
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
        </div>

      </div>
    </motion.div>
  );
}
