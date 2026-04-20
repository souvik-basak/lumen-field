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
  CheckCircle,
  ShoppingBag,
  ChefHat,
  Truck as TruckIcon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';
import VenueMap from './VenueMap';
import { resolveSOSInCloud, updateOrderStatusInCloud } from '../../services/cloudSync';
import { seedStadiumsToCloud } from '../../services/dataMigration';

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
    activeSosId,
    activeStadiumId,
    setStadium,
    addAlert,
    cancelSOS,
    orders,
    updateOrderStatus
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

  const handleResolveSOS = async () => {
    if (activeSosId) {
      const loadingToast = toast.loading('Syncing resolution to cloud...');
      await resolveSOSInCloud(activeSosId);
      cancelSOS();
      toast.success('Incident Resolved & Synced', { id: loadingToast });
      addAlert(`✅ ${sosType} emergency at SEC 104 has been resolved.`);
    } else {
      cancelSOS();
      toast.success('Incident Cleared Locally');
    }
  };

  const handleUpdateOrder = async (orderId: string, nextStatus: any) => {
    const tid = toast.loading(`Updating order status to ${nextStatus}...`);
    await updateOrderStatusInCloud(orderId, nextStatus);
    updateOrderStatus(orderId, nextStatus);
    toast.success(`Order ${nextStatus}`, { id: tid });
    if (nextStatus === 'Dispatched') {
      addAlert(`🚚 Dispatch: Order #${orderId.slice(-4)} is on its way!`);
    }
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

          <button 
            onClick={async () => {
              const tid = toast.loading('Migrating JSON to Cloud...');
              try {
                await seedStadiumsToCloud();
                toast.success('Database Seeded Successfully', { id: tid });
              } catch (e) {
                toast.error('Migration Failed', { id: tid });
              }
            }}
            className="group relative flex items-center justify-center w-10 h-10 bg-slate-800 hover:bg-sky-500 rounded-xl transition-all border border-slate-700 hover:border-sky-400 shadow-lg"
            title="Seed Cloud Database"
          >
             <Activity size={18} className="text-slate-400 group-hover:text-white transition" />
             <div className="absolute -top-12 scale-0 group-hover:scale-100 transition-transform bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-lg border border-white/10 whitespace-nowrap">
                Migrate JSON to Live DB
             </div>
          </button>
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
                      <button 
                        onClick={handleResolveSOS}
                        className="bg-white text-red-600 px-8 py-3 rounded-2xl font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition shadow-lg active:scale-95 translate-y-0"
                      >
                        Resolve & Clear
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
              {/* Live Order Feed */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-8 shadow-xl h-[400px] overflow-hidden flex flex-col">
            <h3 className="text-xl font-black mb-6 flex items-center justify-between">
              Live Orders
              {orders.filter(o => o.status !== 'Delivered').length > 0 && (
                <span className="bg-emerald-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">{orders.filter(o => o.status !== 'Delivered').length}</span>
              )}
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <AnimatePresence>
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={order.id} 
                      className="bg-slate-800/80 border border-white/5 p-4 rounded-2xl"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Order #{order.id.slice(-4)}</p>
                          <p className="font-bold text-white text-sm">{order.customerName || 'Fan'}</p>
                        </div>
                        <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-md ${
                          order.status === 'Pending' ? 'bg-amber-500/20 text-amber-500' :
                          order.status === 'Preparing' ? 'bg-sky-500/20 text-sky-500' :
                          'bg-emerald-500/20 text-emerald-500'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-medium mb-3">📍 {order.location}</p>
                      
                      <div className="flex gap-2">
                         {order.status === 'Pending' && (
                           <button 
                             onClick={() => handleUpdateOrder(order.id, 'Preparing')}
                             className="flex-1 bg-sky-600/20 hover:bg-sky-600/40 text-sky-400 text-[10px] font-black uppercase py-2 rounded-lg border border-sky-500/30 transition flex items-center justify-center gap-1"
                           >
                             <ChefHat size={12} /> Prepare
                           </button>
                         )}
                         {order.status === 'Preparing' && (
                           <button 
                             onClick={() => handleUpdateOrder(order.id, 'Dispatched')}
                             className="flex-1 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-400 text-[10px] font-black uppercase py-2 rounded-lg border border-emerald-500/30 transition flex items-center justify-center gap-1"
                           >
                             <TruckIcon size={12} /> Dispatch
                           </button>
                         )}
                         {order.status === 'Dispatched' && (
                           <button 
                             onClick={() => handleUpdateOrder(order.id, 'Delivered')}
                             className="flex-1 bg-slate-700/50 hover:bg-slate-700 text-slate-300 text-[10px] font-black uppercase py-2 rounded-lg border border-slate-600 transition flex items-center justify-center gap-1"
                           >
                             <CheckCircle size={12} /> Delivered
                           </button>
                         )}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center p-6 text-center h-full opacity-50">
                    <ShoppingBag size={48} className="text-slate-700 mb-4" />
                    <p className="text-slate-500 font-bold text-sm">No active orders</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
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
