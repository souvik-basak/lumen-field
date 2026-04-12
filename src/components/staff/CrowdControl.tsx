import { useState } from 'react';
import { Users, AlertTriangle, ArrowRightCircle, Megaphone, Lock } from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';

export default function CrowdControl() {
  const { waitTimes, addAlert } = useVenueStore();
  const [activeAction, setActiveAction] = useState<string | null>(null);

  const criticalNodes = waitTimes.filter(w => w.density === 'Critical');

  const handleIntervention = (actionId: string, nodeName: string) => {
    setActiveAction(actionId);
    setTimeout(() => {
      setActiveAction(null);
      addAlert(`CROWD CONTROL: Interventions deployed at ${nodeName}. Fan app routing updated.`);
    }, 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
             <Users className="text-pink-500" size={32} /> Crowd Control
          </h2>
          <p className="text-slate-400 font-medium mt-1 uppercase tracking-wider text-sm">Active Flow Manipulation & Overrides</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Active Threats */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-white/10 pb-2">Critical Congestion Points</h3>
          
          {criticalNodes.length === 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl flex flex-col items-center justify-center text-center">
               <span className="text-4xl mb-2">✅</span>
               <p className="font-bold tracking-wide">Stadium Flow Optimal</p>
               <p className="text-xs opacity-80 mt-1">No manual crowd control interventions required at this time.</p>
            </div>
          ) : (
            criticalNodes.map(node => (
              <div key={node.id} className="bg-slate-900 border border-red-500/30 rounded-2xl p-5 shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-red-400 bg-red-400/10 px-2 py-0.5 rounded border border-red-400/20 mb-2 inline-block">Code Red</span>
                    <h4 className="text-xl font-black text-white">{node.name}</h4>
                    <p className="text-sm font-bold text-slate-400">Current Wait: {node.waitTimeMinutes} mins</p>
                  </div>
                  <AlertTriangle className="text-red-500" size={28} />
                </div>
                
                <div className="space-y-3 mt-6">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Suggested Actions</p>
                  
                  <button 
                    disabled={activeAction !== null}
                    onClick={() => handleIntervention('redirect-' + node.id, node.name)}
                    className="w-full flex justify-between items-center bg-slate-800 hover:bg-slate-700 p-3 rounded-xl border border-white/5 transition disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <ArrowRightCircle className="text-sky-400" size={18} />
                      <span className="font-bold text-sm text-slate-200">Reroute App Traffic to nearest Gate</span>
                    </div>
                    {activeAction === 'redirect-' + node.id && <span className="w-4 h-4 border-2 border-sky-400 border-t-transparent rounded-full animate-spin"></span>}
                  </button>

                  <button 
                    disabled={activeAction !== null}
                    onClick={() => handleIntervention('push-' + node.id, node.name)}
                    className="w-full flex justify-between items-center bg-slate-800 hover:bg-slate-700 p-3 rounded-xl border border-white/5 transition disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                      <Megaphone className="text-yellow-400" size={18} />
                      <span className="font-bold text-sm text-slate-200">Push App Notification (Avoid Area)</span>
                    </div>
                    {activeAction === 'push-' + node.id && <span className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></span>}
                  </button>
                  
                  <button 
                    disabled={activeAction !== null}
                    onClick={() => handleIntervention('lock-' + node.id, node.name)}
                    className="w-full flex justify-between items-center bg-red-500/10 hover:bg-red-500/20 text-red-400 p-3 rounded-xl border border-red-500/30 transition disabled:opacity-50"
                  >
                    <div className="flex items-center gap-3">
                       <Lock size={18} />
                       <span className="font-bold text-sm">Initiate Hard Lockdown Override</span>
                    </div>
                    {activeAction === 'lock-' + node.id && <span className="w-4 h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin"></span>}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Global Tools */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold border-b border-white/10 pb-2">Global System Toggles</h3>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
             <div className="grid gap-6">
                
                <div className="flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white text-lg">Express Lanes</p>
                     <p className="text-sm text-slate-500">Temporarily convert regular lanes to Express</p>
                   </div>
                   <div className="w-12 h-6 bg-slate-700 rounded-full relative cursor-pointer opacity-50">
                     <div className="w-5 h-5 bg-slate-400 rounded-full absolute left-0.5 top-0.5"></div>
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white text-lg">Pause Dynamic Pricing</p>
                     <p className="text-sm text-slate-500">Halt surge pricing during ingress events</p>
                   </div>
                   <div className="w-12 h-6 bg-emerald-500 rounded-full relative cursor-pointer">
                     <div className="w-5 h-5 bg-white rounded-full absolute right-0.5 top-0.5 shadow-md"></div>
                   </div>
                </div>

                <div className="flex justify-between items-center">
                   <div>
                     <p className="font-bold text-white text-lg py-1">Emergency Broadcast PA</p>
                     <p className="text-sm text-slate-500 mb-2">Send TTS over venue speakers</p>
                   </div>
                   <button className="bg-slate-800 hover:bg-slate-700 font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-lg border border-slate-700 transition">Access</button>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
