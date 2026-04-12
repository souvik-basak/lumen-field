import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Shield, Home, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function StaffLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Mobile Top Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <Shield className="text-sky-500" size={24} />
          <span className="font-bold tracking-tight">Ops Center</span>
        </div>
        <button 
          onClick={toggleMobileMenu}
          className="p-2 text-slate-400 hover:text-white transition"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Backdrop for Mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeMobileMenu}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Command Center */}
      <aside className={`
        fixed inset-y-0 left-0 w-72 bg-slate-900 border-r border-slate-800 flex flex-col z-50 transition-transform duration-300 lg:relative lg:translate-x-0 lg:z-20
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="text-sky-500" size={28} />
            <h1 className="text-xl font-bold tracking-tight">Ops Center</h1>
          </div>
          <button onClick={closeMobileMenu} className="lg:hidden p-1 text-slate-500 hover:text-white">
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto hidden-scrollbar">
          <NavLink 
            to="/staff" 
            end 
            onClick={closeMobileMenu}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium border transition ${isActive ? 'bg-sky-500/10 text-sky-400 border-sky-500/20 shadow-[0_0_15px_rgba(14,165,233,0.1)]' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Overview Dashboard
          </NavLink>
          <NavLink 
            to="/staff/crowd-control" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium border transition ${isActive ? 'bg-pink-500/10 text-pink-400 border-pink-500/20 shadow-[0_0_15px_rgba(236,72,153,0.1)]' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Crowd Control
          </NavLink>
          <NavLink 
            to="/staff/dispatch" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium border transition ${isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Staff Dispatch
          </NavLink>
          <NavLink 
            to="/staff/feeds" 
            onClick={closeMobileMenu}
            className={({ isActive }) => `block px-4 py-3 rounded-lg font-medium border transition ${isActive ? 'bg-violet-500/10 text-violet-400 border-violet-500/20 shadow-[0_0_15px_rgba(139,92,246,0.1)]' : 'text-slate-400 border-transparent hover:text-slate-200'}`}
          >
            Security Feeds
          </NavLink>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <Link to="/fan" className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
             <Home size={16} /> Switch to Fan App
           </Link>
        </div>
      </aside>

      {/* Main Content Dashboard */}
      <main className="flex-1 h-full overflow-y-auto bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 to-slate-950 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
