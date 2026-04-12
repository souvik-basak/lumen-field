import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Camera, AlertTriangle, Users } from 'lucide-react';

export default function SecurityFeeds() {
  const { waitTimes } = useVenueStore();
  const [activeFeeds, setActiveFeeds] = useState<any[]>([]);

  // Dynamically pull feeds based on waitTimes (prioritizing critical)
  useEffect(() => {
    const sorted = [...waitTimes].sort((a, b) => b.waitTimeMinutes - a.waitTimeMinutes).slice(0, 6);
    setActiveFeeds(sorted);
  }, [waitTimes]);

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <Camera className="text-violet-400" size={32} /> Live Feeds
          </h2>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-wider text-sm">Automated Threat & Density Prioritization</p>
        </div>
        
        <div className="flex gap-2">
           <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg border border-red-500/30">
               <span className="w-2 h-2 rounded-full animate-ping bg-red-500"></span>
               <span className="text-xs font-bold uppercase tracking-wider">Rec</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {activeFeeds.map((feed, index) => {
             const isCritical = feed.density === 'Critical';
             return (
               <motion.div 
                 key={feed.id}
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: index * 0.1 }}
                 className={`relative rounded-3xl overflow-hidden aspect-video border-2 bg-slate-900 group ${isCritical ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.2)]' : 'border-slate-800'}`}
               >
                 {/* Simulated Camera Video Background */}
                 <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 opacity-90 group-hover:opacity-70 transition"></div>
                 {/* Generic Mock Texture */}
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
                 
                 {/* Scanning Overlay */}
                 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjIiIGZpbGw9InJnYmEoMCwwLDAsMC4yKSIvPjwvc3ZnPg==')] pointer-events-none opacity-50 mix-blend-overlay"></div>
                 
                 {/* Smart Reticle */}
                 <motion.div 
                   animate={{ scale: [1, 1.05, 1], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ repeat: Infinity, duration: 4 }}
                   className="absolute inset-[15%] border border-white/10 rounded-[3rem] pointer-events-none"
                 />
                 
                 {/* Feed Meta */}
                 <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-black/60 backdrop-blur text-white px-2 py-1 rounded inline-block mb-1">
                        CAM_{feed.id.toUpperCase()}
                      </span>
                      <h4 className="text-white font-bold drop-shadow-md">{feed.name}</h4>
                    </div>
                    {isCritical && (
                      <div className="bg-red-500 text-white text-[10px] uppercase font-black tracking-widest px-2 py-1 rounded animate-pulse flex items-center gap-1 shadow-lg border border-red-400">
                        <AlertTriangle size={12} /> CRITICAL
                      </div>
                    )}
                 </div>

                 {/* AI Analytics Overlay */}
                 <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                    <div className="bg-black/60 backdrop-blur rounded-lg p-2 border border-white/10">
                       <p className="text-[9px] uppercase font-bold text-slate-400 mb-1 tracking-widest">Est. Dwell Time</p>
                       <p className="text-lg font-black text-white leading-none">{feed.waitTimeMinutes}m</p>
                    </div>
                    
                    <div className="flex gap-2">
                       <button className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-400 border border-sky-500/30 p-2 rounded-lg transition backdrop-blur flex items-center justify-center">
                         <Users size={16} />
                       </button>
                       <button className="bg-slate-800/80 hover:bg-slate-700 text-white p-2 rounded-lg transition backdrop-blur border border-white/10 text-[10px] font-black uppercase tracking-widest px-3">
                         Expand
                       </button>
                    </div>
                 </div>

               </motion.div>
             )
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}
