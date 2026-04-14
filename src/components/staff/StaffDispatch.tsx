import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { 
  Activity, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  UserCircle2, 
  Clock, 
  Stethoscope,
  ChevronRight,
  AlertOctagon,
  Navigation,
  Terminal
} from 'lucide-react';
import toast from 'react-hot-toast';

type TaskStatus = 'open' | 'dispatched' | 'resolved';

interface DispatchTask {
  id: string;
  title: string;
  location: string;
  severity: 'High' | 'Critical';
  time: string;
  status: TaskStatus;
  assignee?: string;
  isSOS?: boolean;
}

interface CADLog {
  id: string;
  timestamp: string;
  message: string;
  type: 'system' | 'dispatch' | 'resolve';
}


export default function StaffDispatch() {
  const { 
    waitTimes, 
    sosActive, 
    sosType, 
    sosStatus, 
    setSOSStatus, 
    cancelSOS,
    addAlert 
  } = useVenueStore();
  
  const [localTasks, setLocalTasks] = useState<DispatchTask[]>([]);
  const [cadLogs, setCadLogs] = useState<CADLog[]>([]);
  const pushLog = (message: string, type: 'system' | 'dispatch' | 'resolve') => {
    setCadLogs(prev => [...prev, {
      id: Date.now().toString() + Math.random(),
      timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute:'2-digit', second:'2-digit' }),
      message,
      type
    }]);
  };

  // Actively sync new congestion incidents from the backend engine into the dispatch queue
  useEffect(() => {
    const incomingCritical = waitTimes.filter(w => w.density === 'Critical' || w.density === 'High');
    if (incomingCritical.length === 0) return;

    setLocalTasks(prev => {
      let updated = [...prev];
      let changed = false;
      incomingCritical.forEach((w) => {
        // Only inject if there isn't already an active task for this zone
        const exists = updated.some(t => t.location === w.name);
        if (!exists) {
          updated.push({
             id: `task-${w.id}-${Date.now()}`,
             title: w.density === 'Critical' ? 'Severe Overcrowding' : 'Flow Congestion',
             location: w.name,
             severity: w.density as 'High' | 'Critical',
             time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
             status: 'open'
          });
          pushLog(`SYSTEM DETECTED: ${w.density === 'Critical' ? 'CRITICAL' : 'HIGH'} CONGESTION AT ${w.name.toUpperCase()}`, 'system');
          changed = true;
        }
      });
      return changed ? updated : prev;
    });
  }, [waitTimes]);

  // Merge SOS state into tasks reactively
  const tasks = useMemo(() => {
    const all = [...localTasks];
    if (sosActive) {
      all.unshift({
        id: 'global-sos-incident',
        title: `CRITICAL: ${sosType} EMERGENCY`,
        location: 'VIP SEC 104',
        severity: 'Critical',
        time: 'JUST NOW',
        status: sosStatus === 'Dispatching' ? 'open' : sosStatus === 'Resolved' ? 'resolved' : 'dispatched',
        assignee: sosStatus === 'Dispatching' ? undefined : 'Emergency Medic 1',
        isSOS: true
      });
    }
    return all;
  }, [localTasks, sosActive, sosType, sosStatus]);

  const handleAction = (taskId: string, newStatus: TaskStatus, assignedUnit?: string) => {
    if (taskId === 'global-sos-incident') {
      if (newStatus === 'dispatched') {
        setSOSStatus('Dispatched');
        const rName = assignedUnit ? assignedUnit : 'Emergency Medic 1';
        addAlert(`🚨 Incident Command: ${rName} dispatched to VIP SEC 104.`);
        toast.success(`Unit Dispatched`);
        pushLog(`DISPATCH ISSUED: ${rName.toUpperCase()} EN ROUTE TO MEDICAL EMERGENCY AT VIP SEC 104`, 'dispatch');
      } else if (newStatus === 'resolved') {
        setSOSStatus('Resolved');
        setTimeout(() => cancelSOS(), 3000); 
        addAlert(`✅ Incident Command: Medical emergency resolved at VIP SEC 104.`);
        toast.success('Incident Cleared');
        pushLog(`SCENE SECURED: MEDICAL EMERGENCY RESOLVED AT VIP SEC 104`, 'resolve');
      }
    } else {
      setLocalTasks(prev => prev.map(t => {
        if (t.id === taskId) {
          const isDispatching = newStatus === 'dispatched';
          const newAssign = isDispatching && !t.assignee ? (assignedUnit || 'Team Bravo') : t.assignee;
          
          if (isDispatching) {
            toast.success('Unit Deployed');
            pushLog(`DISPATCH ISSUED: ${newAssign?.toUpperCase()} DIRECTED TO ${t.location.toUpperCase()}`, 'dispatch');
          } else if (newStatus === 'resolved') {
            toast.success('Incident Resolved');
            pushLog(`SCENE SECURED: ${t.title.toUpperCase()} CLEARED AT ${t.location.toUpperCase()}`, 'resolve');
          }

          return { 
            ...t, 
            status: newStatus,
            assignee: newAssign
          };
        }
        return t;
      }));
    }


  };


  const openTasks = tasks.filter(t => t.status === 'open');
  const dispatchedTasks = tasks.filter(t => t.status === 'dispatched');
  const resolvedTasks = tasks.filter(t => t.status === 'resolved');

  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto pb-24">
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                <Truck size={32} />
             </div>
             Central Dispatch Hub
          </h2>
          <p className="text-slate-500 font-bold mt-2 uppercase tracking-widest text-xs">Personnel & Response Management</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-4">
           {/* TEST BUTTON (Added so you can instantly see the new UI features) */}
           <button 
             onClick={() => {
               const mockId = `mock-task-${Date.now()}`;
               setLocalTasks(prev => [{
                 id: mockId,
                 title: 'Disturbance in Concourses',
                 location: 'Sector 4 / Gate B',
                 severity: 'Critical',
                 time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
                 status: 'open'
               }, ...prev]);
               pushLog(`SYSTEM DETECTED: CRITICAL DISTURBANCE AT SECTOR 4 / GATE B`, 'system');
             }}
             className="mr-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest active:scale-95 transition flex items-center gap-2"
           >
             <AlertOctagon size={14} className="text-red-400" /> Simulate Incident
           </button>

           <StatusMetric count={openTasks.length} label="Pending" color="text-red-500" />
           <StatusMetric count={dispatchedTasks.length} label="Active" color="text-amber-500" />
           <StatusMetric count={resolvedTasks.length} label="Cleared" color="text-emerald-500" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* OPEN COLUMN */}
        <DispatchColumn 
          title="Action Required" 
          icon={<AlertOctagon className="text-red-500" size={20} />}
          tasks={openTasks}
          onAction={(id: string) => handleAction(id, 'dispatched')}
          actionLabel="Dispatch Rapid Response"
          activeColor="border-red-500/30"
        />

        {/* DISPATCHED COLUMN */}
        <DispatchColumn 
          title="Units Deployed" 
          icon={<Activity className="text-amber-500" size={20} />}
          tasks={dispatchedTasks}
          onAction={(id: string) => handleAction(id, 'resolved')}
          actionLabel="Mark Scene Clear"
          activeColor="border-amber-500/30"
        />

        {/* RESOLVED COLUMN */}
        <DispatchColumn 
          title="Resolution Log" 
          icon={<CheckCircle2 className="text-emerald-500" size={20} />}
          tasks={resolvedTasks}
          activeColor="border-emerald-500/30"
        />

      </div>
      
      {/* IMMUTABLE CAD TERMINAL */}
      <div className="bg-black border border-white/10 rounded-[2rem] p-6 overflow-hidden relative shadow-2xl mt-8">
         <div className="absolute top-0 right-0 p-4 opacity-30">
            <Terminal size={48} className="text-slate-600" />
         </div>
         <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
           Server Matrix: CAD Communications Log
         </h3>
         <div className="h-40 overflow-y-auto custom-scrollbar font-mono text-[11px] leading-relaxed flex flex-col justify-end">
           {cadLogs.length === 0 ? (
             <span className="text-slate-600">-- SYSTEM INITIALIZED. AWAITING DISPATCH EVENTS --</span>
           ) : (
             <AnimatePresence initial={false}>
               {cadLogs.map((log) => {
                 let colorClass = 'text-slate-400';
                 if (log.type === 'system') colorClass = 'text-red-400';
                 if (log.type === 'dispatch') colorClass = 'text-amber-400';
                 if (log.type === 'resolve') colorClass = 'text-emerald-400';
                 
                 return (
                   <motion.div 
                     key={log.id}
                     initial={{ opacity: 0, x: -10 }}
                     animate={{ opacity: 1, x: 0 }}
                     className="mb-1.5"
                   >
                     <span className="text-slate-600 mr-2">[{log.timestamp}]</span>
                     <span className={colorClass}>{log.message}</span>
                   </motion.div>
                 );
               })}
             </AnimatePresence>
           )}
         </div>
      </div>
    </div>
  );
}

function DispatchColumn({ title, icon, tasks, onAction, actionLabel, activeColor }: any) {
  return (
    <div className={`glass-dark rounded-[2.5rem] p-6 border ${activeColor} flex flex-col h-[75vh] shadow-2xl bg-slate-900/40 backdrop-blur-md`}>
      <h3 className="font-black text-lg text-white mb-6 flex items-center gap-3">
        {icon} {title}
      </h3>
      <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar pb-4">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-20 text-slate-600 grayscale opacity-50">
               <div className="w-16 h-16 border-2 border-dashed border-slate-700 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle2 size={32} />
               </div>
               <p className="text-sm font-bold">Queue Empty</p>
            </motion.div>
          )}
          {tasks.map((task: DispatchTask) => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onMove={onAction} 
              nextLabel={actionLabel} 
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function TaskCard({ task, onMove, nextLabel }: { task: DispatchTask, onMove?: (id: string) => void, nextLabel?: string }) {
  const isSOS = task.isSOS;
  const isCritical = task.severity === 'Critical' || isSOS;
  
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`relative group rounded-[2rem] p-6 border-2 transition-all duration-300 overflow-hidden ${
        isSOS 
          ? 'bg-red-950/40 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.25)] hover:shadow-[0_0_40px_rgba(239,68,68,0.4)]' 
          : isCritical 
            ? 'bg-slate-900/80 border-amber-500/40 hover:border-amber-500/80 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]' 
            : 'bg-slate-900/80 border-white/5 hover:border-white/20'
      }`}
    >
      {isSOS && (
        <div className="absolute top-0 right-0 p-4">
           <div className="animate-ping w-3 h-3 rounded-full bg-red-500"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
         <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg ${isCritical ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
              {task.severity}
            </span>
            {isSOS && <span className="bg-red-500 text-white text-[9px] font-black px-2 py-1 rounded-lg animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.8)]">EMERGENCY</span>}
         </div>
         <div className="text-[10px] font-bold text-slate-500 flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-md border border-slate-700">
            <Clock size={10} /> {task.time}
         </div>
      </div>
      
      <h4 className="text-lg font-black text-white leading-tight mb-2 flex items-center gap-2">
         {isSOS 
           ? (task.title.includes('Medical') ? <Stethoscope className="text-red-500 shrink-0" size={18} /> : <ShieldAlert className="text-red-500 shrink-0" size={18} />)
           : null
         }
         {task.title}
      </h4>
      <p className="text-xs text-slate-400 font-bold mb-6 flex items-center gap-2">
         <MapPin size={12} className={isSOS ? 'text-red-400' : 'text-slate-500'} /> {task.location}
      </p>
      
      {task.assignee && task.status === 'dispatched' && (
        <div className="flex flex-col gap-2 mb-6 bg-slate-950/80 p-4 rounded-2xl border border-sky-500/20 relative overflow-hidden group-hover:border-sky-500/40 transition-colors">
          {/* Animated Map Line Background */}
          <div className="absolute top-0 right-0 h-full w-32 opacity-20 bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-sky-400 via-transparent to-transparent"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="bg-sky-500/20 p-2 rounded-xl border border-sky-500/30 text-sky-400">
              <Navigation size={18} className="animate-pulse" />
            </div>
            <div className="flex flex-col flex-1">
               <span className="text-[9px] font-black text-sky-500 uppercase tracking-widest flex items-center gap-1">
                 <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live GPS Tracing
               </span>
               <div className="flex justify-between items-end mt-0.5">
                  <span className="text-xs font-black text-white">{task.assignee}</span>
                  <span className="text-[10px] font-bold text-slate-400">ETA 2m</span>
               </div>
            </div>
          </div>
          
          <div className="w-full bg-slate-800 rounded-full h-1 mt-1 relative z-10 overflow-hidden">
             <motion.div 
               className="bg-sky-500 h-1 rounded-full" 
               initial={{ width: "20%" }}
               animate={{ width: "70%" }}
               transition={{ duration: 15, ease: "linear", repeat: Infinity }}
             />
          </div>
        </div>
      )}

      {task.assignee && task.status !== 'dispatched' && (
        <div className="flex items-center gap-3 mb-6 bg-slate-950 p-3 rounded-2xl border border-white/5">
           <UserCircle2 size={24} className="text-sky-400" />
           <div className="flex flex-col">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Responder Logged</span>
              <span className="text-xs font-black text-white">{task.assignee}</span>
           </div>
        </div>
      )}

      {onMove && (
        <button 
          onClick={() => onMove(task.id)}
          className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border active:scale-95 active:translate-y-0.5 cursor-pointer shadow-lg select-none ${
            isSOS 
              ? 'bg-gradient-to-b from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border-red-500/50 text-white shadow-red-600/30 hover:shadow-red-500/40 active:shadow-inner' 
              : 'bg-gradient-to-b from-slate-800 to-slate-900 border-slate-700 hover:border-slate-500 text-slate-200 active:shadow-inner'
          }`}
        >
          {nextLabel} <ChevronRight size={14} />
        </button>
      )}
    </motion.div>
  );
}

function StatusMetric({ count, label, color }: { count: number, label: string, color: string }) {
  return (
    <div className="bg-slate-900/80 border border-white/5 px-6 py-3 rounded-2xl text-center shadow-xl">
       <span className={`text-2xl font-black ${color}`}>{count}</span>
       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

function MapPin({ size, className }: { size: number, className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}
