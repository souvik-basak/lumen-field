import { motion } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { CarFront, Clock, Zap, ShieldCheck, MapPin } from 'lucide-react';

export default function Parking() {
  const { waitTimes } = useVenueStore();
  const parkingNodes = waitTimes.filter(w => w.type === 'parking');

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
      className="p-4 md:p-8 pt-6 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-24 hidden-scrollbar"
    >
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">
          <CarFront className="text-orange-400" size={28} /> Parking Center
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Left Column: Your Pass & Quick Actions */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          <motion.section variants={itemVariants} className="bg-gradient-to-tr from-slate-800 via-slate-800 to-orange-900/30 rounded-[2.5rem] p-6 lg:p-8 border border-white/5 shadow-2xl relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-orange-400 mb-1">Active Pass</p>
                <h3 className="text-2xl lg:text-3xl font-black text-white">South Garage VIP</h3>
                <p className="text-sm font-medium text-slate-300 mt-1">Plate: WA-XYZ123</p>
              </div>
              <div className="bg-orange-500/20 p-3 rounded-2xl border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.2)]">
                <ShieldCheck className="text-orange-400" size={28} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="bg-slate-900/80 backdrop-blur border border-white/5 rounded-2xl p-4">
                <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Assigned Spot</p>
                <p className="text-2xl font-black text-white mt-1">Level 2</p>
                <p className="text-lg font-bold text-slate-300">Space 4B</p>
              </div>
              <div className="bg-slate-900/80 backdrop-blur border border-white/5 rounded-2xl p-4 flex flex-col justify-center">
                 <button className="w-full h-full bg-slate-800 hover:bg-slate-700 transition rounded-xl flex items-center justify-center gap-2 text-sm font-bold text-white border border-slate-700 border-b-4">
                   <MapPin size={16} /> Get Directions
                 </button>
              </div>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="grid grid-cols-2 gap-4">
            <div className="glass p-5 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:bg-white/5 transition cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-sky-500/10 flex items-center justify-center text-sky-400">
                <Zap size={24} />
              </div>
              <span className="font-bold text-sm tracking-wide">EV Charging</span>
            </div>
            <div className="glass p-5 rounded-[2rem] flex flex-col items-center text-center gap-3 hover:bg-white/5 transition cursor-pointer">
              <div className="w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                <Clock size={24} />
              </div>
              <span className="font-bold text-sm tracking-wide">Extend Time</span>
            </div>
          </motion.section>
        </div>

        {/* Right Column: Live Lot Status */}
        <div className="lg:col-span-5 flex flex-col">
          <motion.section variants={itemVariants} className="glass-dark border border-white/10 rounded-[2.5rem] p-6 lg:p-8 h-full flex flex-col">
            <h3 className="font-black mb-6 text-white tracking-tight text-xl flex items-center gap-3">
               Live Lot Status
            </h3>
            
            <div className="space-y-4 flex-1">
              {parkingNodes.map((w, index) => {
                 let fillPercentage = 0;
                 let color = '';
                 if (w.density === 'Low') { fillPercentage = 30; color = 'bg-emerald-500'; }
                 else if (w.density === 'Medium') { fillPercentage = 65; color = 'bg-yellow-500'; }
                 else if (w.density === 'High') { fillPercentage = 85; color = 'bg-orange-500'; }
                 else { fillPercentage = 98; color = 'bg-red-500'; }

                 return (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    key={w.id} 
                    className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex flex-col gap-3 group"
                  >
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-sm text-slate-100">{w.name}</h4>
                      <span className="text-xs font-black bg-slate-900 border border-slate-700 px-2 py-0.5 rounded-md">
                        {fillPercentage}% Full
                      </span>
                    </div>
                    
                    {/* Capacity Bar */}
                    <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${fillPercentage}%` }}
                        transition={{ duration: 1, delay: 0.5 }}
                        className={`h-full ${color}`}
                      />
                    </div>
                    
                    <div className="flex justify-between items-center mt-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{w.waitTimeMinutes}m Exit Delay</p>
                      {fillPercentage < 90 && (
                        <button className="text-[10px] font-black text-orange-400 uppercase tracking-widest hover:text-orange-300">
                          Reserve Spot
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })}
              
              {parkingNodes.length === 0 && (
                 <div className="p-8 text-center flex flex-col items-center justify-center text-slate-500">
                   <p className="font-medium text-sm">No live parking data available.</p>
                 </div>
              )}
            </div>
            
            <button className="w-full mt-8 bg-slate-800 hover:bg-slate-700 text-white font-bold uppercase tracking-widest text-xs py-4 rounded-xl transition border border-white/5">
              View All Options
            </button>
          </motion.section>
        </div>

      </div>
    </motion.div>
  );
}
