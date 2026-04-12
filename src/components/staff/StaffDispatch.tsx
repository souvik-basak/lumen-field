import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Activity, ShieldAlert, CheckCircle2, Truck, UserCircle2, Clock } from 'lucide-react';

type TaskStatus = 'open' | 'dispatched' | 'resolved';

interface DispatchTask {
  id: string;
  title: string;
  location: string;
  severity: 'High' | 'Critical';
  time: string;
  status: TaskStatus;
  assignee?: string;
}

export default function StaffDispatch() {
  const { waitTimes, alerts } = useVenueStore();
  
  // Initialize mock tasks based on current wait times state
  const [tasks, setTasks] = useState<DispatchTask[]>(() => {
    const initialTasks: DispatchTask[] = [];
    waitTimes.filter(w => w.density === 'Critical' || w.density === 'High').forEach((w, i) => {
      initialTasks.push({
        id: `task-${w.id}-${i}`,
        title: w.density === 'Critical' ? 'Severe Overcrowding' : 'Flow Congestion',
        location: w.name,
        severity: w.density,
        time: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
        status: w.density === 'Critical' ? 'open' : 'dispatched',
        assignee: w.density === 'Critical' ? undefined : 'Unit Alpha-3'
      });
    });
    return initialTasks;
  });

  const moveTask = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { 
          ...t, 
          status: newStatus,
          assignee: newStatus === 'dispatched' && !t.assignee ? 'Team Bravo' : t.assignee
        };
      }
      return t;
    }));
  };

  const openTasks = tasks.filter(t => t.status === 'open');
  const dispatchedTasks = tasks.filter(t => t.status === 'dispatched');
  const resolvedTasks = tasks.filter(t => t.status === 'resolved');

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <Truck className="text-emerald-400" size={32} /> Central Dispatch
          </h2>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-wider text-sm">Active Incident Management</p>
        </div>
        
        <div className="flex gap-4">
           <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <span className="text-2xl font-black text-red-400">{openTasks.length}</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Open</p>
           </div>
           <div className="bg-slate-900 border border-slate-700 px-4 py-2 rounded-xl text-center">
              <span className="text-2xl font-black text-yellow-400">{dispatchedTasks.length}</span>
              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Active</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* OPEN COLUMN */}
        <div className="bg-slate-900/50 border border-red-500/20 rounded-[2rem] p-5 flex flex-col h-[70vh]">
           <h3 className="font-black text-slate-200 mb-6 flex items-center gap-2">
             <ShieldAlert className="text-red-400" size={20} /> Action Required
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4 hidden-scrollbar pr-2">
             <AnimatePresence>
               {openTasks.length === 0 && <p className="text-sm text-slate-500 text-center font-medium my-10">No pending alerts.</p>}
               {openTasks.map(task => (
                 <TaskCard key={task.id} task={task} onMove={() => moveTask(task.id, 'dispatched')} nextLabel="Dispatch Unit" />
               ))}
             </AnimatePresence>
           </div>
        </div>

        {/* DISPATCHED COLUMN */}
        <div className="bg-slate-900/50 border border-yellow-500/20 rounded-[2rem] p-5 flex flex-col h-[70vh]">
           <h3 className="font-black text-slate-200 mb-6 flex items-center gap-2">
             <Activity className="text-yellow-400" size={20} /> Units Deployed
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4 hidden-scrollbar pr-2">
             <AnimatePresence>
               {dispatchedTasks.length === 0 && <p className="text-sm text-slate-500 text-center font-medium my-10">No active units.</p>}
               {dispatchedTasks.map(task => (
                 <TaskCard key={task.id} task={task} onMove={() => moveTask(task.id, 'resolved')} nextLabel="Mark Resolved" />
               ))}
             </AnimatePresence>
           </div>
        </div>

        {/* RESOLVED COLUMN */}
        <div className="bg-slate-900/50 border border-emerald-500/20 rounded-[2rem] p-5 flex flex-col h-[70vh]">
           <h3 className="font-black text-slate-200 mb-6 flex items-center gap-2">
             <CheckCircle2 className="text-emerald-400" size={20} /> Cleared Incidents
           </h3>
           <div className="flex-1 overflow-y-auto space-y-4 hidden-scrollbar pr-2">
             <AnimatePresence>
               {resolvedTasks.length === 0 && <p className="text-sm text-slate-500 text-center font-medium my-10">Waiting for resolution.</p>}
               {resolvedTasks.map(task => (
                 <TaskCard key={task.id} task={task} />
               ))}
             </AnimatePresence>
           </div>
        </div>

      </div>
    </div>
  );
}

function TaskCard({ task, onMove, nextLabel }: { task: DispatchTask, onMove?: () => void, nextLabel?: string }) {
  const isCritical = task.severity === 'Critical';
  
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0, marginTop: 0 }}
      layout
      className={`bg-slate-800 rounded-2xl p-4 border block ${isCritical && task.status === 'open' ? 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/5 shadow-lg'}`}
    >
      <div className="flex justify-between items-start mb-2">
         <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${isCritical ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
           {task.severity}
         </span>
         <span className="text-xs font-bold text-slate-500 flex items-center gap-1"><Clock size={12}/>{task.time}</span>
      </div>
      
      <h4 className="font-bold text-white leading-tight mb-1">{task.title}</h4>
      <p className="text-xs text-slate-400 font-medium mb-4">{task.location}</p>
      
      {task.assignee && (
        <div className="flex items-center gap-2 mb-4 bg-slate-900/50 p-2 rounded-lg border border-slate-700">
           <UserCircle2 size={16} className="text-sky-400" />
           <span className="text-xs font-bold text-slate-300">Resp: {task.assignee}</span>
        </div>
      )}

      {onMove && (
        <button 
          onClick={onMove}
          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition ${task.status === 'open' ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 box-border border-emerald-500/30 border' : 'bg-slate-700 hover:bg-slate-600 text-white'}`}
        >
          {nextLabel}
        </button>
      )}
    </motion.div>
  );
}
