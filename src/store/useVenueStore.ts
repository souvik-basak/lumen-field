import { create } from 'zustand';
import type { GoogleUser } from '../services/firebaseAuthMock';

export type WaitTime = {
  id: string;
  name: string;
  type: 'gate' | 'exit' | 'food' | 'restroom' | 'parking' | 'merch' | 'transit';
  waitTimeMinutes: number;
  density: 'Low' | 'Medium' | 'High' | 'Critical';
};

export type GameEvent = {
  id: string;
  title: string;
  description: string;
  timeToEventMinutes: number | null;
  isActive: boolean;
};

export type CommentaryEntry = {
  time: string;
  text: string;
  type: 'goal' | 'incident' | 'system' | 'info';
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Food' | 'Drink' | 'Snack' | 'Merch';
  vendorId: string;
};

export type CartItem = Product & {
  quantity: number;
};

export type LiveScore = {
  teamA: string;
  teamB: string;
  scoreA: number;
  scoreB: number;
  period: string; 
  clock: string;  
};

export interface Stadium {
  id: string;
  name: string;
  city: string;
  lat: number;
  lng: number;
  vendors: string[];
  videoIds: string[];
  transit: {
    name: string;
    line: string;
    nearestStation: string;
  };
  parking: {
    totalSpots: number;
    sections: string[];
  };
  capacity: number;
}

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Preparing' | 'Dispatched' | 'Delivered';
  location: string;
  stadiumId: string;
  customerName?: string;
  timestamp: any;
};

interface VenueState {
  activeStadiumId: string | null;
  matchStatus: 'warmup' | 'live' | 'halftime' | 'finished';
  matchMinute: number;
  waitTimes: WaitTime[];
  gameEvents: GameEvent[];
  alerts: string[];
  liveScore: LiveScore;
  matchCommentary: CommentaryEntry[];
  cart: CartItem[];
  stadiums: Record<string, Stadium>;
  isHydrated: boolean;
  cloudLoading: boolean;
  
  sosActive: boolean;
  sosType: 'Medical' | 'Security' | null;
  sosStatus: 'Dispatching' | 'Dispatched' | 'On-Site' | 'Resolved' | null;
  activeSosId: string | null;
  
  transitPassBalance: number;
  carLocation: { section: string; level: string } | null;
  user: GoogleUser | null;
  orders: Order[];
  
  setStadium: (id: string) => void;
  setUser: (user: GoogleUser | null) => void;
  setWaitTimes: (waitTimes: WaitTime[]) => void;
  setGameEvents: (events: GameEvent[]) => void;
  addAlert: (alert: string) => void;
  setLiveScore: (score: LiveScore | ((prev: LiveScore) => LiveScore)) => void;
  setMatchStatus: (status: VenueState['matchStatus']) => void;
  setMatchMinute: (min: number) => void;
  addCommentary: (entry: CommentaryEntry) => void;
  resetMatch: () => void;
  resolveZoneCongestion: (zoneId: string) => void;
  
  triggerSOS: (type: 'Medical' | 'Security', cloudId?: string) => void;
  setSOSStatus: (status: VenueState['sosStatus']) => void;
  cancelSOS: () => void;
  
  topUpPass: (amount: number) => void;
  setCarLocation: (location: { section: string; level: string } | null) => void;
  
  addToCart: (item: Product) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  setStadiums: (stadiums: Record<string, Stadium>) => void;
  setCloudLoading: (loading: boolean) => void;
  setOrders: (orders: Order[]) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  activeStadiumId: null,
  matchStatus: 'warmup',
  matchMinute: 0,
  waitTimes: [],
  gameEvents: [],
  alerts: [],
  cart: [],
  matchCommentary: [],
  liveScore: { teamA: 'Home', teamB: 'Away', scoreA: 0, scoreB: 0, period: 'Warmup', clock: '00:00' },
  sosActive: false,
  sosType: null,
  sosStatus: null,
  activeSosId: null,
  transitPassBalance: 450, // Initial balance
  carLocation: null,
  user: null,
  stadiums: {},
  isHydrated: false,
  cloudLoading: false,
  orders: [],
  
  setStadium: (id) => set({ activeStadiumId: id }),
  setUser: (user) => set({ user }),
  setWaitTimes: (waitTimes) => set({ waitTimes }),
  setGameEvents: (gameEvents) => set({ gameEvents }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 10) })),
  setMatchStatus: (matchStatus) => set({ matchStatus }),
  setMatchMinute: (matchMinute) => set({ matchMinute }),
  addCommentary: (entry) => set((state) => ({ matchCommentary: [entry, ...state.matchCommentary].slice(0, 50) })),
  
  triggerSOS: (type, cloudId) => set({ sosActive: true, sosType: type, sosStatus: 'Dispatching', activeSosId: cloudId || null }),
  setSOSStatus: (status) => set({ sosStatus: status }),
  cancelSOS: () => set({ sosActive: false, sosType: null, sosStatus: null, activeSosId: null }),
  
  topUpPass: (amount) => set((state) => ({ transitPassBalance: state.transitPassBalance + amount })),
  setCarLocation: (location) => set({ carLocation: location }),
  
  resetMatch: () => {
    const { activeStadiumId } = useVenueStore.getState();
    set((state) => ({
      matchStatus: 'warmup',
      matchMinute: 0,
      liveScore: { ...state.liveScore, scoreA: 0, scoreB: 0, clock: '00:00', period: 'Warmup' },
      matchCommentary: [],
      alerts: [],
      sosActive: false,
      sosType: null,
      sosStatus: null,
    }));
    
    // Explicitly notify the engine to reset this stadium's minute
    // We can do this by dispatching a custom event or adding a global reset signal
    window.dispatchEvent(new CustomEvent('match-reset', { detail: { stadiumId: activeStadiumId } }));
  },

  resolveZoneCongestion: (zoneId) => set((state) => ({
    waitTimes: state.waitTimes.map((w) => 
      w.id === zoneId 
        ? { ...w, waitTimeMinutes: Math.floor(w.waitTimeMinutes * 0.3), density: 'Low' }
        : w
    )
  })),

  setLiveScore: (updater) => set((state) => ({
    liveScore: typeof updater === 'function' ? updater(state.liveScore) : updater
  })),

  addToCart: (item) => set((state) => {
    const existing = state.cart.find((c) => c.id === item.id);
    if (existing) {
      return { cart: state.cart.map((c) => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c) };
    }
    return { cart: [...state.cart, { ...item, quantity: 1 }] };
  }),

  removeFromCart: (itemId) => set((state) => {
    const existing = state.cart.find((c) => c.id === itemId);
    if (existing && existing.quantity > 1) {
      return { cart: state.cart.map((c) => c.id === itemId ? { ...c, quantity: c.quantity - 1 } : c) };
    }
    return { cart: state.cart.filter((c) => c.id !== itemId) };
  }),
  
  clearCart: () => set({ cart: [] }),
  setStadiums: (stadiums) => set({ stadiums, isHydrated: true }),
  setCloudLoading: (cloudLoading) => set({ cloudLoading }),
  setOrders: (orders) => set({ orders }),
  updateOrderStatus: (orderId, status) => set((state) => ({
    orders: state.orders.map(o => o.id === orderId ? { ...o, status } : o)
  })),
}));
