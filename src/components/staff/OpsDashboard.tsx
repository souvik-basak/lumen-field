import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { 
  AlertCircle, 
  Users, 
  Activity, 
  ChevronsUp, 
  Maximize2, 
  Shield, 
  MapPin,
  Bell,
  Stethoscope,
  ShieldAlert,
  Send,
  Loader2,
  CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';
import VenueMap from './VenueMap';

import { useEffect, useState } from 'react';

export default function OpsDashboard() {
  const [activePulse, setActivePulse] = useState<string | null>(null);
  const [pulseSuccess, setPulseSuccess] = useState<string | null>(null);
  const [activeZoneAction, setActiveZoneAction] = useState<string | null>(null);

  const { 
    waitTimes, 
    alerts, 
    sosActive, 
    sosType, 
    sosStatus, 
    activeStadiumId,
    setStadium,
    addAlert
  } = useVenueStore();

  useEffect(() => {
    if (!activeStadiumId) {
      setStadium('city_kolkata');
    }
  }, [activeStadiumId, setStadium]);


  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];

  const totalCrowdScore = waitTimes.reduce((acc, curr) => acc + curr.waitTimeMinutes, 0);
  const criticalZones = waitTimes.filter(w => w.density === 'Critical' || w.density === 'High');

  // Simulated chart data
  const mockHistoryData = Array.from({length: 24}).map((_, i) => {
    return Math.max(10, Math.min(100, Math.floor(Math.sin(i / 3) * 30 + 50 + (Math.random() * 20))));
  });
  mockHistoryData[23] = Math.min(100, Math.floor(totalCrowdScore / Math.max(1, waitTimes.length)) * 2);

  const handlePulse = (label: string, msg: string) => {
    setActivePulse(label);
    setTimeout(() => {
      setActivePulse(null);
      setPulseSuccess(label);
      addAlert(`📢 Staff Alert: ${msg}`);
      toast.success(`${label} Dispatched`);
      
      setTimeout(() => setPulseSuccess(null), 2000);
    }, 800);
  };

  const handleZoneDivert = (zone: any) => {
    setActiveZoneAction(zone.id);
    setTimeout(() => {
      useVenueStore.getState().resolveZoneCongestion(zone.id);
      addAlert(`✅ Flow diverted for ${zone.name}. Congestion clearing.`);
      toast.success(`Flow Diverted: ${zone.name}`);
      setActiveZoneAction(null);
    }, 1200);
  };

  const handleStadiumChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const store = useVenueStore.getState();
    store.setWaitTimes([]); // Clearing forces the engine to re-seed wait times for the new stadium
    store.resetMatch(); // Instantly wipes old alerts, SOS data, and commentary from the previous stadium
    setStadium(e.target.value);
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      
      {/* Dynamic Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
             <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center text-white">
                <Shield size={24} />
             </div>
             {stadium.name} Command Center
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-medium flex items-center gap-2">
            <MapPin size={14} className="text-slate-500" />
            Monitoring {stadium.city} Sector • Live Match Feed
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <select 
            value={activeStadiumId || 'city_kolkata'} 
            onChange={handleStadiumChange}
            className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 text-sm font-black uppercase tracking-widest text-white outline-none cursor-pointer hover:bg-slate-700 transition shadow-lg"
          >
            {Object.keys(STADIUM_REGISTRY).map(key => (
              <option key={key} value={key}>{STADIUM_REGISTRY[key].city} Sector</option>
            ))}
          </select>

          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3 shadow-lg">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] font-black tracking-widest text-slate-200 uppercase">Live Ops</span>
          </div>
        </div>
      </header>

      {/* Emergency Global Banner */}
      <AnimatePresence>
        {sosActive && (
          <motion.div
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-red-600 rounded-[2.5rem] p-6 text-white shadow-[0_0_40px_rgba(220,38,38,0.4)] border-4 border-white/20 relative group">
                <div className="absolute inset-0 bg-red-500 animate-pulse mix-blend-overlay"></div>
                <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                   <div className="flex items-center gap-6">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-red-600 animate-bounce shadow-xl">
                        {sosType === 'Medical' ? <Stethoscope size={36} /> : <ShieldAlert size={36} />}
                      </div>
                      <div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">Active {sosType} Emergency</h3>
                        <p className="text-lg font-bold opacity-90">Location: VIP SEC 104 • Status: <span className="underline decoration-2 underline-offset-4">{sosStatus}</span></p>
                      </div>
                   </div>
                   <div className="flex gap-3">
                      <button className="bg-white text-red-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition shadow-lg">
                        Manage Incident
                      </button>
                   </div>
                </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          icon={<Users size={24} />} 
          label="Est. Attendance" 
          value={stadium.capacity ? stadium.capacity.toLocaleString() : '12,500'} 
          trend="LIVE" 
          color="sky" 
        />
        <MetricCard 
          icon={<Activity size={24} />} 
          label="Congestion Index" 
          value={`${Math.floor(totalCrowdScore / Math.max(1, waitTimes.length))}/100`} 
          trend="Real-time" 
          color="pink" 
        />
        <MetricCard 
          icon={<AlertCircle size={24} />} 
          label="Active Alerts" 
          value={alerts.length.toString()} 
          trend={sosActive ? "CRITICAL" : "OK"} 
          color={sosActive ? "red" : "emerald"} 
        />
        <MetricCard 
          icon={<ChevronsUp size={24} />} 
          label="Avg Exit Wait" 
          value={`${Math.floor(waitTimes.filter(w => w.type === 'exit').reduce((a, b) => a + b.waitTimeMinutes, 0) / 3)}m`} 
          trend="Flowing" 
          color="violet" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Center Area */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Real Google Maps Heatmap */}
          <div className="bg-slate-900 border border-white/5 rounded-[3rem] shadow-2xl flex flex-col h-[550px] overflow-hidden">
            <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 shrink-0">
              <h3 className="text-xl font-black tracking-tight">Live Venue Map</h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>Clear</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>High</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-pulse"></span>Critical</span>
                </div>
                <button className="text-slate-400 hover:text-white transition bg-slate-800 p-2 rounded-lg">
                  <Maximize2 size={18} />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-hidden rounded-b-[3rem]" style={{ minHeight: 0 }}>
              <VenueMap lat={stadium.lat} lng={stadium.lng} waitTimes={waitTimes} />
            </div>
          </div>

          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl">
             <h3 className="text-xl font-black tracking-tight mb-6 flex items-center gap-2">
               <Bell className="text-pink-500" size={24} /> Dispatch Staff Pulse
             </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'Gate 1 Clean', msg: 'All personnel to Sector 1 for cleanup.' },
                  { label: 'Hydration Fix', msg: 'Check hydration points near Section 4.' },
                  { label: 'Gate Overload', msg: 'Close Gate 1 partially, divert to Gate 4.' },
                  { label: 'Security Walk', msg: 'Routine security scan in Concourse A.' }
                ].map(p => {
                  const isLoad = activePulse === p.label;
                  const isSuccess = pulseSuccess === p.label;
                  
                  return (
                    <button 
                      key={p.label}
                      onClick={() => handlePulse(p.label, p.msg)}
                      disabled={isLoad || isSuccess}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-2 group active:scale-95 active:translate-y-0.5 active:shadow-inner cursor-pointer select-none ${
                        isSuccess 
                          ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
                          : isLoad 
                            ? 'bg-slate-800 border-white/5 opacity-70' 
                            : 'bg-gradient-to-b from-slate-700/80 to-slate-800 border-slate-600 hover:border-slate-500 text-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:brightness-110'
                      }`}
                    >
                      {isLoad ? (
                        <Loader2 size={16} className="text-slate-400 animate-spin" />
                      ) : isSuccess ? (
                        <CheckCircle size={16} className="text-emerald-400" />
                      ) : (
                        <Send size={16} className="text-slate-500 group-hover:text-pink-500 transition" />
                      )}
                      <span className="text-xs font-black uppercase text-left tracking-tight">{p.label}</span>
                    </button>
                  );
                })}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Alerts Feed */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl flex flex-col h-[400px]">
            <h3 className="text-xl font-black tracking-tight mb-6 flex items-center justify-between">
              Live Comms
              <span className="text-[10px] uppercase font-black tracking-widest bg-slate-800 text-slate-400 px-3 py-1 rounded-full border border-white/5">Live Feed</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
              <AnimatePresence>
                {alerts.map((alert, i) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className={`text-xs p-4 rounded-2xl border-l-4 font-bold shadow-lg bg-white/5 ${
                      alert.includes('Staff Alert') ? 'border-pink-500 text-pink-200' :
                      alert.includes('🚨') ? 'border-red-500 text-red-200' : 'border-sky-500 text-sky-200'
                    }`}
                  >
                    {alert}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Resource Management */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-black mb-6">Zone Interventions</h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <AnimatePresence>
                {criticalZones.length > 0 ? (
                  criticalZones.map((zone) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, height: 0 }}
                      key={zone.id} 
                      className="bg-orange-500/10 border border-orange-500/30 p-5 rounded-3xl relative overflow-hidden group"
                    >
                      <p className="text-xs font-black text-orange-400 uppercase tracking-widest mb-3">{zone.name}</p>
                      <p className="text-lg font-black text-white mb-4">{zone.waitTimeMinutes}m Backlog</p>
                      <button 
                        onClick={() => handleZoneDivert(zone)}
                        disabled={activeZoneAction === zone.id}
                        className="w-full bg-gradient-to-b from-orange-500 to-orange-600 disabled:from-orange-600/50 disabled:to-orange-700/50 border border-orange-400/50 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all duration-200 shadow-[0_6px_20px_rgba(234,88,12,0.4),inset_0_1px_1px_rgba(255,255,255,0.3)] hover:shadow-[0_8px_25px_rgba(234,88,12,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:scale-95 active:translate-y-0.5 active:shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] flex items-center justify-center h-10 select-none"
                      >
                        {activeZoneAction === zone.id ? (
                           <Loader2 size={16} className="animate-spin text-white/70" />
                        ) : 'Divert Flow'}
                      </button>
                    </motion.div>
                  ))
                ) : (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-6 text-center h-full opacity-50"
                  >
                    <Shield size={64} className="text-slate-700 mb-4" />
                    <p className="text-slate-500 font-bold text-sm">Venue Sectors Normalized</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, trend, color }: any) {
  const colorMap: any = {
    sky: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
    pink: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
    red: 'text-red-400 bg-red-500/10 border-red-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    violet: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  };

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group transition-transform hover:-translate-y-1">
      <div className={`absolute -right-4 -top-4 w-28 h-28 ${colorMap[color].split(' ')[1]} rounded-full blur-3xl group-hover:scale-110 transition-transform`}></div>
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className={`p-4 rounded-2xl ${colorMap[color]}`}>{icon}</div>
        <div className={`text-[10px] font-black px-3 py-1.5 rounded-full border ${colorMap[color]}`}>{trend}</div>
      </div>
      <h3 className="text-slate-400 text-xs font-black uppercase tracking-widest relative z-10">{label}</h3>
      <p className="text-4xl font-black mt-2 text-white relative z-10 tracking-tight">{value}</p>
    </div>
  );
}
