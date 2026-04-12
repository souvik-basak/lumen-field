import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { MapPin, Navigation2, Activity, Car, Coffee, LogOut, ArrowRightCircle, Scan } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Map logical IDs to specific percentage coordinates on the stadium SVG
const NODE_COORDINATES: Record<string, { top: string, left: string }> = {
  'g1': { top: '12%', left: '50%' }, // VIP Exit North
  'g2': { top: '50%', left: '12%' }, // Main Concourse Exit
  'g3': { top: '88%', left: '50%' }, // South Transit Gate
  'f1': { top: '30%', left: '22%' }, // Burgers
  'f2': { top: '75%', left: '78%' }, // Seattle Dog
  'f3': { top: '25%', left: '78%' }, // Craft Beer
  'r1': { top: '18%', left: '35%' }, // Toilet Sec 102
  'r2': { top: '82%', left: '30%' }, // Toilet Sec 105
  'r3': { top: '50%', left: '85%' }, // Toilet Sec 214
  'p1': { top: '5%', left: '20%' },  // North VIP Parking
  'p2': { top: '95%', left: '80%' }, // South Garage Parking
};

export default function SmartNavigation() {
  const { waitTimes } = useVenueStore();
  const [arMode, setArMode] = useState(false);
  
  const getDensityColor = (density: string) => {
    switch(density) {
      case 'Low': return 'bg-emerald-500/90 text-white border-emerald-400';
      case 'Medium': return 'bg-yellow-500/90 text-white border-yellow-400';
      case 'High': return 'bg-orange-500/90 text-white border-orange-400';
      case 'Critical': return 'bg-red-500/90 text-white border-red-400 animate-pulse';
      default: return 'bg-slate-700/90 text-slate-200 border-slate-600';
    }
  };

  const getDensityShadow = (density: string) => {
    switch(density) {
      case 'Low': return 'shadow-[0_0_10px_rgba(52,211,153,0.8)]';
      case 'Medium': return 'shadow-[0_0_10px_rgba(250,204,21,0.8)]';
      case 'High': return 'shadow-[0_0_10px_rgba(251,146,60,0.8)]';
      case 'Critical': return 'shadow-[0_0_15px_rgba(239,68,68,1)]';
      default: return '';
    }
  };

  const getDensityColorRaw = (density: string) => {
    switch(density) {
      case 'Low': return '#10b981';
      case 'Medium': return '#eab308';
      case 'High': return '#f97316';
      case 'Critical': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  const getTypeIcon = (type: string, size = 16) => {
    switch(type) {
      case 'parking': return <Car size={size} />;
      case 'exit': return <LogOut size={size} />;
      case 'food': return <Coffee size={size} />;
      case 'restroom': return <span className="font-bold font-sans text-xs" style={{fontSize: size-2}}>WC</span>;
      default: return <MapPin size={size} />;
    }
  };

  return (
    <div className="p-4 md:p-8 pt-6 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-24">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">Interactive Map</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => setArMode(!arMode)}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border transition ${arMode ? 'bg-sky-500/20 text-sky-400 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'glass border-white/10 hover:bg-white/10'}`}
          >
            <Scan size={16} className={arMode ? 'text-sky-400' : 'text-slate-400'} /> AR Lens
          </button>
          <button className="glass px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border border-white/10 hover:bg-white/10 transition hidden md:flex">
            <Activity size={16} className="text-pink-400" /> Live View
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Dynamic Viewport (Map or AR) */}
        <div className="lg:col-span-8 relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex">
          <AnimatePresence mode="wait">
             {!arMode ? (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 glass-dark p-4 bg-slate-900"
                >
                  <div className="absolute inset-0 p-8 flex items-center justify-center opacity-80 mix-blend-screen pointer-events-none">
                    <svg viewBox="0 0 800 1000" className="w-full h-full drop-shadow-2xl" preserveAspectRatio="xMidYMid meet">
                      <defs>
                        <linearGradient id="pitchGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#064e3b" />
                          <stop offset="100%" stopColor="#065f46" />
                        </linearGradient>
                        <pattern id="yardlines" width="100" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 0 0 L 100 0" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" />
                        </pattern>
                        <filter id="glow">
                          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                          <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                          </feMerge>
                        </filter>
                      </defs>

                      <ellipse cx="400" cy="500" rx="380" ry="480" fill="#0f172a" stroke="#334155" strokeWidth="6" />
                      <ellipse cx="400" cy="500" rx="360" ry="460" fill="none" stroke="#1e293b" strokeWidth="15" />
                      <path d="M 120 500 A 280 380 0 1 1 680 500 A 280 380 0 1 1 120 500" fill="none" stroke="#475569" strokeWidth="40" opacity="0.3" />
                      <ellipse cx="400" cy="500" rx="280" ry="380" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
                      <ellipse cx="400" cy="500" rx="230" ry="320" fill="#334155" stroke="#0f172a" strokeWidth="2" />
                      <ellipse cx="400" cy="500" rx="180" ry="260" fill="#475569" stroke="#0f172a" strokeWidth="2" />
                      <rect x="250" y="280" width="300" height="440" rx="20" fill="url(#pitchGrad)" stroke="#ffffff" strokeWidth="3" filter="url(#glow)" />
                      <rect x="250" y="280" width="300" height="50" rx="20" fill="#0f172a" />
                      <rect x="250" y="280" width="300" height="50" fill="transparent" stroke="#ffffff" strokeWidth="2" />
                      <rect x="250" y="670" width="300" height="50" rx="20" fill="#0f172a" />
                      <rect x="250" y="670" width="300" height="50" fill="transparent" stroke="#ffffff" strokeWidth="2" />
                      <rect x="250" y="330" width="300" height="340" fill="url(#yardlines)" />
                      <circle cx="400" cy="500" r="25" fill="none" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
                      <path d="M 400 480 L 400 520" stroke="#ffffff" strokeWidth="2" opacity="0.6" />
                      <text x="270" y="505" fill="rgba(255,255,255,0.4)" fontSize="20" fontWeight="bold" fontFamily="monospace">50</text>
                      <text x="500" y="505" fill="rgba(255,255,255,0.4)" fontSize="20" fontWeight="bold" fontFamily="monospace">50</text>
                    </svg>
                  </div>

                  {waitTimes.map((node, i) => {
                    const coords = NODE_COORDINATES[node.id] || { top: '50%', left: '50%' };
                    const nodeColor = getDensityColorRaw(node.density);
                    
                    return (
                      <motion.div
                        key={node.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={`absolute z-10 flex flex-col items-center group cursor-pointer`}
                        style={{ top: coords.top, left: coords.left, transform: 'translate(-50%, -50%)' }}
                      >
                        <span className="relative flex h-8 w-8 md:h-10 md:w-10 items-center justify-center">
                          {node.density === 'Critical' && (
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ backgroundColor: nodeColor }}></span>
                          )}
                          <div 
                            className={cn("relative w-7 h-7 md:w-9 md:h-9 rounded-full border-2 border-slate-900 flex items-center justify-center text-slate-900", getDensityShadow(node.density))}
                            style={{ backgroundColor: nodeColor }}
                          >
                            {getTypeIcon(node.type)}
                          </div>
                        </span>
                        
                        <div className={cn("absolute top-10 md:top-12 flex flex-col items-center min-w-max px-3 py-1.5 md:py-2 rounded-xl backdrop-blur-xl border border-white/20 text-[10px] md:text-xs shadow-2xl transition-all font-sans z-20 md:opacity-0 md:group-hover:opacity-100 group-hover:scale-110 origin-top pointer-events-none", getDensityColor(node.density))}>
                          <span className="font-black tracking-wide drop-shadow-md">{node.name}</span>
                          <span className="font-bold opacity-90 mt-0.5">{node.waitTimeMinutes}m wait</span>
                        </div>
                      </motion.div>
                    )
                  })}

                  <motion.div 
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute z-30 flex flex-col items-center pointer-events-none"
                    style={{ top: '65%', left: '25%', transform: 'translate(-50%, -50%)' }}
                  >
                    <MapPin size={38} className="text-pink-500 fill-pink-500/20 drop-shadow-[0_0_15px_rgba(236,72,153,1)] stroke-[1.5]" />
                    <span className="text-[10px] md:text-sm bg-slate-900 border border-pink-500 text-white px-3 py-1 rounded-full mt-1 font-black shadow-2xl tracking-widest uppercase">You Are Here</span>
                  </motion.div>
                </motion.div>
             ) : (
                <motion.div 
                  key="ar"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-slate-800"
                >
                  {/* Mock Camera Feed Background */}
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577934415848-0ca1a6eb12cf?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40"></div>
                  <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                  
                  {/* AR Viewfinder elements */}
                  <div className="absolute inset-4 border-2 border-white/20 rounded-3xl pointer-events-none flex flex-col items-center justify-center mix-blend-overlay">
                     <Scan size={200} className="text-white/20" strokeWidth={1} />
                  </div>
                  
                  {/* Floating AR Wayfinding Path */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                     <defs>
                       <linearGradient id="arPath" x1="0%" y1="100%" x2="50%" y2="30%">
                         <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                         <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
                       </linearGradient>
                     </defs>
                     <motion.path 
                       d="M 400 700 Q 500 500 300 300" 
                       fill="none" 
                       stroke="url(#arPath)" 
                       strokeWidth="24" 
                       strokeLinecap="round" 
                       initial={{ pathLength: 0 }}
                       animate={{ pathLength: 1 }}
                       transition={{ duration: 1.5, ease: "easeInOut" }}
                     />
                  </svg>
                  
                  {/* Floating AR Target Node */}
                  <motion.div 
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <motion.div animate={{ y: [0,-10,0] }} transition={{ repeat: Infinity, duration: 2 }}>
                       <div className="bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.8)] border-[3px] border-white">
                         <Coffee size={32} />
                       </div>
                    </motion.div>
                    <div className="mt-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center shadow-2xl">
                       <h4 className="font-black text-white text-lg">Craft Beer Station</h4>
                       <p className="font-bold text-emerald-400 text-sm">120 ft • Wait: 5m</p>
                    </div>
                  </motion.div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Quick Route Suggestions sidebar */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <div className="glass-dark border border-white/10 rounded-[2.5rem] p-6 shadow-xl h-full flex flex-col">
            <h3 className="font-black mb-6 text-white tracking-tight text-xl flex items-center gap-3">
              <Navigation2 size={24} className="text-violet-400" /> Fast Routes
            </h3>
            
            <div className="space-y-4 flex-1">
              {waitTimes.filter(w => w.density === 'Low' || w.density === 'Medium').slice(0, 5).map((w, index) => {
                 const wcPrimary = getDensityColorRaw(w.density);
                 return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    key={w.id} 
                    className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition cursor-pointer group"
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-900 border border-slate-900" style={{backgroundColor: wcPrimary, boxShadow: `0 0 10px ${wcPrimary}80`}}>
                        {getTypeIcon(w.type, 14)}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-white transition-colors">{w.name}</h4>
                        <p className="text-xs font-bold text-slate-400 capitalize mt-0.5">{w.type} • {w.waitTimeMinutes}m</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 group-hover:bg-violet-500/20 p-3 rounded-full transition shadow-md border border-slate-700 group-hover:border-violet-500/50">
                      <ArrowRightCircle size={18} className="text-violet-400" />
                    </button>
                  </motion.div>
                )
              })}
              
              {waitTimes.filter(w => w.density === 'Low' || w.density === 'Medium').length === 0 && (
                 <div className="p-8 text-center flex flex-col items-center justify-center text-slate-400 bg-red-500/5 rounded-[2rem] border border-dashed border-red-500/30 h-48">
                   <Activity size={32} className="text-red-400 mb-3" />
                   <p className="font-bold">Gridlock Alert</p>
                   <p className="text-xs mt-1">All mapped routes are currently congested. Shelter in place.</p>
                 </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
