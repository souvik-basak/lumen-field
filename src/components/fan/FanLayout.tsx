import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Map as MapIcon, Coffee, Train, Car, Star, ShieldCheck } from 'lucide-react';
import StadiumSelector from '../shared/StadiumSelector';
import MatchSummary from './MatchSummary';
import { useVenueStore } from '../../store/useVenueStore';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';
import SOSSystem from './SOSSystem';
import AuthStatus from '../shared/AuthStatus';

export default function FanLayout() {
  const { alerts, cart, activeStadiumId, stadiums: cloudStadiums, user } = useVenueStore();
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const location = useLocation();

  const stadium = activeStadiumId ? (cloudStadiums[activeStadiumId] || STADIUM_REGISTRY[activeStadiumId]) : null;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row font-sans text-slate-100 overflow-hidden">
      <StadiumSelector />
      <MatchSummary />
      
      {/* Mobile Top Bar (Hidden on Desktop, shown on Mobile) */}
      <header className="md:hidden sticky top-0 z-50 glass-dark py-3 px-4 shadow-lg border-b border-white/5" role="banner">
        <div className="flex justify-between items-center mb-1 border-b pb-2 border-white/10">
          <h1 className="text-xl font-black bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
            {stadium?.name || 'Lumen Field'}
          </h1>
          <div className="flex gap-2 items-center">
             <div className="mr-2">
               <AuthStatus />
             </div>
              {user?.email === 'admin@stadium.com' && (
                <Link to="/staff" className="text-[10px] px-2 py-1 font-black text-white rounded bg-gradient-to-r from-orange-500 to-red-500 shadow-lg shadow-orange-500/20 active:scale-95 transition" aria-label="Switch to Staff Mode">
                   Staff Mode
                </Link>
              )}
          </div>
        </div>
        <div className="h-4 relative overflow-hidden mt-1" aria-live="polite">
          <AnimatePresence mode="wait">
            {alerts.length > 0 ? (
              <motion.div key={alerts[0]} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 truncate text-xs text-pink-400 font-semibold flex items-center">
                <span className="animate-pulse mr-1" aria-hidden="true">🔴</span> {alerts[0]}
              </motion.div>
            ) : (
              <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 text-xs text-slate-500 flex items-center">All clear.</motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* Desktop Sidebar (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 glass-dark border-r border-white/5 flex-col flex-shrink-0 z-50" role="complementary">
        <div className="p-6 border-b border-white/5">
           <h1 className="text-3xl font-black bg-gradient-to-br from-pink-500 to-violet-500 bg-clip-text text-transparent tracking-tight leading-tight">
             {stadium?.name || 'Lumen Field'}
           </h1>
           <div className="mt-4 px-3 py-1.5 font-bold text-xs text-slate-300 rounded-lg bg-slate-800 border border-slate-700 inline-block">
              {stadium?.city || 'India'}
           </div>
           <div className="mt-4">
             <AuthStatus />
           </div>
        </div>
        <nav className="flex-1 p-4 space-y-2 relative" aria-label="Main navigation">
          <NavLink to="/fan" end className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-pink-500/10 text-pink-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <Home size={22} aria-hidden="true" /> Home
          </NavLink>
          <NavLink to="/fan/navigate" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-violet-500/10 text-violet-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <MapIcon size={22} aria-hidden="true" /> Interactive Map
          </NavLink>
          <NavLink to="/fan/zone" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all relative ${isActive ? 'bg-orange-500/10 text-orange-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <Star size={22} className="text-orange-400" aria-hidden="true" /> Fan Zone
          </NavLink>

          <div className="mt-6 border-t border-white/5 pt-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-2 px-4">Logistics</h3>
            <NavLink to="/fan/transit" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-sky-500/10 text-sky-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
              <Train size={22} aria-hidden="true" /> Smart Transit
            </NavLink>
            <NavLink to="/fan/parking" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${isActive ? 'bg-emerald-500/10 text-emerald-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
              <Car size={22} aria-hidden="true" /> Private Parking
            </NavLink>
          </div>

          <NavLink to="/fan/food" className={({ isActive }) => `flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all relative ${isActive ? 'bg-indigo-500/10 text-indigo-500 shadow-inner' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}>
            <Coffee size={22} aria-hidden="true" /> Order Food
            {cartItemCount > 0 && (
              <span className="absolute right-4 bg-pink-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg" aria-label={`${cartItemCount} items in cart`}>{cartItemCount}</span>
            )}
          </NavLink>

          <div className="mt-8 border-t border-white/5 pt-4">
            <h3 className="text-xs uppercase font-bold tracking-widest text-slate-500 mb-3 px-4">Live Alerts</h3>
            <div className="space-y-2 px-2 max-h-[300px] overflow-y-auto hidden-scrollbar relative" aria-live="polite">
              {alerts.slice(0,5).map((alert, i) => (
                <div key={i} className="text-xs p-2 rounded-lg border-l-2 border-pink-500 bg-pink-500/5 text-pink-200 font-medium font-bold">
                  {alert}
                </div>
              ))}
            </div>
          </div>
          
          {user?.email === 'admin@stadium.com' && (
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <Link to="/staff" className="flex items-center justify-center gap-2 w-full p-4 rounded-2xl bg-gradient-to-r from-orange-600 to-red-600 text-white shadow-xl shadow-orange-950/20 hover:scale-[1.02] active:scale-95 transition-all font-black text-sm uppercase tracking-widest ring-2 ring-orange-400/20" aria-label="Switch to Staff Mode">
                <ShieldCheck size={18} /> Switch to Staff Mode
              </Link>
            </div>
          )}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0 relative bg-slate-950" role="main">
        <AnimatePresence mode="wait">
           <Outlet />
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 w-full glass-dark border-t border-white/5 z-50 pb-safe" aria-label="Mobile navigation">
        <ul className="flex justify-around items-center h-16 px-2">
          <li>
            <NavLink to="/fan" end className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-pink-500' : 'text-slate-400'}`} aria-label="Home">
              <Home size={22} className="mb-1" aria-hidden="true" />
              <span className="text-[10px] font-bold">Home</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/fan/navigate" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-violet-500' : 'text-slate-400'}`} aria-label="Map">
              <MapIcon size={22} className="mb-1" aria-hidden="true" />
              <span className="text-[10px] font-bold">Map</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/fan/transit" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-sky-500' : 'text-slate-400'}`} aria-label="Transit">
              <Train size={22} className="mb-1" aria-hidden="true" />
              <span className="text-[10px] font-bold">Transit</span>
            </NavLink>
          </li>
          <li className="relative">
            <NavLink to="/fan/food" className={({ isActive }) => `flex flex-col items-center justify-center w-16 h-full transition-colors ${isActive ? 'text-indigo-500' : 'text-slate-400'}`} aria-label="Order Food">
              <Coffee size={22} className="mb-1" aria-hidden="true" />
              <span className="text-[10px] font-bold">Order</span>
              {cartItemCount > 0 && (
                <span className="absolute top-2 right-2 bg-pink-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border border-slate-900" aria-label={`${cartItemCount} items in cart`}>{cartItemCount}</span>
              )}
            </NavLink>
          </li>
        </ul>
      </nav>
      <SOSSystem />
    </div>
  );
}
