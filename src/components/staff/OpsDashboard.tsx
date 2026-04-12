import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { AlertCircle, Users, Activity, ChevronsUp, Maximize2, Shield, TrendingUp } from 'lucide-react';

export default function OpsDashboard() {
  const { waitTimes, alerts } = useVenueStore();

  const totalCrowdScore = waitTimes.reduce((acc, curr) => acc + curr.waitTimeMinutes, 0);
  const criticalZones = waitTimes.filter(w => w.density === 'Critical' || w.density === 'High');

  // Simulated 24-period historical data for the chart based on current score
  const mockHistoryData = Array.from({length: 24}).map((_, i) => {
    return Math.max(10, Math.min(100, Math.floor(Math.sin(i / 3) * 30 + 50 + (Math.random() * 20))));
  });
  // Replace the last one with the actual current score scaling
  mockHistoryData[23] = Math.min(100, Math.floor(totalCrowdScore / waitTimes.length) * 2);

  return (
    <div className="p-4 md:p-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 md:gap-0">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Lumen Field Ops Center</h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">Real-time venue analytics and crowd distribution</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2 flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold tracking-wide text-slate-200 uppercase">System Online</span>
          </div>
        </div>
      </header>

      {/* Top Metrics - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
          <div className="absolute -right-4 -top-4 w-24 h-24 bg-sky-500/10 rounded-full blur-2xl group-hover:bg-sky-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-2">
            <div className="text-sky-400 p-2 bg-sky-500/10 rounded-xl"><Users size={24} /></div>
            <div className="text-emerald-400 text-xs font-black bg-emerald-500/10 px-2 py-1 rounded-md">+5% avg</div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-4">Est. Attendance</h3>
          <p className="text-3xl font-black mt-1 text-white">42,850</p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-pink-500/10 rounded-full blur-2xl group-hover:bg-pink-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-2">
             <div className="text-pink-400 p-2 bg-pink-500/10 rounded-xl"><Activity size={24} /></div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-4">Congestion Index</h3>
          <p className="text-3xl font-black mt-1 text-white">{Math.floor(totalCrowdScore / waitTimes.length)}<span className="text-lg text-slate-500 font-bold">/100</span></p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-2">
             <div className="text-red-400 p-2 bg-red-500/10 rounded-xl"><AlertCircle size={24} /></div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-4">Active Alerts</h3>
          <p className="text-3xl font-black mt-1 text-white">{alerts.length}</p>
        </div>

        <div className="bg-slate-900 border border-white/5 rounded-[2rem] p-6 shadow-xl relative overflow-hidden group">
           <div className="absolute -right-4 -top-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all"></div>
          <div className="flex justify-between items-start mb-2">
             <div className="text-violet-400 p-2 bg-violet-500/10 rounded-xl"><ChevronsUp size={24} /></div>
          </div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mt-4">Avg Exit Wait</h3>
          <p className="text-3xl font-black mt-1 text-white">
            {Math.floor(waitTimes.filter(w => w.type === 'exit').reduce((a, b) => a + b.waitTimeMinutes, 0) / 3)}
            <span className="text-lg text-slate-500 font-bold"> mins</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
        
        {/* Main Center Area: Heatmap & Charts */}
        <div className="lg:col-span-2 xl:col-span-3 flex flex-col gap-6">
          
          {/* Heatmap Area */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] shadow-xl flex flex-col h-[500px] overflow-hidden">
            <div className="flex justify-between items-center p-6 border-b border-white/5 bg-slate-900 z-10">
              <h3 className="text-lg font-black tracking-tight">Interactive Venue Heatmap</h3>
              <button className="text-slate-400 hover:text-white transition bg-slate-800 p-2 rounded-lg"><Maximize2 size={18} /></button>
            </div>
            
            <div className="flex-1 bg-slate-800/20 relative overflow-hidden flex items-center justify-center p-4">
              {/* Stadium outline mock layer */}
               <div className="w-full max-w-4xl h-full border-2 border-slate-700/50 rounded-[4rem] relative shadow-[inset_0_0_100px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wMykiLz48L3N2Zz4=')]">
                  
                  {/* Field graphic line */}
                  <div className="absolute w-[60%] h-[40%] border-2 border-white/10 rounded-full flex justify-center items-center">
                     <div className="h-full border-l-2 border-white/10"></div>
                  </div>

                  {/* Nodes positioning */}
                  {waitTimes.map((node, i) => {
                    // Random-ish positioning based on index
                    const topPos = 50 + 38 * Math.sin((i * Math.PI * 2) / waitTimes.length);
                    const leftPos = 50 + 40 * Math.cos((i * Math.PI * 2) / waitTimes.length);
                    
                    return (
                      <motion.div
                        key={node.id}
                        layout 
                        className="absolute rounded-xl border flex flex-col items-center justify-center cursor-pointer transition-colors shadow-2xl backdrop-blur-md z-20"
                        style={{
                          top: `${topPos}%`,
                          left: `${leftPos}%`,
                          transform: 'translate(-50%, -50%)',
                          width: 'clamp(90px, 12vw, 130px)',
                          height: 'clamp(60px, 8vw, 80px)',
                          backgroundColor: node.density === 'Critical' ? 'rgba(239, 68, 68, 0.15)' : 
                                          node.density === 'High' ? 'rgba(249, 115, 22, 0.15)' :
                                          node.density === 'Medium' ? 'rgba(234, 179, 8, 0.1)' : 'rgba(15, 23, 42, 0.8)',
                          borderColor: node.density === 'Critical' ? 'rgba(239, 68, 68, 0.5)' : 
                                      node.density === 'High' ? 'rgba(249, 115, 22, 0.5)' :
                                      node.density === 'Medium' ? 'rgba(234, 179, 8, 0.3)' : 'rgba(255, 255, 255, 0.1)'
                        }}
                      >
                        {node.density === 'Critical' && (
                          <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></span>
                          </span>
                        )}
                        <span className="font-bold text-[10px] md:text-xs tracking-tight truncate w-full px-2 text-center text-slate-300">{node.name}</span>
                        <span className="text-lg md:text-2xl font-black mt-0.5 md:mt-1 drop-shadow-md" style={{
                          color: node.density === 'Critical' ? '#ef4444' : 
                                node.density === 'High' ? '#f97316' :
                                node.density === 'Medium' ? '#eab308' : '#cbd5e1'
                        }}>
                          {node.waitTimeMinutes}m
                        </span>
                      </motion.div>
                   )})}
               </div>
            </div>
          </div>

          {/* Crowd Trend History Chart */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 shadow-xl flex flex-col h-[250px]">
             <h3 className="text-lg font-black tracking-tight mb-4 flex items-center gap-2">
               <TrendingUp size={20} className="text-violet-400" /> Hourly Crowd Flow Trend
             </h3>
             <div className="flex-1 flex items-end justify-between gap-1 md:gap-2 px-2 pt-4 border-b border-l border-slate-700/50">
               {mockHistoryData.map((val, idx) => (
                 <div key={idx} className="relative w-full bg-slate-800/80 rounded-t-sm group flex flex-col justify-end" style={{ height: '100%' }}>
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height: `${val}%` }}
                      transition={{ duration: 0.5 }}
                      className={`w-full rounded-t-sm transition-all duration-300 ${
                        idx === 23 ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 
                        val > 80 ? 'bg-orange-500' : 'bg-sky-500'
                      }`}
                    />
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-[10px] font-bold py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none">
                      {val} idx
                    </div>
                 </div>
               ))}
             </div>
             <div className="flex justify-between text-xs text-slate-500 font-bold mt-2 uppercase tracking-widest px-2">
               <span>1hr ago</span>
               <span>Now</span>
             </div>
          </div>
        </div>

        {/* Action Panel sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-1">
          {/* Alerts Feed */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 shadow-xl flex-1 flex flex-col min-h-[300px]">
            <h3 className="text-lg font-black tracking-tight mb-4 flex items-center justify-between">
              Live Event Feed
              <span className="text-[10px] uppercase font-bold tracking-widest bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">Last 10</span>
            </h3>
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 hidden-scrollbar">
              <AnimatePresence>
                {alerts.length === 0 ? (
                  <p className="text-slate-500 text-sm font-medium mt-4">No recent alerts registered.</p>
                ) : (
                  alerts.map((alert, i) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, x: 20, scale: 0.9 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      key={`${alert}-${i}`} 
                      className={`text-xs md:text-sm p-3 md:p-4 rounded-2xl border-l-[6px] shadow-lg font-bold ${
                        alert.includes('overcrowded') ? 'border-red-500 bg-red-500/10 text-red-200' :
                        alert.includes('Reminder') ? 'border-pink-500 bg-pink-500/10 text-pink-200' : 
                        alert.includes('TOUCHDOWN') || alert.includes('FIELD GOAL') ? 'border-emerald-500 bg-emerald-500/10 text-emerald-200' : 
                        'border-sky-500 bg-sky-500/10 text-sky-200'
                      }`}
                    >
                      {alert}
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Controls */}
          <div className="bg-slate-900 border border-white/5 rounded-[2.5rem] p-6 shadow-xl flex-1 max-h-[350px] overflow-y-auto hidden-scrollbar">
            <h3 className="text-lg font-black tracking-tight mb-4">Resource Management</h3>
            {criticalZones.length > 0 ? (
              <div className="space-y-4">
                {criticalZones.map((zone) => (
                   <motion.div 
                      initial={{ opacity:0 }}
                      animate={{ opacity:1 }}
                      key={zone.id} 
                      className="bg-orange-500/10 border border-orange-500/30 p-4 rounded-2xl overflow-hidden relative group"
                   >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500/0 via-orange-500/10 to-orange-500/0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                    <p className="text-sm font-black text-orange-400 mb-3 drop-shadow-md">{zone.name} Overcrowded</p>
                    <button className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition shadow-lg relative z-10 active:scale-95">
                      Dispatch Response
                    </button>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-6 text-center h-[200px]">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 flex items-center justify-center mb-4 border border-emerald-500/30 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                  <Shield size={36} className="text-emerald-400" />
                </div>
                <p className="text-slate-300 font-bold text-sm">All sectors operating within normal parameters.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
