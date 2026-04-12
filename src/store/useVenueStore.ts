import { create } from 'zustand';

export type WaitTime = {
  id: string;
  name: string;
  type: 'gate' | 'exit' | 'food' | 'restroom' | 'parking' | 'merch';
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
  period: string; // e.g. "Q2", "Halftime"
  clock: string;  // e.g. "14:07"
};

interface VenueState {
  waitTimes: WaitTime[];
  gameEvents: GameEvent[];
  alerts: string[];
  liveScore: LiveScore;
  cart: CartItem[];
  setWaitTimes: (waitTimes: WaitTime[]) => void;
  setGameEvents: (events: GameEvent[]) => void;
  addAlert: (alert: string) => void;
  setLiveScore: (score: LiveScore | ((prev: LiveScore) => LiveScore)) => void;
  addToCart: (item: Product) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
}

export const useVenueStore = create<VenueState>((set) => ({
  waitTimes: [],
  gameEvents: [],
  alerts: [],
  cart: [],
  liveScore: { teamA: 'Eagles', teamB: 'Falcons', scoreA: 14, scoreB: 7, period: 'Q2', clock: '14:07' },
  
  setWaitTimes: (waitTimes) => set({ waitTimes }),
  setGameEvents: (gameEvents) => set({ gameEvents }),
  addAlert: (alert) => set((state) => ({ alerts: [alert, ...state.alerts].slice(0, 10) })),
  
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
}));
