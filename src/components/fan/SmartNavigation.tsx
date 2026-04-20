import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVenueStore } from '../../store/useVenueStore';
import { Navigation2, Activity, ArrowRightCircle, Scan, MapPin as MapPinIcon } from 'lucide-react';
import { DirectionsService, DirectionsRenderer, GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { STADIUM_REGISTRY } from '../../services/mockVenueData';

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

// Map Node Offset relative to center (simplified for demo)
const getNodePosition = (center: { lat: number, lng: number }, id: string) => {
  const offsets: Record<string, { lat: number, lng: number }> = {
    'g1': { lat: 0.0014, lng: 0 },
    'g2': { lat: -0.0006, lng: -0.0028 },
    'g3': { lat: -0.0021, lng: 0.0012 },
    'f1': { lat: 0.0004, lng: -0.0013 },
    'f2': { lat: -0.0009, lng: 0.0017 },
    'f3': { lat: 0.0009, lng: 0.0007 },
    'm1': { lat: -0.0001, lng: 0.0027 },
  };
  const offset = offsets[id] || { lat: 0, lng: 0 };
  return { lat: center.lat + offset.lat, lng: center.lng + offset.lng };
};

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const mapOptions = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#f8fafc' }] },
    { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#94a3b8' }] },
    { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#064e3b' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#334155' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0ea5e9' }, { opacity: 0.2 }] }
  ],
  disableDefaultUI: true,
  zoomControl: true,
};

export default function SmartNavigation() {
  const { waitTimes, activeStadiumId } = useVenueStore();
  const [arMode, setArMode] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null);

  const stadium = activeStadiumId ? STADIUM_REGISTRY[activeStadiumId] : STADIUM_REGISTRY['city_kolkata'];
  const STADIUM_CENTER = { lat: stadium.lat, lng: stadium.lng };
  const USER_LOCATION = { lat: STADIUM_CENTER.lat - 0.0006, lng: STADIUM_CENTER.lng - 0.0008 };

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  });

  const directionsCallback = (
    result: google.maps.DirectionsResult | null,
    status: google.maps.DirectionsStatus
  ) => {
    if (result !== null && status === 'OK') {
      setDirections(result);
    } else if (status !== 'OK') {
      console.error(`[Maps] Directions request failed: ${status}`);
    }
  };

  useEffect(() => {
    // Clear directions whenever selectedNode changes to fetch a fresh route
    setDirections(null);
  }, [selectedNode]);

  const getDensityColorRaw = (density: string) => {
    switch(density) {
      case 'Low': return '#10b981';
      case 'Medium': return '#eab308';
      case 'High': return '#f97316';
      case 'Critical': return '#ef4444';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="p-4 md:p-8 pt-6 space-y-6 md:space-y-8 max-w-7xl mx-auto pb-24" role="region" aria-label="Venue Navigation">
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <div>
           <h2 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-3">Interactive Map</h2>
           <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">{stadium.name} • {stadium.city}</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setArMode(!arMode)}
            aria-label={arMode ? 'Switch to 2D Map View' : 'Switch to AR Lens View'}
            aria-pressed={arMode}
            className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold tracking-wider uppercase flex items-center gap-2 border transition ${arMode ? 'bg-sky-500/20 text-sky-400 border-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.3)]' : 'glass border-white/10 hover:bg-white/10'}`}
          >
            <Scan size={16} className={arMode ? 'text-sky-400' : 'text-slate-400'} aria-hidden="true" /> AR Lens
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Dynamic Viewport (Map or AR) */}
        <div className="lg:col-span-8 relative w-full h-[500px] md:h-[600px] lg:h-[700px] rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl flex text-slate-900">
          <AnimatePresence mode="wait">
             {!arMode ? (
                <motion.div 
                  key="map"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-slate-950"
                  role="application"
                  aria-label="Google Maps Stadium View"
                >
                  {isLoaded ? (
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={STADIUM_CENTER}
                      zoom={16}
                      options={mapOptions}
                    >
                      {selectedNode && (
                        <DirectionsService
                          key={selectedNode}
                          options={{
                            origin: USER_LOCATION,
                            destination: getNodePosition(STADIUM_CENTER, selectedNode),
                            travelMode: google.maps.TravelMode.WALKING,
                          }}
                          callback={directionsCallback}
                        />
                      )}

                      {directions && (
                        <DirectionsRenderer
                          options={{
                            directions: directions,
                            suppressMarkers: true,
                            preserveViewport: true,
                            polylineOptions: {
                              strokeColor: '#8b5cf6',
                              strokeWeight: 5,
                              strokeOpacity: 0.8,
                            }
                          }}
                        />
                      )}
                      {waitTimes.map((node) => {
                        const position = getNodePosition(STADIUM_CENTER, node.id);
                        if (!position) return null;
                        
                        return (
                          <Marker
                            key={node.id}
                            position={position}
                            title={`${node.name}: ${node.waitTimeMinutes}m wait`}
                            onClick={() => setSelectedNode(node.id)}
                            icon={{
                              path: google.maps.SymbolPath.CIRCLE,
                              fillColor: getDensityColorRaw(node.density),
                              fillOpacity: 0.9,
                              strokeWeight: 2,
                              strokeColor: '#0f172a',
                              scale: 12,
                            }}
                          />
                        );
                      })}

                      {selectedNode && (
                        <InfoWindow
                          position={getNodePosition(STADIUM_CENTER, selectedNode)}
                          onCloseClick={() => setSelectedNode(null)}
                        >
                          <div className="p-2 min-w-[120px]" role="alert">
                            <h4 className="font-bold text-slate-900 text-sm">
                              {waitTimes.find(n => n.id === selectedNode)?.name}
                            </h4>
                            <p className={cn("text-xs font-bold mt-1", (waitTimes.find(n => n.id === selectedNode)?.density === 'Critical') ? 'text-red-600' : 'text-slate-600')}>
                              Wait Time: {waitTimes.find(n => n.id === selectedNode)?.waitTimeMinutes}m
                            </p>
                          </div>
                        </InfoWindow>
                      )}

                      {/* User Location Marker */}
                      <Marker 
                        position={{ lat: STADIUM_CENTER.lat - 0.0006, lng: STADIUM_CENTER.lng - 0.0008 }}
                        title="Your current location"
                        icon={{
                          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z',
                          fillColor: '#ec4899',
                          fillOpacity: 1,
                          strokeWeight: 2,
                          strokeColor: '#ffffff',
                          scale: 1.5,
                          anchor: new google.maps.Point(12, 22)
                        }}
                      />
                    </GoogleMap>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold bg-slate-900" aria-live="polite">
                      Loading {stadium.name} Live Data...
                    </div>
                  )}
                </motion.div>
             ) : (
                <motion.div 
                  key="ar"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-slate-800"
                >
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1577934415848-0ca1a6eb12cf?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-40"></div>
                  <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply"></div>
                  <div className="absolute inset-4 border-2 border-white/20 rounded-3xl pointer-events-none flex flex-col items-center justify-center mix-blend-overlay">
                     <Scan size={200} className="text-white/20" strokeWidth={1} />
                  </div>
                  <motion.div 
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.5, type: "spring" }}
                    className="absolute top-[25%] left-[35%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                  >
                    <div className="bg-emerald-500 text-slate-900 p-4 rounded-full shadow-[0_0_30px_rgba(16,185,129,0.8)] border-[3px] border-white">
                      <Scan size={32} />
                    </div>
                    <div className="mt-4 bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-center shadow-2xl">
                       <h4 className="font-black text-white text-lg">Gate 1 Entry</h4>
                       <p className="font-bold text-emerald-400 text-sm">450 ft • Clear Flow</p>
                    </div>
                  </motion.div>
                </motion.div>
             )}
          </AnimatePresence>
        </div>

        {/* Quick Route Suggestions sidebar */}
        <div className="lg:col-span-4 flex flex-col w-full h-full">
          <div className="glass-dark border border-white/10 rounded-[2.5rem] p-6 shadow-xl h-full flex flex-col">
            <h3 className="font-black mb-6 text-white tracking-tight text-xl flex items-center gap-3">
              <Navigation2 size={24} className="text-violet-400" /> Fast Routes
            </h3>
            
            <div className="space-y-4 flex-1">
              {waitTimes.filter(w => w.density === 'Low' || w.density === 'Medium').slice(0, 5).map((w, index) => {
                 return (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    key={w.id} 
                    className="bg-slate-800/40 border border-white/5 p-4 rounded-2xl flex justify-between items-center hover:bg-white/10 transition cursor-pointer group"
                    onClick={() => {
                        setSelectedNode(w.id);
                        setArMode(false);
                    }}
                  >
                    <div className="flex gap-4 items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-900 border border-slate-900" style={{backgroundColor: getDensityColorRaw(w.density)}}>
                        <ArrowRightCircle size={14} className="text-slate-900" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-slate-100 group-hover:text-white transition-colors">{w.name}</h4>
                        <p className="text-xs font-bold text-slate-400 capitalize mt-0.5">{w.type} • {w.waitTimeMinutes}m</p>
                      </div>
                    </div>
                    <button className="bg-slate-900 group-hover:bg-violet-500/20 p-3 rounded-full transition shadow-md border border-slate-700 group-hover:border-violet-500/50">
                      <ArrowRightCircle size={18} className="text-violet-400" />
                    </button>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
