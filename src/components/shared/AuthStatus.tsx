import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, User, ShieldCheck, Loader2 } from 'lucide-react';
import { firebaseAuth } from '../../services/firebaseAuthMock';
import { useVenueStore } from '../../store/useVenueStore';

/**
 * AuthStatus Component.
 * Displays "Sign in with Google" or the user's profile card.
 */
export default function AuthStatus() {
  const user = useVenueStore((state) => state.user);
  const [isPending, setIsPending] = useState(false);

  const handleLogin = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      await firebaseAuth.signInWithGoogle();
    } catch (error: any) {
      console.error('Login failed:', error);
      // Fallback for environment blockages
      if (error.message?.includes('getContext')) {
         alert("Google Sign-in was blocked by your browser settings or an ad-blocker. Please check your extensions.");
      }
    } finally {
      setIsPending(false);
    }
  };

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await firebaseAuth.signOut();
    } finally {
      setIsPending(false);
    }
  };

  // Simplified layout without AnimatePresence for SDK stability
  return (
    <div className="w-full">
      {user ? (
        <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center gap-3 group relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <div className="relative shrink-0">
            {user.photoURL ? (
              <img 
                src={user.photoURL} 
                alt={user.displayName || 'User'} 
                className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-lg"
              />
            ) : (
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/10">
                <User size={20} className="text-slate-400" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-slate-900 flex items-center justify-center">
              <ShieldCheck size={8} className="text-white" />
            </div>
          </div>

          <div className="flex-1 min-w-0 z-10">
            <p className="text-xs font-black text-slate-100 truncate tracking-tight">
              {user.displayName || 'Fan'}
            </p>
            <p className="text-[10px] font-bold text-slate-500 truncate uppercase tracking-widest leading-none mt-0.5">
              Premium Fan Pass
            </p>
          </div>

          <button
            onClick={handleLogout}
            disabled={isPending}
            className="p-2 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all z-10"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      ) : (
        <div>
          <button
            onClick={handleLogin}
            disabled={isPending}
            className="w-full bg-white text-slate-950 px-4 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-3 shadow-xl hover:bg-slate-100 active:scale-95 transition-all group"
          >
            {isPending ? (
              <Loader2 size={20} className="animate-spin text-slate-500" />
            ) : (
              <>
                <div className="w-5 h-5 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-full h-full">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </div>
                <span className="tracking-tight uppercase">Sign in with Google</span>
              </>
            )}
          </button>
          <AdminLogin />
        </div>
      )}
    </div>
  );
}

function AdminLogin() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError('');
    try {
      const adminUser = await firebaseAuth.signInWithAdmin(email, password);
      // Manually set user state since local admin login doesn't trigger Firebase SDK listener
      useVenueStore.getState().setUser(adminUser);
      setIsOpen(false); // Close form on success
      setEmail('');
      setPassword('');
    } catch (err) {
      setError('Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-orange-400 transition"
      >
        Staff / Admin Login
      </button>
    );
  }

  return (
    <motion.form 
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      onSubmit={handleAdminSubmit}
      className="space-y-2 pt-2 border-t border-white/5"
    >
      <input 
        type="email" 
        placeholder="Admin Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
      />
      <input 
        type="password" 
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-slate-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
      />
      {error && <p className="text-[9px] text-red-500 font-bold px-1">{error}</p>}
      <div className="flex gap-2">
        <button 
          type="button"
          onClick={() => setIsOpen(false)}
          className="flex-1 py-2 text-[10px] font-black uppercase text-slate-500"
        >
          Cancel
        </button>
        <button 
          type="submit"
          disabled={loading}
          className="flex-[2] bg-orange-600 text-white rounded-xl py-2 text-[10px] font-black uppercase tracking-widest"
        >
          {loading ? 'Verifying...' : 'Login As Staff'}
        </button>
      </div>
    </motion.form>
  );
}
