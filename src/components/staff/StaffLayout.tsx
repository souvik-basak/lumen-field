import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Shield, Home, Menu, X, LayoutDashboard, Users, Truck, Camera, AlertOctagon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useVenueStore } from '../../store/useVenueStore';

const NAV_ITEMS = [
  { to: '/staff', label: 'Command Center', icon: LayoutDashboard, color: 'text-sky-400', bg: 'bg-sky-500/10', border: 'border-sky-500/20', glow: 'shadow-[0_0_20px_rgba(14,165,233,0.15)]', end: true },
  { to: '/staff/crowd-control', label: 'Crowd Control', icon: Users, color: 'text-pink-400', bg: 'bg-pink-500/10', border: 'border-pink-500/20', glow: 'shadow-[0_0_20px_rgba(236,72,153,0.15)]', end: false },
  { to: '/staff/dispatch', label: 'Incident Dispatch', icon: Truck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', glow: 'shadow-[0_0_20px_rgba(16,185,129,0.15)]', end: false },
  { to: '/staff/feeds', label: 'Security Feeds', icon: Camera, color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/20', glow: 'shadow-[0_0_20px_rgba(139,92,246,0.15)]', end: false },
];

export default function StaffLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { sosActive, sosType, alerts } = useVenueStore();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#0f172a',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '16px',
            fontSize: '12px',
            fontWeight: '900',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' }
          }
        }} 
      />
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-black tracking-tight">Command Center</span>
        </div>
        <div className="flex items-center gap-3">
          {sosActive && (
            <div className="flex items-center gap-2 bg-red-600 px-3 py-1.5 rounded-lg text-white text-[10px] font-black uppercase tracking-widest animate-pulse">
              <AlertOctagon size={12} /> SOS
            </div>
          )}
          <button onClick={toggleMobileMenu} className="p-2 text-slate-400 hover:text-white transition">
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-md z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800/50 flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-20
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Logo */}
        <div className="p-6 border-b border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center shadow-lg shadow-sky-500/20">
              <Shield className="text-white" size={22} />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tight text-white">Ops Center</h1>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Stadium Command</p>
            </div>
          </div>

          {/* SOS Active Banner in sidebar */}
          <AnimatePresence>
            {sosActive && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 overflow-hidden"
              >
                <div className="bg-red-600/20 border border-red-500/50 rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertOctagon size={16} className="text-red-500 animate-pulse" />
                    <span className="text-red-400 font-black text-sm uppercase tracking-widest">SOS Active</span>
                  </div>
                  <p className="text-xs text-red-300 font-bold">{sosType} Emergency • VIP SEC 104</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Nav */}
        <nav className="flex-1 p-5 space-y-2 overflow-y-auto hidden-scrollbar">
          {NAV_ITEMS.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-4 px-5 py-4 rounded-2xl font-bold border transition-all ${
                  isActive
                    ? `${item.bg} ${item.color} ${item.border} ${item.glow}`
                    : 'text-slate-500 border-transparent hover:bg-white/5 hover:text-slate-200'
                }`
              }
            >
              <item.icon size={20} />
              <span>{item.label}</span>
              {item.to === '/staff/dispatch' && sosActive && (
                <span className="ml-auto w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Alert Count Footer */}
        <div className="p-5 border-t border-slate-800/50 space-y-3">
          {alerts.length > 0 && (
            <div className="bg-slate-800 rounded-2xl p-4 border border-white/5">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Alert Queue</p>
              <p className="text-xl font-black text-white">{alerts.length} <span className="text-xs text-slate-500 font-bold">active</span></p>
            </div>
          )}
          <Link
            to="/fan"
            className="flex items-center gap-3 text-sm text-slate-500 hover:text-white transition font-bold p-3 rounded-xl hover:bg-white/5 group"
          >
            <Home size={16} className="group-hover:text-sky-400 transition" />
            Switch to Fan App
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 pt-16 lg:pt-0 custom-scrollbar">
        <Outlet />
      </main>
    </div>
  );
}
