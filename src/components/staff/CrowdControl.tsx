import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, 
  AlertTriangle, 
  ArrowRightCircle, 
  Megaphone, 
  Lock, 
  CheckCircle,
  Radio,
  Send,
  Zap,
  Shield,
  ChevronRight,
  Activity,
  BrainCircuit,
  Smile,
  Frown,
  Flame
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useVenueStore } from '../../store/useVenueStore';

interface Toggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

export default function CrowdControl() {
  const { waitTimes, addAlert, sosActive, matchStatus } = useVenueStore();
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [lastBroadcast, setLastBroadcast] = useState<string | null>(null);
  const [toggles, setToggles] = useState<Toggle[]>([
    { id: 'express', label: 'Express Lanes', description: 'Convert Regular → Express for rapid exit during match-end.', enabled: false },
    { id: 'pricing', label: 'Suspend Dynamic Pricing', description: 'Halt food & merch surge pricing during high-density events.', enabled: true },
    { id: 'routing', label: 'Smart Routing Active', description: 'Push alternate-route suggestions to fans in congested zones.', enabled: true },
    { id: 'alerts', label: 'Auto Congestion Alerts', description: 'Automatically notify fans when zones exceed 80% capacity.', enabled: true },
  ]);

  const criticalNodes = waitTimes.filter(w => w.density === 'Critical');
  const highNodes = waitTimes.filter(w => w.density === 'High');
  const allFlaggedNodes = [...criticalNodes, ...highNodes];

  const handleIntervention = (actionId: string, nodeId: string, nodeName: string, msg: string) => {
    setActiveAction(actionId);
    setTimeout(() => {
      useVenueStore.getState().resolveZoneCongestion(nodeId);
      setActiveAction(null);
      addAlert(`✅ Crowd Control: ${msg} — ${nodeName}`);
      toast.success(msg);
    }, 1800);
  };

  const handleBroadcast = () => {
    if (!customMessage.trim()) return;
    addAlert(`📢 PA Broadcast: ${customMessage}`);
    toast.success('Broadcast Sent');
    setLastBroadcast(customMessage);
    setCustomMessage('');
  };

  const flipToggle = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
    const toggle = toggles.find(t => t.id === id);
    if (toggle) {
      addAlert(`⚙️ System: "${toggle.label}" ${toggle.enabled ? 'deactivated' : 'activated'}.`);
      toast(!toggle.enabled ? `${toggle.label} Activated` : `${toggle.label} Deactivated`, {
        icon: !toggle.enabled ? '🟢' : '⚪',
        style: { border: !toggle.enabled ? '1px solid rgba(16,185,129,0.3)' : '1px solid rgba(255,255,255,0.1)' }
      });
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 max-w-7xl mx-auto pb-24">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-4">
            <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Users size={28} className="text-white" />
            </div>
            Crowd Control
          </h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">
            Active Flow Manipulation & System Overrides
          </p>
        </div>
        <div className="flex gap-4">
          <div className="bg-red-500/10 border border-red-500/30 px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-black text-red-400">{criticalNodes.length}</span>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Critical</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/30 px-5 py-3 rounded-2xl text-center">
            <span className="text-2xl font-black text-orange-400">{highNodes.length}</span>
            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">Elevated</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* LEFT: Active Threats */}
        <div className="space-y-6">
          <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 border-b border-white/5 pb-4">
            <AlertTriangle size={16} className="text-red-500" /> Active Congestion Zones
          </h3>
          
          {allFlaggedNodes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-[2.5rem] flex flex-col items-center justify-center text-center"
            >
               <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-4">
                  <Shield size={32} className="text-emerald-400" />
               </div>
               <p className="font-black text-emerald-400 tracking-tight">Stadium Flow Optimal</p>
               <p className="text-xs text-slate-500 mt-1 font-bold">No manual interventions required at this time.</p>
            </motion.div>
          ) : (
            <div className="space-y-5">
              <AnimatePresence>
                {allFlaggedNodes.map(node => {
                  const isCritical = node.density === 'Critical';
                  return (
                    <motion.div
                      key={node.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-[2rem] p-6 border-2 relative overflow-hidden ${
                        isCritical 
                          ? 'bg-red-600/5 border-red-500/40 shadow-[0_0_30px_rgba(239,68,68,0.08)]' 
                          : 'bg-orange-500/5 border-orange-500/30'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-5">
                        <div>
                          <span className={`text-[9px] uppercase font-black tracking-widest px-2.5 py-1 rounded-lg mb-2 inline-block ${
                            isCritical ? 'bg-red-500/20 text-red-400' : 'bg-orange-500/20 text-orange-400'
                          }`}>
                            {isCritical ? 'Code Red' : 'Elevated'}
                          </span>
                          <h4 className="text-xl font-black text-white">{node.name}</h4>
                          <p className="text-sm font-bold text-slate-400 mt-1">Backlog: {node.waitTimeMinutes} min wait</p>
                        </div>
                        <AlertTriangle className={isCritical ? 'text-red-500' : 'text-orange-500'} size={28} />
                      </div>
                      
                      <div className="space-y-3">
                        <p className="text-[10px] text-slate-600 uppercase tracking-widest font-black">Response Options</p>
                        
                        <ActionButton
                          icon={<ArrowRightCircle className="text-sky-400" size={18} />}
                          label="Reroute Fan App Traffic"
                          isLoading={activeAction === `redirect-${node.id}`}
                          onClick={() => handleIntervention(`redirect-${node.id}`, node.id, node.name, 'App traffic rerouted to nearest gate')}
                          disabled={activeAction !== null}
                        />
                        <ActionButton
                          icon={<Megaphone className="text-amber-400" size={18} />}
                          label="Push Fan Notification (Avoid Area)"
                          isLoading={activeAction === `push-${node.id}`}
                          onClick={() => handleIntervention(`push-${node.id}`, node.id, node.name, 'Push notification sent to nearby fans')}
                          disabled={activeAction !== null}
                        />
                        {isCritical && (
                          <ActionButton
                            icon={<Lock className="text-red-400" size={18} />}
                            label="Initiate Hard Lockdown Override"
                            isLoading={activeAction === `lock-${node.id}`}
                            onClick={() => handleIntervention(`lock-${node.id}`, node.id, node.name, 'Lockdown override initiated')}
                            disabled={activeAction !== null}
                            danger
                          />
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}

          {/* AI Flow Predictor */}
          <div className="mt-12">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <Activity size={16} className="text-sky-500" /> AI Flow Forecast (45 Min)
            </h3>
            <PredictiveChart toggles={toggles} baseCongestion={allFlaggedNodes.length} />
          </div>
        </div>

        {/* RIGHT: System Toggles & Broadcast */}
        <div className="space-y-8">

          {/* AI Sentiment Monitor */}
          <SentimentGauge 
            criticalCount={criticalNodes.length} 
            highCount={highNodes.length} 
            sosActive={sosActive} 
            matchStatus={matchStatus} 
          />
          
          {/* System Toggles */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <Zap size={16} className="text-amber-400" /> Global System Overrides
            </h3>
            <div className="space-y-4">
              {toggles.map(t => (
                <div key={t.id} className="bg-slate-900 border border-white/5 rounded-3xl p-6 flex items-center justify-between gap-6 group hover:border-white/10 transition">
                  <div className="flex-1">
                    <p className="font-black text-white text-sm">{t.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5 font-bold">{t.description}</p>
                  </div>
                  <button
                    onClick={() => flipToggle(t.id)}
                    className={`relative w-14 h-7 rounded-full transition-all flex-shrink-0 border-2 ${
                      t.enabled 
                        ? 'bg-emerald-500 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
                        : 'bg-slate-800 border-slate-700'
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md ${t.enabled ? 'left-[calc(100%-1.4rem)]' : 'left-0.5'}`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* PA Broadcast */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <Radio size={16} className="text-violet-400" /> Emergency PA Broadcast
            </h3>
            <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 space-y-4">
              <p className="text-xs font-bold text-slate-500">Compose a live message for venue speakers and fan app notifications simultaneously.</p>
              
              <textarea
                value={customMessage}
                onChange={e => setCustomMessage(e.target.value)}
                placeholder="e.g. Gate 2 is now re-opened for North Stand fans..."
                className="w-full bg-slate-950 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 font-medium resize-none h-28 focus:outline-none focus:border-violet-500/50 transition placeholder:text-slate-700"
              />
              
              <div className="flex gap-3">
                {['Gate 2 Open', 'Exits Clear', 'Medical Alert'].map(preset => (
                  <button
                    key={preset}
                    onClick={() => setCustomMessage(preset)}
                    className="text-[10px] font-black uppercase tracking-widest px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-xl border border-white/5 transition text-slate-400 hover:text-white"
                  >
                    {preset}
                  </button>
                ))}
              </div>

              <button
                onClick={handleBroadcast}
                disabled={!customMessage.trim()}
                className="w-full bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest text-xs py-4 rounded-2xl transition flex items-center justify-center gap-3 active:scale-95 shadow-xl shadow-violet-500/20"
              >
                <Send size={16} /> Broadcast to All Fans <ChevronRight size={14} />
              </button>

              {lastBroadcast && (
                <motion.div 
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-3 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4"
                >
                  <CheckCircle size={16} className="text-emerald-400 mt-0.5 shrink-0" />
                  <p className="text-xs font-bold text-emerald-200">Last sent: "{lastBroadcast}"</p>
                </motion.div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, isLoading, onClick, disabled, danger }: {
  icon: React.ReactNode;
  label: string;
  isLoading: boolean;
  onClick: () => void;
  disabled: boolean;
  danger?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full flex justify-between items-center p-4 rounded-2xl border transition-all duration-200 disabled:opacity-40 active:scale-95 active:translate-y-0.5 active:shadow-inner cursor-pointer select-none ${
        danger 
          ? 'bg-gradient-to-b from-red-600/20 to-red-600/10 hover:from-red-600/30 hover:to-red-600/20 border-red-500/30 text-red-400 shadow-[0_4px_12px_rgba(239,68,68,0.1),inset_0_1px_1px_rgba(255,255,255,0.05)] hover:shadow-[0_6px_16px_rgba(239,68,68,0.2)]' 
          : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500 text-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] hover:shadow-[0_6px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.15)] hover:brightness-110'
      }`}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-bold text-sm">{label}</span>
      </div>
      {isLoading 
        ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin opacity-70" />
        : <ChevronRight size={16} className="opacity-30" />
      }
    </button>
  );
}

function PredictiveChart({ toggles, baseCongestion }: { toggles: Toggle[], baseCongestion: number }) {
  const activeToggles = toggles.filter(t => t.enabled).length;
  // If baseline is 0 (normalized), the curve is flat. If higher, it naturally rises unless squirmed by toggles.
  const baselineSeverity = baseCongestion === 0 ? 30 : 60 + (baseCongestion * 10);
  
  // Predict next 9 intervals (45 mins)
  const intervals = [0, 5, 10, 15, 20, 25, 30, 35, 40];
  const chartData = intervals.map((min, i) => {
    // Natural curve climbs, but active toggles explicitly force it down.
    let prediction = baselineSeverity + (i * 8); 
    const mitigation = activeToggles * (i * 6); // Each toggle bends the curve down significantly over time
    
    // Calculate final value, bound between 10 and 100
    const finalVal = Math.max(10, Math.min(100, prediction - mitigation));
    
    // Determine status color based on severity
    let status = 'Low';
    let color = 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]';
    if (finalVal > 60) {
      status = 'Medium';
      color = 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)]';
    }
    if (finalVal > 85) {
      status = 'Critical';
      color = 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] animate-pulse';
    }

    return { min, val: finalVal, color, status };
  });

  return (
    <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden">
      <div className="flex justify-between items-end mb-8 relative z-10">
         <div>
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">System Mitigation Profile</p>
           <h4 className="text-xl font-black text-white">{activeToggles} Overrides Active</h4>
         </div>
         <div className="text-right">
           <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">45-Min Peak</p>
           <h4 className="text-xl font-black text-sky-400">{Math.floor(Math.max(...chartData.map(d => d.val)))}% Density</h4>
         </div>
      </div>

      <div className="relative h-48 flex items-end justify-between gap-2 z-10 mt-4 px-2">
         {/* Background Grid Lines */}
         <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
            <div className="border-b border-dashed border-slate-600 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-600 w-full h-0"></div>
            <div className="border-b border-dashed border-slate-600 w-full h-0"></div>
            <div className="border-b border-slate-600 w-full h-0"></div>
         </div>

         {/* Animated Bars */}
         <AnimatePresence>
           {chartData.map((d, i) => (
             <div key={i} className="flex flex-col items-center flex-1 group">
               <div className="relative w-full max-w-[24px] rounded-t-sm flex items-end justify-center mb-2 h-full">
                 <motion.div
                   layout
                   initial={{ height: 0 }}
                   animate={{ height: `${d.val}%` }}
                   transition={{ type: 'spring', stiffness: 60, damping: 15, delay: i * 0.05 }}
                   className={`w-full rounded-t-md ${d.color} transition-colors duration-500`}
                 />
                 {/* Hover Tooltip */}
                 <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg pointer-events-none border border-slate-600 z-20">
                   {Math.floor(d.val)}%
                 </div>
               </div>
               <span className="text-[9px] font-black text-slate-500">+{d.min}m</span>
             </div>
           ))}
         </AnimatePresence>
      </div>
    </div>
  );
}

function SentimentGauge({ criticalCount, highCount, sosActive, matchStatus }: { 
  criticalCount: number; 
  highCount: number; 
  sosActive: boolean;
  matchStatus: string;
}) {
  // Algorithm to calculate hostility score 0-100
  let score = 20; // baseline calm
  if (matchStatus === 'live') score += 10;
  
  score += (highCount * 10);
  score += (criticalCount * 25);
  
  if (sosActive) score += 35;
  
  const finalScore = Math.max(0, Math.min(100, score));
  
  let stateLabel = 'Calm / Engaged';
  let StateIcon = Smile;
  let colorClass = 'text-emerald-400';
  let glowClass = 'shadow-[0_0_40px_rgba(16,185,129,0.3)] bg-emerald-500';
  let borderClass = 'border-emerald-500/30';
  let bgClass = 'bg-emerald-500/10';

  if (finalScore >= 50) {
    stateLabel = 'Agitated / Restless';
    StateIcon = Frown;
    colorClass = 'text-amber-400';
    glowClass = 'shadow-[0_0_40px_rgba(251,191,36,0.3)] bg-amber-500';
    borderClass = 'border-amber-500/30';
    bgClass = 'bg-amber-500/10';
  }
  
  if (finalScore >= 80) {
    stateLabel = 'Hostile / Flashpoint';
    StateIcon = Flame;
    colorClass = 'text-red-400';
    glowClass = 'shadow-[0_0_40px_rgba(239,68,68,0.4)] bg-red-500';
    borderClass = 'border-red-500/30';
    bgClass = 'bg-red-500/10';
  }

  // Convert score 0-100 to rotation degrees -90 to 90
  const needleRotation = -90 + (finalScore / 100) * 180;

  return (
    <div>
       <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
         <BrainCircuit size={16} className="text-pink-500" /> AI Crowd Sentiment
       </h3>
       
       <div className={`border w-full ${borderClass} ${bgClass} rounded-[2.5rem] p-8 flex flex-col items-center justify-center relative overflow-hidden transition-colors duration-1000 group`}>
         
         <div className="relative w-48 h-24 overflow-hidden mb-6 mt-4">
           {/* Semi Circle Gauge Background */}
           <div className="absolute top-0 left-0 w-full h-48 rounded-full border-[20px] border-slate-800 border-b-transparent border-l-emerald-500/40 border-t-amber-500/40 border-r-red-500/40" style={{ transform: 'rotate(45deg)'}}></div>
           
           {/* Needle */}
           <motion.div 
             className="absolute bottom-0 left-1/2 w-1.5 h-[5.5rem] bg-white origin-bottom rounded-t-full shadow-[0_0_15px_rgba(255,255,255,0.8)] z-10"
             initial={{ rotate: -90 }}
             animate={{ rotate: needleRotation }}
             transition={{ type: 'spring', stiffness: 45, damping: 15 }}
             style={{ x: '-50%' }}
           >
             {/* Center Pin */}
             <div className="absolute -bottom-2 -left-[5px] w-4 h-4 bg-white rounded-full"></div>
             {/* Center Pin Outer Ring */}
             <div className="absolute -bottom-3 -left-[9px] w-6 h-6 border-2 border-white rounded-full"></div>
           </motion.div>
         </div>

         <div className="text-center relative z-10">
           <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-1">Current Mood Tracking</p>
           <h4 className={`text-2xl font-black flex items-center justify-center gap-3 ${colorClass} transition-colors duration-700`}>
             <StateIcon size={24} className="group-hover:scale-110 transition-transform" /> {stateLabel}
           </h4>
         </div>

         {/* Ambient Glow */}
         <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 blur-3xl opacity-20 rounded-full pointer-events-none transition-colors duration-1000 ${glowClass}`}></div>
       </div>
    </div>
  );
}
