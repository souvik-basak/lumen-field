import { useState, useCallback } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  OverlayViewF,
  InfoWindowF,
} from '@react-google-maps/api';
import type { WaitTime } from '../../store/useVenueStore';

/* ─── Custom dark map styles ───────────────────────────────────── */
const DARK_STYLES: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#64748b' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#0f172a' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ visibility: 'off' }] },
  { featureType: 'poi', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#1e293b' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#1e3a5f' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#020617' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#0d1b2a' }] },
];

/* ─── Density → colour ─────────────────────────────────────────── */
const DENSITY: Record<string, { bg: string; ring: string; text: string; pulse: boolean }> = {
  Critical: { bg: '#dc2626', ring: '#ef4444', text: '#fff', pulse: true },
  High:     { bg: '#ea580c', ring: '#f97316', text: '#fff', pulse: false },
  Medium:   { bg: '#d97706', ring: '#f59e0b', text: '#000', pulse: false },
  Low:      { bg: '#059669', ring: '#10b981', text: '#fff', pulse: false },
};

/* ─── Spread nodes around stadium in a ~100 m ring ─────────────── */
function nodePos(lat: number, lng: number, i: number, total: number) {
  const angle      = (i * 2 * Math.PI) / total - Math.PI / 2;
  const radiusLat  = 0.0006;
  const radiusLng  = 0.0008;
  return {
    lat: lat + radiusLat * Math.sin(angle),
    lng: lng + radiusLng * Math.cos(angle),
  };
}

interface VenueMapProps {
  lat: number;
  lng: number;
  waitTimes: WaitTime[];
}

export default function VenueMap({ lat, lng, waitTimes }: VenueMapProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'venue-map',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string,
  });

  const [selected, setSelected] = useState<{ node: WaitTime; pos: { lat: number; lng: number } } | null>(null);
  const onUnmount = useCallback(() => {}, []);

  if (loadError) return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center text-red-400 font-black text-sm">
      Map failed to load
    </div>
  );

  if (!isLoaded) return (
    <div className="flex-1 bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-slate-500">
        <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
        <p className="font-black text-sm uppercase tracking-widest">Loading Map…</p>
      </div>
    </div>
  );

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '100%' }}
      center={{ lat, lng }}
      zoom={16}
      onUnmount={onUnmount}
      options={{
        styles: DARK_STYLES,
        disableDefaultUI: false,
        mapTypeId: 'satellite',
        tilt: 0,
        gestureHandling: 'greedy',
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        zoomControl: true,
      }}
    >
      {/* Zone markers */}
      {waitTimes.map((node, i) => {
        const pos   = nodePos(lat, lng, i, waitTimes.length);
        const style = DENSITY[node.density] ?? DENSITY.Low;
        const label = node.name.length > 12 ? node.name.slice(0, 10) + '…' : node.name;

        return (
          <OverlayViewF
            key={node.id}
            position={pos}
            mapPaneName="overlayMouseTarget"
          >
            <div
              onClick={() => setSelected(s => s?.node.id === node.id ? null : { node, pos })}
              style={{
                position: 'absolute',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
                userSelect: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 4,
              }}
            >
              {/* Outer pulse ring for critical */}
              {style.pulse && (
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -55%)',
                  width: 56,
                  height: 56,
                  borderRadius: '50%',
                  backgroundColor: style.bg,
                  opacity: 0.35,
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                  pointerEvents: 'none',
                }} />
              )}

              {/* Main pill badge */}
              <div style={{
                background: style.bg,
                border: `2.5px solid ${style.ring}`,
                borderRadius: 12,
                padding: '5px 10px',
                boxShadow: `0 0 16px ${style.bg}aa, 0 4px 12px #00000080`,
                minWidth: 80,
                textAlign: 'center',
                backdropFilter: 'blur(8px)',
              }}>
                <div style={{
                  fontSize: 9,
                  fontWeight: 900,
                  color: style.text,
                  opacity: 0.85,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  lineHeight: 1,
                  marginBottom: 2,
                  whiteSpace: 'nowrap',
                }}>
                  {label}
                </div>
                <div style={{
                  fontSize: 18,
                  fontWeight: 900,
                  color: style.text,
                  lineHeight: 1,
                }}>
                  {node.waitTimeMinutes}m
                </div>
              </div>

              {/* Dot anchor below the badge */}
              <div style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: style.bg,
                border: `2px solid ${style.ring}`,
                boxShadow: `0 0 6px ${style.bg}`,
                marginTop: -2,
              }} />
            </div>
          </OverlayViewF>
        );
      })}

      {/* InfoWindow on click */}
      {selected && (
        <InfoWindowF
          position={selected.pos}
          onCloseClick={() => setSelected(null)}
          options={{ pixelOffset: new window.google.maps.Size(0, -80) }}
        >
          <div style={{ fontFamily: 'system-ui, sans-serif', padding: '6px 4px', minWidth: 160, background: '#0f172a', color: '#fff' }}>
            <div style={{ fontSize: 10, fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#64748b', marginBottom: 4 }}>
              {selected.node.type}
            </div>
            <div style={{ fontSize: 16, fontWeight: 900, marginBottom: 8 }}>
              {selected.node.name}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{
                background: DENSITY[selected.node.density]?.bg ?? '#10b981',
                color: '#fff',
                borderRadius: 6,
                padding: '2px 8px',
                fontSize: 11,
                fontWeight: 900,
                border: `1px solid ${DENSITY[selected.node.density]?.ring ?? '#10b981'}`,
              }}>
                {selected.node.density}
              </span>
              <span style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8' }}>
                {selected.node.waitTimeMinutes} min wait
              </span>
            </div>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}
