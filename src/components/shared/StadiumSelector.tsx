import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Navigation, Building2 } from 'lucide-react';
import { useVenueStore } from '../../store/useVenueStore';

const POPULAR_CITIES: { id: string; name: string; stadium: string; unavailable?: boolean }[] = [
  { id: 'city_kolkata', name: 'Kolkata', stadium: 'Salt Lake Stadium' },
  { id: 'city_mumbai', name: 'Mumbai', stadium: 'Mumbai Football Arena' },
  { id: 'city_bengaluru', name: 'Bengaluru', stadium: 'Kanteerava Stadium' },
  { id: 'city_delhi', name: 'Delhi', stadium: 'JLN Stadium' },
  { id: 'city_kochi', name: 'Kochi', stadium: 'JLN Stadium' },
  { id: 'city_bhubaneswar', name: 'Bhubaneswar', stadium: 'Kalinga Stadium' },
  { id: 'city_goa', name: 'Goa', stadium: 'Fatorda Stadium' },
];

export default function StadiumSelector() {
  const { setStadium, activeStadiumId } = useVenueStore();
  const [search, setSearch] = useState('');
  const [detecting, setDetecting] = useState(false);

  // If already selected, don't show (unless we want a 'Change' button later)
  if (activeStadiumId) return null;

  const handleDetect = () => {
    setDetecting(true);
    // Simulate GPS detection
    setTimeout(() => {
      setStadium('city_kolkata');
      setDetecting(false);
    }, 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-slate-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden"
      >
        {/* Search Header */}
        <div className="p-6 md:p-8 border-b border-white/5">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-sky-400 transition-colors" size={20} />
            <input 
              type="text"
              placeholder="Search for your city or stadium..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-800 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition"
            />
          </div>
          
          <button 
            onClick={handleDetect}
            disabled={detecting}
            className="mt-4 flex items-center gap-2 text-rose-500 hover:text-rose-400 font-bold text-sm transition group disabled:opacity-50"
          >
            <Navigation size={16} className={detecting ? 'animate-spin' : 'group-hover:scale-110 transition'} />
            {detecting ? 'Detecting location...' : 'Detect my location'}
          </button>
        </div>

        {/* Popular Cities Grid */}
        <div className="p-6 md:p-8 space-y-6">
          <div className="flex items-baseline justify-between">
            <h3 className="text-xs uppercase font-black tracking-[0.2em] text-slate-500">Popular Cities</h3>
            <button className="text-xs font-bold text-sky-400 hover:underline">View All Cities</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-6">
            {POPULAR_CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map((city) => (
              <motion.button
                key={city.id}
                whileHover={city.unavailable ? {} : { y: -5 }}
                whileTap={city.unavailable ? {} : { scale: 0.95 }}
                onClick={() => !city.unavailable && setStadium(city.id)}
                className={`flex flex-col items-center gap-3 p-4 rounded-3xl transition ${city.unavailable ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5'}`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition ${city.unavailable ? 'bg-slate-800' : 'bg-slate-800 group-hover:bg-slate-700 shadow-lg'}`}>
                   <Building2 size={32} className={city.unavailable ? 'text-slate-600' : 'text-slate-200'} strokeWidth={1.5} />
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm text-white">{city.name}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{city.stadium}</p>
                </div>
                {city.unavailable && (
                    <span className="text-[8px] uppercase font-black tracking-tighter text-slate-500 bg-slate-800/50 px-1.5 py-0.5 rounded">Coming Soon</span>
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-slate-950/50 p-4 text-center border-t border-white/5">
          <p className="text-[10px] text-slate-500 font-medium">Select a city to experience the localized match day platform at that venue.</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
