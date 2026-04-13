import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { 
  Camera, AlertTriangle, Users, Wifi, Maximize, ShieldCheck, 
  Crosshair, Plane, ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Expand, Shrink, LocateFixed 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';

const CAM_LABELS = [
  'GATE EAST • CAM-1',
  'NORTH STAND • CAM-2',
  'CONCOURSE A • CAM-3',
  'VIP SECTOR • CAM-4',
];

export default function SecurityFeeds() {
  const { waitTimes, activeStadiumId, sosActive, sosStatus } = useVenueStore();
  const [selectedFeed, setSelectedFeed] = useState<string | null>(null);
  const [activeFeeds, setActiveFeeds] = useState<any[]>([]);

  // Mega Upgrade States
  const [cvMode, setCvMode] = useState(false);
  const [droneDeployed, setDroneDeployed] = useState(false);
  const [ptzStates, setPtzStates] = useState<Record<string, { x: number, y: number, zoom: number }>>({});

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];

  // Initialize PTZ array mappings as feeds update
  useEffect(() => {
    // Exclude concession stands (food) from the tactical security camera array
    const sorted = [...waitTimes]
      .filter(w => w.type !== 'food')
      .sort((a, b) => b.waitTimeMinutes - a.waitTimeMinutes)
      .slice(0, 4);
    setActiveFeeds(sorted);
    
    setPtzStates(prev => {
      const newState = { ...prev };
      sorted.forEach(f => {
        if (!newState[f.id]) newState[f.id] = { x: 0, y: 0, zoom: 1 };
      });
      return newState;
    });
  }, [waitTimes]);

  const handleDroneDeploy = () => {
    if (droneDeployed) {
      setDroneDeployed(false);
      toast('UAV Recalled', { icon: '🛬' });
    } else {
      toast.success('UAV Scrambled! Rerouting overhead feed...', { icon: '🛫' });
      setDroneDeployed(true);
    }
  };

  const criticalCount = activeFeeds.filter(f => f.density === 'Critical').length;

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-[1600px] mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-violet-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-violet-500/20">
              <Camera size={28} />
            </div>
            {stadium.city} Security Feeds
          </h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
            AI-Powered Threat Detection • {stadium.name}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {sosActive && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 rounded-2xl border border-red-500 shadow-lg shadow-red-500/20 text-white font-black text-xs uppercase tracking-widest animate-pulse"
            >
              <AlertTriangle size={14} /> Emergency Active — VIP SEC 104
            </motion.div>
          )}
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/30">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
            <span className="text-xs font-black uppercase tracking-wider">Recording</span>
          </div>
          <button 
            onClick={() => setCvMode(!cvMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              cvMode 
                ? 'bg-sky-500/20 text-sky-400 border-sky-500/50 shadow-[0_0_15px_rgba(14,165,233,0.3)] animate-pulse' 
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Crosshair size={14} /> CV Tracking
          </button>

          <button 
            onClick={handleDroneDeploy}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
              droneDeployed 
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' 
                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Plane size={14} /> {droneDeployed ? 'Recall UAV' : 'Scramble Drone'}
          </button>
          
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-slate-400 rounded-xl border border-white/5">
            <Wifi size={14} className="text-emerald-400" />
            <span className="text-xs font-black">{4 - criticalCount} Clear / {criticalCount} Flagged</span>
          </div>
        </div>
      </div>

      {/* Main Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
        <AnimatePresence>
          {activeFeeds.map((feed, index) => {
            const isCritical = feed.density === 'Critical';
            const isHigh = feed.density === 'High';
            
            const videoId = stadium.videoIds[index % stadium.videoIds.length];
            const finalVideoId = droneDeployed && index === 0 ? 'AQeni9GZUtk' : videoId; 
            
            const isExpanded = selectedFeed === feed.id;
            const ptz = ptzStates[feed.id] || { x: 0, y: 0, zoom: 1 };

            const updatePTZ = (e: React.MouseEvent, type: 'pan-up' | 'pan-down' | 'pan-left' | 'pan-right' | 'zoom-in' | 'zoom-out') => {
              e.stopPropagation();
              setPtzStates(prev => {
                const s = { ...prev[feed.id] };
                if (type === 'pan-up') s.y += 20;
                if (type === 'pan-down') s.y -= 20;
                if (type === 'pan-left') s.x += 20;
                if (type === 'pan-right') s.x -= 20;
                if (type === 'zoom-in') s.zoom = Math.min(s.zoom + 0.3, 3);
                if (type === 'zoom-out') {
                   s.zoom = Math.max(s.zoom - 0.3, 1);
                   if (s.zoom === 1) { s.x = 0; s.y = 0; }
                }
                return { ...prev, [feed.id]: s };
              });
            };

            return (
              <motion.div
                key={feed.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className={`relative rounded-[2.5rem] overflow-hidden bg-slate-950 group cursor-pointer border-2 transition-all ${
                  isCritical
                    ? 'border-red-600 shadow-[0_0_40px_rgba(220,38,38,0.25)]'
                    : isHigh
                    ? 'border-orange-500/50 shadow-[0_0_20px_rgba(234,88,12,0.1)]'
                    : 'border-slate-800 hover:border-violet-500/30'
                }`}
                onClick={() => setSelectedFeed(isExpanded ? null : feed.id)}
              >
                {/* YouTube Embed */}
                <div className="aspect-video relative bg-slate-900 overflow-hidden">
                  <motion.div 
                    className="w-full h-full absolute inset-0"
                    animate={{ scale: ptz.zoom, x: ptz.x, y: ptz.y }}
                    transition={{ type: "spring", stiffness: 120, damping: 20 }}
                  >
                    <iframe
                      className="w-full h-full absolute inset-0 pointer-events-none"
                      src={`https://www.youtube-nocookie.com/embed/${finalVideoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${finalVideoId}&start=12`}
                      allow="autoplay; encrypted-media"
                      loading="lazy"
                      title={`Security Feed ${index + 1}`}
                    />
                  </motion.div>

                  {/* AI Threat Tracking Pass */}
                  <AnimatePresence>
                    {cvMode && isCritical && (
                       <>
                         <ThreatBox delay={0} />
                         <ThreatBox delay={0.5} />
                       </>
                    )}
                  </AnimatePresence>

                  {/* HUD overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none z-10" />

                  {/* Scan line */}
                  <motion.div
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-400/30 to-transparent z-20 pointer-events-none"
                    style={{ top: '0%' }}
                  />

                  {/* Top bar – Camera ID */}
                  <div className="absolute top-0 left-0 right-0 z-30 flex justify-between items-start p-5">
                    <div>
                      <span className="text-[9px] font-black uppercase tracking-widest bg-black/80 backdrop-blur text-violet-300 px-3 py-1 rounded-lg border border-violet-500/20">
                        {droneDeployed && index === 0 ? 'AERIAL UAV T-1' : CAM_LABELS[index]}
                      </span>
                      <h4 className="text-white font-black drop-shadow-2xl mt-2 text-lg">{feed.name}</h4>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {isCritical && (
                        <span className="bg-red-600 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 animate-pulse shadow-xl">
                          <AlertTriangle size={10} /> CRITICAL
                        </span>
                      )}
                      {isHigh && !isCritical && (
                        <span className="bg-orange-500/80 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <AlertTriangle size={10} /> ELEVATED
                        </span>
                      )}
                      {!isCritical && !isHigh && (
                        <span className="bg-emerald-500/80 text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                          <ShieldCheck size={10} /> CLEAR
                        </span>
                      )}
                    </div>
                  </div>

                  {/* PTZ Remote Joystick */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
                        className="absolute right-5 inset-y-0 flex flex-col justify-center gap-2 z-40"
                      >
                         <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col gap-2">
                           <button onClick={(e) => updatePTZ(e, 'pan-up')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><ArrowUp size={16} /></button>
                           <div className="flex gap-2">
                             <button onClick={(e) => updatePTZ(e, 'pan-left')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white outline-none border-none transition-all"><ArrowLeft size={16} /></button>
                             <button onClick={(e) => updatePTZ(e, 'pan-right')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><ArrowRight size={16} /></button>
                           </div>
                           <button onClick={(e) => updatePTZ(e, 'pan-down')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white transition-all"><ArrowDown size={16} /></button>
                         </div>
                         <div className="bg-black/60 backdrop-blur-md border border-white/20 rounded-2xl p-2 flex flex-col gap-2 mt-2">
                           <button onClick={(e) => updatePTZ(e, 'zoom-in')} className="p-2 bg-sky-500/20 hover:bg-sky-500/40 border border-sky-500/30 rounded-xl text-sky-400 transition-all"><Expand size={16} /></button>
                           <button onClick={(e) => updatePTZ(e, 'zoom-out')} className="p-2 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/5 text-white transition-all"><Shrink size={16} /></button>
                         </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* AI Threat Analysis Footer */}
      <div className="glass-dark rounded-[2.5rem] p-8 border border-white/5 shadow-xl">
        <h3 className="text-lg font-black text-white mb-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-violet-600 rounded-xl flex items-center justify-center text-white">
            <ShieldCheck size={16} />
          </div>
          AI Threat Assessment Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { label: 'Monitored Zones', value: activeFeeds.length.toString(), color: 'text-sky-400' },
            { label: 'Threats Detected', value: criticalCount.toString(), color: 'text-red-400' },
            { label: 'Avg Crowd Density', value: `${Math.floor(activeFeeds.reduce((a, b) => a + b.waitTimeMinutes, 0) / Math.max(1, activeFeeds.length))} min`, color: 'text-amber-400' },
            { label: 'System Status', value: sesStatus(sosActive), color: sosActive ? 'text-red-400 animate-pulse' : 'text-emerald-400' },
          ].map((stat) => (
            <div key={stat.label} className="bg-slate-900/80 rounded-3xl p-6 border border-white/5">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function sesStatus(sosActive: boolean) {
  return sosActive ? 'EMERGENCY' : 'NOMINAL';
}

function ThreatBox({ delay }: { delay: number }) {
  const [target, setTarget] = useState({ x: '50%', y: '50%', scale: 1 });

  // Simulate jittering hunt algorithm
  useEffect(() => {
    const interval = setInterval(() => {
      setTarget({
        x: `${Math.floor(Math.random() * 60 + 20)}%`, // Random between 20% and 80%
        y: `${Math.floor(Math.random() * 60 + 20)}%`,
        scale: Math.random() * 0.4 + 0.8
      });
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, left: target.x, top: target.y, scale: target.scale }}
      transition={{ opacity: { delay }, left: { type: 'spring', damping: 30 }, top: { type: 'spring', damping: 30 } }}
      className="absolute w-24 h-32 z-30 pointer-events-none -translate-x-1/2 -translate-y-1/2"
    >
       {/* UI Corners linking to threat bounding box */}
       <div className="absolute inset-0 border-2 border-red-500/50 bg-red-500/10" />
       <div className="absolute top-0 left-0 w-3 h-3 border-t-4 border-l-4 border-red-500" />
       <div className="absolute top-0 right-0 w-3 h-3 border-t-4 border-r-4 border-red-500" />
       <div className="absolute bottom-0 left-0 w-3 h-3 border-b-4 border-l-4 border-red-500" />
       <div className="absolute bottom-0 right-0 w-3 h-3 border-b-4 border-r-4 border-red-500" />
       
       <div className="absolute -top-6 left-0 bg-red-600 px-1 py-0.5 rounded text-[8px] font-mono text-white font-black whitespace-nowrap">
          THREAT: {Math.floor(Math.random() * 90 + 10)}%
       </div>
    </motion.div>
  );
}
