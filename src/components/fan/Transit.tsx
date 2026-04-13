import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { 
  Train, 
  MapPin, 
  CreditCard, 
  ChevronRight, 
  Clock, 
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';

export default function Transit() {
  const { waitTimes, activeStadiumId, matchMinute, transitPassBalance, topUpPass } = useVenueStore();
  const [selectedStation, setSelectedStation] = useState<string | null>(null);
  const [isTapping, setIsTapping] = useState(false);

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];
  const transitNodes = waitTimes.filter(w => w.type === 'transit');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Simulated Next Arrivals
  const nextArrivals = [
    { id: 't1', destination: 'City Center', time: '4 mins', status: 'On Time' },
    { id: 't2', destination: 'Airport Hub', time: '12 mins', status: 'Slight Delay' },
    { id: 't3', destination: 'Business District', time: '18 mins', status: 'On Time' },
  ];

  const handleTap = () => {
    setIsTapping(true);
    setTimeout(() => setIsTapping(false), 2000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 pt-6 space-y-8 max-w-7xl mx-auto pb-24"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Train className="text-sky-400" size={32} /> Journey Planner
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            {stadium.transit.name} • {stadium.transit.line}
          </p>
        </div>
        
        <div className="glass-dark border border-white/10 p-4 rounded-3xl flex items-center gap-6 shadow-xl">
           <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Digital Pass</span>
              <span className="text-xl font-black text-white">₹{transitPassBalance.toFixed(2)}</span>
           </div>
           <button 
            onClick={() => topUpPass(500)}
            className="bg-sky-500 hover:bg-sky-400 text-white p-2 rounded-xl transition shadow-lg shadow-sky-500/20 active:scale-95"
           >
             <TrendingUp size={18} />
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Smart Exit & Live Arrivals */}
        <div className="lg:col-span-8 space-y-8">
           
           {/* Smart Exit Guide */}
           <motion.section variants={itemVariants} className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 rounded-[2.5rem] border border-white/5 p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl"></div>
              
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <MapPin className="text-pink-500" size={20} /> Smart Exit Sequence
              </h3>

              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2">
                 {[
                   { step: '1', title: 'Your Seat', label: 'VIP SEC 104', color: 'bg-emerald-500' },
                   { step: '2', title: 'Gate Exit', label: 'Gate 4 (Clear)', color: 'bg-emerald-500' },
                   { step: '3', title: 'Station', label: stadium.transit.nearestStation, color: 'bg-sky-500' }
                 ].map((s, idx) => (
                    <>
                      <div key={s.step} className="flex flex-col items-center text-center group cursor-default">
                         <div className={`w-12 h-12 rounded-2xl ${s.color} flex items-center justify-center text-slate-950 shadow-lg mb-3 transition-transform group-hover:scale-110`}>
                            <span className="font-black text-lg">{s.step}</span>
                         </div>
                         <p className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-0.5">{s.title}</p>
                         <p className="text-sm font-bold text-white">{s.label}</p>
                      </div>
                      {idx < 2 && (
                        <div className="hidden md:block text-slate-700">
                          <ChevronRight size={32} strokeWidth={3} />
                        </div>
                      )}
                    </>
                 ))}
              </div>

              {matchMinute > 85 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-4 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex items-center gap-4"
                >
                   <div className="p-2 bg-orange-500 rounded-lg text-white">
                     <AlertCircle size={20} />
                   </div>
                   <p className="text-sm font-bold text-orange-200">
                     Match ending soon! Exit via **North Plaza** to catch the 9:15 PM Metro express.
                   </p>
                </motion.div>
              )}
           </motion.section>

           {/* Live Departure Board */}
           <motion.section variants={itemVariants} className="glass-dark rounded-[2.5rem] border border-white/5 p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-black text-white">Live Arrivals • {stadium.transit.nearestStation}</h3>
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                   <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                   Live Feedback
                </div>
              </div>

              <div className="space-y-4">
                 {nextArrivals.map((train) => (
                    <div key={train.id} className="bg-white/5 hover:bg-white/10 transition p-5 rounded-3xl border border-white/5 flex items-center justify-between group">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-sky-400 group-hover:scale-110 transition">
                            <Train size={24} />
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Platform 2</p>
                             <h4 className="text-lg font-black text-white">{train.destination}</h4>
                             <p className={`text-xs font-bold mt-0.5 ${train.status === 'On Time' ? 'text-emerald-400' : 'text-orange-400'}`}>
                               {train.status}
                             </p>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="text-2xl font-black text-white">{train.time}</p>
                          <p className="text-[10px] font-bold text-slate-500 uppercase">Estimated</p>
                       </div>
                    </div>
                 ))}
              </div>
           </motion.section>
        </div>

        {/* Right Column: Digital Wallet & Tap-to-Pay */}
        <div className="lg:col-span-4 space-y-8">
           
           <motion.section variants={itemVariants} className="bg-gradient-to-br from-sky-600 to-violet-700 rounded-[2.5rem] p-1 shadow-2xl">
              <div className="bg-slate-900/90 rounded-[2.3rem] p-8 backdrop-blur-xl relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Train size={120} />
                 </div>
                 
                 <h3 className="text-xs uppercase font-black tracking-widest text-sky-400 mb-6 flex items-center gap-2">
                    <CreditCard size={14} /> Smart Pass
                 </h3>

                 <div className="space-y-6 mb-10">
                    <div>
                       <p className="text-sm font-bold text-slate-400">Cardholder</p>
                       <p className="text-xl font-black text-white">Elite Fan #098</p>
                    </div>
                    <div>
                       <p className="text-sm font-bold text-slate-400">Network</p>
                       <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                          <p className="text-lg font-black text-white uppercase">{stadium.transit.name} Interconnected</p>
                       </div>
                    </div>
                 </div>

                 <button 
                  disabled={isTapping}
                  onClick={handleTap}
                  className={`w-full py-6 rounded-3xl font-black text-lg transition-all relative overflow-hidden flex items-center justify-center gap-3 border-b-4 border-slate-950 ${isTapping ? 'bg-emerald-500' : 'bg-white text-slate-900 hover:bg-sky-100 hover:scale-105 active:scale-95 shadow-xl shadow-white/10'}`}
                 >
                    {isTapping ? (
                      <>
                        <CheckCircle2 size={24} /> Valid Entry
                      </>
                    ) : (
                      <>
                        <ArrowRight size={24} /> Tap to Ride
                      </>
                    )}
                 </button>
              </div>
           </motion.section>

           <motion.section variants={itemVariants} className="glass-dark rounded-[2.5rem] p-8 border border-white/5">
              <h3 className="text-lg font-black text-white mb-6">Recent Rides</h3>
              <div className="space-y-4">
                 {[
                   { date: 'Today', station: stadium.transit.nearestStation, cost: '₹40.00' },
                   { date: 'April 11', station: 'Central Hub', cost: '₹25.00' }
                 ].map((ride, i) => (
                    <div key={i} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                       <div>
                          <p className="text-sm font-bold text-white">{ride.station}</p>
                          <p className="text-xs text-slate-500">{ride.date}</p>
                       </div>
                       <p className="font-black text-white">{ride.cost}</p>
                    </div>
                 ))}
                 <button className="w-full text-center text-xs font-bold text-sky-400 mt-4 hover:underline">View All History</button>
              </div>
           </motion.section>
        </div>

      </div>
    </motion.div>
  );
}

const CheckCircle2 = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);
