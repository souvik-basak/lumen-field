import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    AlertCircle, 
    X, 
    ShieldAlert, 
    Stethoscope, 
    Loader2, 
    CheckCircle2, 
    MapPin,
    AlertTriangle
} from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';

export default function SOSSystem() {
  const { sosActive, sosType, sosStatus, triggerSOS, cancelSOS } = useVenueStore();
  const [showModal, setShowModal] = useState(false);
  const [pressProgress, setPressProgress] = useState(0);
  const [isPressing, setIsPressing] = useState(false);
  const pressTimer = useRef<any>(null);

  // Long press logic
  const startPress = (e: React.MouseEvent | React.TouchEvent) => {
    // Prevent default context menu or scrolling on mobile during hold
    if (e.type === 'touchstart') {
      // e.preventDefault(); // Removing to avoid potential scroll issues if user just taps
    }
    
    if (sosActive) return;
    setIsPressing(true);
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 2000; 

    if (pressTimer.current) clearInterval(pressTimer.current);

    pressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPressProgress(progress);
      
      if (progress >= 100) {
        if (pressTimer.current) clearInterval(pressTimer.current);
        pressTimer.current = null;
        setShowModal(true);
        setIsPressing(false);
        setPressProgress(0);
      }
    }, 60); // 60fps for smoother progress
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearInterval(pressTimer.current);
      pressTimer.current = null;
    }
    setIsPressing(false);
    setPressProgress(0);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pressTimer.current) clearInterval(pressTimer.current);
    };
  }, []);

  return (
    <>
      {/* Global Floating SOS Button */}
      <AnimatePresence>
        {!sosActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed bottom-24 right-4 z-[90] md:bottom-8 md:right-8"
          >
            <div className="relative group">
              {/* Pulsing rings */}
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping"></div>
              <div className="absolute inset-0 rounded-full bg-red-500/20 animate-pulse delay-75"></div>
              
              <button
                onMouseDown={startPress}
                onMouseUp={endPress}
                onMouseLeave={endPress}
                onTouchStart={startPress}
                onTouchEnd={endPress}
                onContextMenu={(e) => e.preventDefault()}
                className="relative w-16 h-16 md:w-20 md:h-20 bg-red-600 hover:bg-red-600 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.5)] flex flex-col items-center justify-center gap-0.5 border-4 border-white/20 transition-transform active:scale-90"
              >
                <AlertCircle className="text-white" size={28} strokeWidth={3} />
                <span className="text-[10px] font-black text-white uppercase tracking-tighter">Hold SOS</span>
                
                {/* Circular Progress Overlay */}
                <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                  <circle
                    cx="50%"
                    cy="50%"
                    r="45%"
                    fill="none"
                    stroke="white"
                    strokeWidth="4"
                    strokeDasharray="280"
                    strokeDashoffset={280 - (280 * pressProgress) / 100}
                    className="transition-all duration-75"
                  />
                </svg>
              </button>
              
              {/* Tooltip */}
              <div className="absolute bottom-full right-0 mb-4 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-48 text-right">
                <div className="bg-slate-900 border border-white/10 p-2 rounded-xl shadow-xl">
                  <p className="text-[10px] text-slate-300 font-bold leading-tight">Emergency? Hold for 2s to alert Command Center</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Category Selection Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 via-emerald-500 to-red-500"></div>
              
              <button 
                onClick={() => setShowModal(false)}
                className="absolute top-6 right-6 text-slate-500 hover:text-white transition"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center text-red-500 mx-auto mb-4">
                  <AlertTriangle size={36} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-black text-white tracking-tight">Emergency Assistance</h2>
                <p className="text-sm text-slate-400 mt-2 font-medium">Select type of help needed at your seat</p>
              </div>

              <div className="space-y-4">
                <button
                  onClick={() => { triggerSOS('Medical'); setShowModal(false); }}
                  className="w-full flex items-center gap-4 p-5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-3xl transition group"
                >
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                    <Stethoscope size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-emerald-100 uppercase text-xs tracking-widest">Medical</p>
                    <p className="text-sm text-emerald-400 font-medium mt-0.5">Injuries or health issues</p>
                  </div>
                </button>

                <button
                  onClick={() => { triggerSOS('Security'); setShowModal(false); }}
                  className="w-full flex items-center gap-4 p-5 bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 rounded-3xl transition group"
                >
                  <div className="w-12 h-12 bg-sky-500 rounded-2xl flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition">
                    <ShieldAlert size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-sky-100 uppercase text-xs tracking-widest">Security</p>
                    <p className="text-sm text-sky-400 font-medium mt-0.5">Safety or crowd concerns</p>
                  </div>
                </button>
              </div>

              <p className="text-[10px] text-slate-500 text-center mt-8 font-bold uppercase tracking-widest">Command Center will receive your exact seat: VIP SEC 104 • SEAT 12</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOS Active Tracker Overlay */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-[100] md:bottom-8 md:max-w-md md:left-auto md:right-8"
          >
            <div className="bg-slate-900 border-2 border-red-500 rounded-[2rem] p-6 shadow-2xl relative overflow-hidden">
               {/* Animated Background Pulse */}
               <div className="absolute inset-0 bg-red-500/5 animate-pulse"></div>
               
               <div className="relative z-10">
                 <div className="flex justify-between items-start mb-4">
                   <div className="flex items-center gap-3">
                     <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white animate-bounce">
                        <AlertCircle size={20} />
                     </div>
                     <div>
                       <h3 className="font-black text-white leading-tight uppercase tracking-tight text-sm">{sosType} Emergency Active</h3>
                       <div className="flex items-center gap-2 mt-1">
                         <MapPin size={12} className="text-slate-500" />
                         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">VIP SEC 104 • SEAT 12</span>
                       </div>
                     </div>
                   </div>
                   <button 
                     onClick={cancelSOS}
                     className="text-[10px] font-black uppercase text-slate-500 hover:text-white border border-slate-800 px-3 py-1.5 rounded-full hover:bg-white/5 transition"
                   >
                     Cancel
                   </button>
                 </div>

                 {/* Status Progress */}
                 <div className="space-y-4">
                    <div className="bg-slate-950 p-4 rounded-2xl flex items-center justify-between border border-white/5">
                       <span className="text-xs font-bold text-slate-300">Status: {sosStatus}</span>
                       {sosStatus === 'Dispatching' || sosStatus === 'Dispatched' ? (
                         <Loader2 className="text-rose-500 animate-spin" size={16} />
                       ) : (
                         <CheckCircle2 className="text-emerald-500" size={16} />
                       )}
                    </div>

                    <div className="relative h-2 bg-slate-950 rounded-full overflow-hidden border border-white/5">
                       <motion.div 
                        initial={{ width: '10%' }}
                        animate={{ width: sosStatus === 'Dispatching' ? '15%' : sosStatus === 'Dispatched' ? '65%' : '100%' }}
                        className="h-full bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                       />
                    </div>
                    
                    <p className="text-[10px] text-center text-slate-500 font-medium">Please remain at your seat. Our response team is tracking your beacon.</p>
                 </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
