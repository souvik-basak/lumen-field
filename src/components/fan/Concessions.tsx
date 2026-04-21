import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Clock, Search, ShoppingBag, Plus, Minus, Check, MapPin } from 'lucide-react';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';
import { syncOrderToCloud } from '../../services/cloudSync';

export default function Concessions() {
  const { waitTimes, gameEvents, cart, addToCart, removeFromCart, clearCart, activeStadiumId } = useVenueStore();
  const [activeTab, setActiveTab] = useState<'express' | 'locker' | 'in-seat'>('express');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];
  const menuItems = stadium.menu;
  
  const upcomingEvent = gameEvents.find(e => e.timeToEventMinutes !== null && e.timeToEventMinutes > 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="p-4 md:p-8 pt-6 space-y-6 pb-20 max-w-7xl mx-auto hidden-scrollbar">
      <div className="flex justify-between items-center mb-2 md:mb-6">
        <div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">Food & Drinks</h2>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{stadium.name} Concessions</p>
        </div>
        <button 
          onClick={() => setIsCartOpen(true)}
          className="relative glass p-2 md:p-3 rounded-full hover:bg-white/20 transition active:scale-95 md:hidden"
        >
          <ShoppingBag size={22} className="text-white" />
          {cartItemCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] md:text-xs font-bold w-4 md:w-5 h-4 md:h-5 rounded-full flex items-center justify-center">
              {cartItemCount}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Search & Filter */}
          <div className="relative overflow-hidden group rounded-2xl">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={18} className="text-slate-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search kati rolls, vada pav, chai..." 
              className="w-full glass py-3.5 md:py-4 pl-11 pr-4 rounded-2xl font-medium text-sm focus:outline-none focus:ring-2 focus:ring-pink-500/50 bg-slate-800/50 placeholder:text-slate-500"
            />
          </div>

          {/* Delivery / Pickup Toggle */}
          <div className="flex bg-slate-900 rounded-xl p-1 shadow-inner border border-white/5">
            <button 
              onClick={() => setActiveTab('express')}
              className={`flex-1 py-2 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'express' ? 'bg-emerald-500 shadow-md text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Express Pickup
            </button>
            <button 
              onClick={() => setActiveTab('locker')}
              className={`flex-1 py-2 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'locker' ? 'bg-sky-500 shadow-md text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Smart Locker
            </button>
            <button 
              onClick={() => setActiveTab('in-seat')}
              className={`flex-1 flex justify-center items-center gap-1 py-2 md:py-3 text-[10px] md:text-sm font-bold uppercase tracking-wider rounded-lg transition-all ${
                activeTab === 'in-seat' ? 'bg-pink-500 shadow-md text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              In-Seat <span className="hidden md:inline">Delivery</span>
            </button>
          </div>
          
          <AnimatePresence>
            {activeTab === 'in-seat' && (
               <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-pink-500/10 border border-pink-500/20 rounded-2xl p-4 flex gap-4 items-center">
                 <div className="p-3 bg-pink-500/20 rounded-full text-pink-400"><MapPin size={24} /></div>
                 <div>
                   <p className="font-bold text-pink-400 text-sm">Delivering to Block B • Row 4 • Seat 12</p>
                   <p className="text-xs text-slate-400 mt-0.5">A runner will bring your order directly to your seat. ₹50 fee applies.</p>
                 </div>
               </motion.div>
            )}
          </AnimatePresence>

          {/* Smart Prediction Alert */}
          {upcomingEvent && upcomingEvent.timeToEventMinutes! < 20 && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-violet-600/30 to-pink-600/30 border border-pink-500/40 rounded-2xl p-4 md:p-6 flex gap-3 items-center backdrop-blur-md"
            >
              <Clock size={24} className="text-pink-400 shrink-0" />
              <div>
                <p className="text-xs md:text-sm font-black text-white uppercase tracking-wider">Schedule Pickup</p>
                <p className="text-xs md:text-sm font-medium text-slate-300 mt-0.5 md:mt-1 leading-relaxed">Order now, pick up exactly during {upcomingEvent.title} ({upcomingEvent.timeToEventMinutes}m) avoiding the rush.</p>
              </div>
            </motion.div>
          )}

          {/* Vendors List & Menu Items */}
          <div>
            <h3 className="font-black mb-4 md:text-lg text-slate-300 tracking-tight">Match Day Specialties</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {menuItems.map((item, i) => {
                 const vendor = waitTimes.find(v => v.id === item.vendorId);
                 return (
                  <motion.div 
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    key={item.id}
                    className="glass p-3 md:p-4 rounded-2xl border border-white/5 flex gap-4 items-center hover:bg-white/5 transition-colors"
                  >
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-800 rounded-xl shrink-0 flex items-center justify-center text-3xl shadow-inner">
                      {item.category === 'Drink' ? '☕' : item.name.includes('Roll') ? '🌯' : '🥪'}
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-bold text-sm md:text-base text-white">{item.name}</h4>
                      <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center mt-1 md:mt-2 gap-1">
                        <span className="text-xs md:text-sm font-black text-slate-300">₹{item.price}</span>
                        {vendor && (
                          <span className={`text-[9px] w-max font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                            vendor.density === 'Low' ? 'bg-emerald-500/20 text-emerald-400' :
                            vendor.density === 'Medium' ? 'bg-yellow-500/20 text-yellow-500' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                            {vendor.waitTimeMinutes}m wait
                          </span>
                        )}
                      </div>
                    </div>
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-pink-500 hover:bg-pink-400 flex items-center justify-center text-white font-bold transition active:scale-95 shadow-[0_0_10px_rgba(236,72,153,0.5)] shrink-0 group"
                    >
                      <Plus size={20} strokeWidth={3} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Desktop Cart Sidebar / Mobile Overlay */}
        <div className="hidden lg:flex lg:col-span-4 lg:flex-col lg:relative lg:h-[700px]">
           <CartContent 
             cart={cart}
             cartTotal={cartTotal}
             cartItemCount={cartItemCount}
             removeFromCart={removeFromCart}
             addToCart={addToCart}
             clearCart={clearCart}
             closeCart={() => {}}
             activeTab={activeTab}
             activeStadiumId={activeStadiumId}
           />
        </div>

        <AnimatePresence>
          {isCartOpen && (
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-0 z-[60] bg-slate-900 p-5 flex flex-col"
            >
               <CartContent 
                 cart={cart}
                 cartTotal={cartTotal}
                 cartItemCount={cartItemCount}
                 removeFromCart={removeFromCart}
                 addToCart={addToCart}
                 clearCart={clearCart}
                 closeCart={() => setIsCartOpen(false)}
                 activeTab={activeTab}
                 activeStadiumId={activeStadiumId}
               />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

function CartContent({ cart, cartTotal, cartItemCount, removeFromCart, addToCart, clearCart, closeCart, activeTab, activeStadiumId }: any) {
  const deliveryFee = activeTab === 'in-seat' ? 50 : 0;
  const finalTotal = cartTotal + (cartItemCount > 0 ? deliveryFee : 0);

  return (
    <div className="flex flex-col h-full bg-slate-900/50 lg:bg-slate-800/30 lg:border lg:border-white/5 lg:backdrop-blur-xl lg:rounded-[2rem] lg:p-6 lg:shadow-2xl">
      <div className="flex justify-between items-center mb-6 pt-4 lg:pt-0">
        <h2 className="text-2xl font-black">Shopping Bag</h2>
        <button 
          onClick={closeCart}
          className="lg:hidden text-slate-400 font-bold uppercase text-xs tracking-wider border border-slate-700 px-3 py-1.5 rounded-full"
        >
          Close
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-4 hidden-scrollbar pr-2 mb-4">
        {cart.length === 0 ? (
          <div className="text-center flex flex-col items-center justify-center text-slate-500 mt-20 font-medium h-full">Your bag is empty.</div>
        ) : (
          cart.map((item: any) => (
            <div key={item.id} className="flex items-center justify-between bg-slate-800/80 p-3 rounded-xl border border-white/5">
              <div>
                <h4 className="font-bold text-sm truncate max-w-[140px] md:max-w-[180px]">{item.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400">{item.category}</span>
                  <span className="text-xs font-bold text-slate-400">₹{item.price * item.quantity}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-900 rounded-lg p-1 border border-slate-700">
                 <button onClick={() => removeFromCart(item.id)} className="p-1 text-slate-400 hover:text-white"><Minus size={14}/></button>
                 <span className="text-sm font-bold w-4 text-center">{item.quantity}</span>
                 <button onClick={() => addToCart(item)} className="p-1 text-slate-400 hover:text-white"><Plus size={14}/></button>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="pt-4 border-t border-slate-800 mt-auto pb-6 lg:pb-0">
        {deliveryFee > 0 && cartItemCount > 0 && (
          <div className="flex justify-between items-center mb-2 text-sm text-pink-400 font-medium">
             <span>In-Seat Delivery</span>
             <span>₹{deliveryFee}</span>
          </div>
        )}
        <div className="flex justify-between items-center mb-4 text-lg">
          <span className="font-bold text-slate-400">Total</span>
          <span className="font-black text-white">₹{finalTotal}</span>
        </div>
        <button 
          disabled={cartItemCount === 0}
          onClick={async () => {
            const orderMetadata = {
              items: cart,
              total: finalTotal,
              location: activeTab === 'in-seat' ? 'Block B, Row 4, Seat 12' : 'Express Pickup Lane 2',
              stadiumId: activeStadiumId || 'city_kolkata',
              customerName: useVenueStore.getState().user?.displayName || 'Fan'
            };
            
            await syncOrderToCloud(orderMetadata);
            clearCart();
            closeCart();
          }}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          {cartItemCount > 0 ? <><Check size={20} strokeWidth={3} /> Complete Purchase</> : 'Bag Empty'}
        </button>
      </div>
    </div>
  );
}
