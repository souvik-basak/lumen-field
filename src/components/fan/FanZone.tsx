import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Activity, Camera, PlayCircle, BarChart3, Star, ThumbsUp } from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';
import AuthWall from '../shared/AuthWall';

export default function FanZone() {
  const { liveScore, activeStadiumId } = useVenueStore();
  const [decibel, setDecibel] = useState(85);
  const [pollVoted, setPollVoted] = useState<string | null>(null);

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];

  useEffect(() => {
    // Animate decibel meter
    const interval = setInterval(() => {
      setDecibel(80 + Math.random() * 30);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const videoFeeds = [
    { id: stadium.videoIds[0], name: `${stadium.name} Drone`, active: true },
    { id: stadium.videoIds[1] || 'aqz-KE-bpKQ', name: 'Crowd View', active: false },
    { id: stadium.videoIds[2] || 'vK9vV8H-rQo', name: 'Pitch Side', active: false },
    { id: stadium.videoIds[3] || 'i-Qp7ZpA_6g', name: 'Dugout Cam', active: false }
  ];

  return (
    <div className="p-4 md:p-8 pt-6 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-24 hidden-scrollbar text-slate-100">
      
      {/* Header & Loyalty Status */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4 mb-4 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
             <Trophy className="text-yellow-400" size={28} /> Fan Zone
          </h2>
          <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest">{stadium.name} Experience</p>
        </div>
        
        <AuthWall 
           title="Member Perks Locked" 
           description="Join the Elite Fan club to track your loyalty points and unlock exclusive venue rewards."
         >
           <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-3 rounded-2xl flex items-center gap-4">
             <div className="bg-yellow-500 text-slate-900 p-2 rounded-xl">
                <Star size={20} className="fill-slate-900" />
             </div>
             <div>
               <p className="text-[10px] uppercase font-bold tracking-widest text-yellow-400">All-Star Member</p>
               <p className="text-xl font-black text-white">12,450 <span className="text-sm text-slate-300">pts</span></p>
             </div>
           </div>
         </AuthWall>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Polling & Decibel Meter */}
        <div className="lg:col-span-5 flex flex-col gap-6 md:gap-8">
          
          {/* Live Decibel Meter */}
          <div className="glass p-6 rounded-[2.5rem] relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition">
               <Activity size={100} />
             </div>
             <h3 className="font-black text-lg text-slate-200 mb-6 flex items-center gap-2 relative z-10"><Activity className="text-pink-500"/> Stadium Noise</h3>
             
             <div className="flex items-end gap-2 mb-4 relative z-10">
               <motion.span 
                 className="text-5xl md:text-6xl font-black bg-gradient-to-t from-pink-500 to-violet-500 bg-clip-text text-transparent w-24"
               >
                 {Math.floor(decibel)}
               </motion.span>
               <span className="text-xl font-bold text-slate-500 mb-2">dB</span>
             </div>
             
             <div className="h-4 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5 relative z-10">
                <motion.div 
                  animate={{ width: `${(decibel / 120) * 100}%` }}
                  transition={{ type: "spring", bounce: 0 }}
                  className={`h-full ${decibel > 100 ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : decibel > 90 ? 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.8)]'}`}
                />
             </div>
             <div className="flex justify-between mt-2 text-xs font-bold text-slate-500 relative z-10">
               <span>60 Quiet</span>
               <span>90 Loud</span>
               <span className="text-red-400">120 Deafening</span>
             </div>
          </div>

          {/* Live Polls */}
          <div className="glass-dark border border-white/10 p-6 rounded-[2.5rem]">
             <div className="flex justify-between items-center mb-6">
                <h3 className="font-black text-lg text-slate-200 flex items-center gap-2"><BarChart3 className="text-sky-400"/> Live Poll</h3>
                <span className="animate-pulse bg-red-500 text-white text-[9px] px-2 py-0.5 rounded uppercase tracking-widest font-bold border border-red-400">Live</span>
             </div>
             
             <h4 className="text-xl font-bold text-white mb-4">What will happen in the next 5 minutes?</h4>
             
             <div className="space-y-3">
                {[
                  { id: 'goal', label: 'Goal Scored', percent: 15 },
                  { id: 'corner', label: 'Corner Kick', percent: 45 },
                  { id: 'yellow', label: 'Yellow Card', percent: 40 }
                ].map(opt => (
                 <button 
                   key={opt.id}
                   onClick={() => setPollVoted(opt.id)}
                   disabled={pollVoted !== null}
                   className={`w-full relative overflow-hidden rounded-xl border ${pollVoted === opt.id ? 'border-sky-500 bg-sky-500/10' : 'border-white/5 bg-slate-800/40 hover:bg-slate-800'} p-4 transition text-left group disabled:opacity-80`}
                 >
                   <div className="relative z-10 flex justify-between items-center">
                     <span className={`font-bold ${pollVoted === opt.id ? 'text-sky-400' : 'text-slate-200'}`}>{opt.label}</span>
                     <AnimatePresence>
                       {pollVoted && (
                         <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-black text-sm text-slate-400">
                           {opt.percent}%
                         </motion.span>
                       )}
                     </AnimatePresence>
                   </div>
                   {pollVoted && (
                     <motion.div 
                       initial={{ width: 0 }}
                       animate={{ width: `${opt.percent}%` }}
                       className="absolute top-0 left-0 h-full bg-slate-700/50"
                     />
                   )}
                 </button>
               ))}
             </div>
             
             {pollVoted && (
               <motion.p initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="text-center mt-4 text-xs font-bold text-emerald-400 flex items-center justify-center gap-1">
                 <ThumbsUp size={14} /> +50 Points awarded!
               </motion.p>
             )}
          </div>
        </div>

        {/* Right Column: Multi-Cam VIP Feeds */}
         <div className="lg:col-span-7 flex flex-col">
            <AuthWall 
              title="VIP Angles Protected" 
              description="Live Drone and Pitch-side feeds are reserved for authenticated premium ticket holders."
              height="100%"
            >
              <div className="glass p-2 md:p-4 rounded-[2.5rem] border border-white/5 h-full flex flex-col">
                
                <div className="px-4 pt-4 pb-2 flex justify-between items-center mb-2">
                  <h3 className="font-black text-lg text-slate-200 flex items-center gap-2"><Camera className="text-violet-400"/> VIP Angles</h3>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">Venue WiFi Only</span>
                </div>

                <div className="grid grid-cols-2 gap-2 flex-1 relative p-2">
                    {videoFeeds.map((feed, idx) => (
                       <div key={feed.id} className={`relative overflow-hidden rounded-2xl border ${feed.active ? 'border-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.3)]' : 'border-slate-800'} bg-black flex items-center justify-center aspect-video cursor-pointer hover:border-violet-400/50 transition group`}>
                          <div className="absolute inset-0 z-0 pointer-events-none opacity-60">
                            <iframe 
                              className="w-full h-full scale-[1.3] pointer-events-none"
                              src={`https://www.youtube.com/embed/${feed.id}?autoplay=1&mute=1&loop=1&playlist=${feed.id}&controls=0&modestbranding=1&rel=0`}
                              title={feed.name}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            ></iframe>
                          </div>
                          
                          {/* Overlay UI */}
                          <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-transparent transition duration-500 z-10 flex items-center justify-center">
                             <PlayCircle size={40} className={`opacity-20 group-hover:opacity-100 transition ${feed.active ? 'text-violet-500 opacity-80' : 'text-white'}`} strokeWidth={1} />
                          </div>

                          <div className="absolute top-2 left-2 flex items-center gap-1.5 z-20">
                             {feed.active && <span className="animate-pulse w-1.5 h-1.5 rounded-full bg-red-500"></span>}
                             <span className="text-[9px] uppercase tracking-widest font-bold text-white/90 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur border border-white/5">{feed.name}</span>
                          </div>
                       </div>
                    ))}
                </div>
                
                <div className="p-4 bg-slate-900/50 m-2 rounded-2xl flex items-center justify-between border border-slate-800">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-500/20 text-violet-400 flex items-center justify-center rounded-full border border-violet-500/50">
                        <PlayCircle size={20} />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">VAR Check: Goal Valid</p>
                        <p className="text-xs text-slate-400 font-medium">82:45 min - Goal confirmed</p>
                      </div>
                   </div>
                   <button className="bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold px-4 py-2 rounded-lg transition shadow-md">
                      Watch
                   </button>
                </div>

              </div>
            </AuthWall>
         </div>

      </div>
    </div>
  );
}
