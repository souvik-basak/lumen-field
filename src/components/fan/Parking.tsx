import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { 
  Car, 
  MapPin, 
  Search, 
  Clock, 
  Navigation, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight
} from 'lucide-react';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';

export default function Parking() {
  const { waitTimes, activeStadiumId, carLocation, setCarLocation } = useVenueStore();
  const [isSaving, setIsSaving] = useState(false);
  const [tempSection, setTempSection] = useState('');
  const [tempLevel, setTempLevel] = useState('');

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];
  
  // Specifically filter parking nodes
  const parkingNodes = waitTimes.filter(w => w.type === 'parking');

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const saveLocation = () => {
    setIsSaving(true);
    setTimeout(() => {
      setCarLocation({ section: tempSection || 'B4', level: tempLevel || 'L2' });
      setIsSaving(false);
    }, 1000);
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="p-4 md:p-8 pt-6 space-y-8 max-w-7xl mx-auto pb-24"
    >
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <Car className="text-emerald-400" size={32} /> Parking Hub
          </h2>
          <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">
            {stadium.name} • Private Vehicle Center
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Find My Car & Lot Status */}
        <div className="lg:col-span-7 space-y-8">
           
           {/* Section 1: Find My Car */}
           <motion.section variants={itemVariants} className="bg-gradient-to-br from-slate-900 to-slate-950 rounded-[2.5rem] border border-white/5 p-6 md:p-8 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                 <div>
                    <h3 className="text-xl font-black text-white">Find My Car</h3>
                    <p className="text-sm font-medium text-slate-400 mt-1">Never lose your vehicle in the crowd</p>
                 </div>
                 <div className="bg-emerald-500/20 p-3 rounded-2xl border border-emerald-500/30">
                    <Search className="text-emerald-400" size={24} />
                 </div>
              </div>

              <AnimatePresence mode="wait">
                 {carLocation ? (
                   <motion.div 
                    key="saved"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-emerald-500/10 border border-emerald-500/30 rounded-3xl p-6 flex items-center justify-between relative z-10"
                   >
                      <div className="flex items-center gap-6">
                         <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-emerald-500/20">
                            {carLocation.section}
                         </div>
                         <div>
                            <p className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Saved Location</p>
                            <h4 className="text-2xl font-black text-white">Level {carLocation.level}</h4>
                            <p className="text-sm font-bold text-slate-400 mt-1 flex items-center gap-1">
                               <MapPin size={14} /> VIP Parking Wing
                            </p>
                         </div>
                      </div>
                      <button 
                        onClick={() => setCarLocation(null)}
                        className="text-xs font-bold text-slate-500 hover:text-white transition uppercase tracking-widest"
                      >
                        Reset
                      </button>
                   </motion.div>
                 ) : (
                   <motion.div 
                    key="input"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-2 gap-4 relative z-10"
                   >
                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                         <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Section</label>
                         <input 
                          type="text" 
                          placeholder="e.g. B4"
                          value={tempSection}
                          onChange={(e) => setTempSection(e.target.value)}
                          className="w-full bg-transparent text-white font-black text-lg focus:outline-none mt-1"
                         />
                      </div>
                      <div className="bg-slate-900 border border-white/5 rounded-2xl p-4">
                         <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Level</label>
                         <input 
                          type="text" 
                          placeholder="e.g. L2"
                          value={tempLevel}
                          onChange={(e) => setTempLevel(e.target.value)}
                          className="w-full bg-transparent text-white font-black text-lg focus:outline-none mt-1"
                         />
                      </div>
                      <button 
                        onClick={saveLocation}
                        disabled={isSaving}
                        className="col-span-2 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-black rounded-2xl transition shadow-xl mt-2 flex items-center justify-center gap-2"
                      >
                        {isSaving ? 'Verifying...' : 'Save Current Spot'}
                      </button>
                   </motion.div>
                 )}
              </AnimatePresence>
           </motion.section>

           {/* Section 2: Lot Occupancy */}
           <motion.section variants={itemVariants} className="glass-dark rounded-[2.5rem] border border-white/5 p-6 md:p-8">
              <h3 className="text-xl font-black text-white mb-6">Parking Lot Status</h3>
              <div className="space-y-4">
                 {parkingNodes.map((node) => {
                    const occupancy = node.density === 'Critical' ? 98 : node.density === 'High' ? 85 : node.density === 'Medium' ? 60 : 25;
                    const color = node.density === 'Critical' ? 'bg-red-500' : node.density === 'High' ? 'bg-orange-500' : 'bg-emerald-500';
                    
                    return (
                      <div key={node.id} className="bg-white/5 p-5 rounded-3xl border border-white/5 group hover:bg-white/10 transition">
                         <div className="flex justify-between items-center mb-3">
                            <h4 className="font-bold text-white flex items-center gap-2">
                               <div className={`w-2 h-2 rounded-full ${color}`}></div>
                               {node.name}
                            </h4>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                               {node.waitTimeMinutes}m exit time
                            </span>
                         </div>
                         <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${occupancy}%` }}
                              className={`h-full ${color} shadow-[0_0_10px_rgba(16,185,129,0.3)]`}
                            />
                         </div>
                         <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                            <span>{100 - occupancy}% Vacant</span>
                            <span>{occupancy}% Filled</span>
                         </div>
                      </div>
                    );
                 })}
              </div>
           </motion.section>
        </div>

        {/* Right Column: Exit Strategy & Premium */}
        <div className="lg:col-span-5 space-y-8">
           
           {/* Exit Traffic Strategy */}
           <motion.section variants={itemVariants} className="bg-slate-900 border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                 <div className="p-3 bg-red-500/10 text-red-500 rounded-2xl border border-red-500/20">
                    <AlertTriangle size={24} />
                 </div>
                 <h3 className="text-lg font-black text-white">Exit Strategy</h3>
              </div>

              <div className="space-y-6">
                 <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xs border border-white/10">1</div>
                       <div className="w-0.5 h-full bg-slate-800 my-1"></div>
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-sm">Pre-Post Crowd Check</h4>
                       <p className="text-xs text-slate-500 mt-1 leading-relaxed">Traffic is currently **HEAVY** on the North Orbital. Stay in the fan zone for 20 more minutes to save 40 mins of idling.</p>
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                       <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-white font-black text-xs border border-white/10">2</div>
                    </div>
                    <div>
                       <h4 className="font-bold text-white text-sm">Optimal Route</h4>
                       <div className="bg-slate-950 p-3 rounded-xl border border-white/5 mt-2 flex items-center justify-between group cursor-pointer hover:border-emerald-500/50 transition">
                          <div className="flex items-center gap-3">
                             <Navigation size={16} className="text-emerald-400" />
                             <span className="text-xs font-bold text-slate-300">West Bypass via Gate 2</span>
                          </div>
                          <ChevronRight size={16} className="text-slate-600 group-hover:text-white transition" />
                       </div>
                    </div>
                 </div>
              </div>
           </motion.section>

           {/* Security Verification */}
           <motion.section variants={itemVariants} className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-[2.5rem] p-8 shadow-xl text-white relative overflow-hidden">
              <div className="absolute right-0 bottom-0 p-4 opacity-10">
                 <ShieldCheck size={120} />
              </div>
              <div className="relative z-10">
                 <ShieldCheck className="mb-4" size={32} />
                 <h3 className="text-xl font-black mb-2 leading-tight">Secure Parking Pass</h3>
                 <p className="text-sm font-medium text-emerald-100 opacity-80 leading-relaxed mb-6">
                    Verified Digital Ticket #4412-A. Present this QR at the exit for automatic boom-barrier opening.
                 </p>
                 <button className="bg-white text-emerald-700 font-black py-3 px-6 rounded-xl hover:scale-105 active:scale-95 transition shadow-lg flex items-center gap-2">
                    Show QR <ChevronRight size={18} />
                 </button>
              </div>
           </motion.section>
        </div>

      </div>
    </motion.div>
  );
}
