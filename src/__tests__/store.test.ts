import { describe, it, expect, beforeEach } from 'vitest';
import { useVenueStore } from '../store/useVenueStore';

describe('useVenueStore', () => {
  beforeEach(() => {
    // Reset store before each test
    const { resetMatch, clearCart } = useVenueStore.getState();
    resetMatch();
    clearCart();
  });

  it('initially has correct default values', () => {
    const state = useVenueStore.getState();
    expect(state.sosActive).toBe(false);
    expect(state.cart).toHaveLength(0);
    expect(state.matchStatus).toBe('warmup');
  });

  it('can set stadium', () => {
    useVenueStore.getState().setStadium('city_kolkata');
    expect(useVenueStore.getState().activeStadiumId).toBe('city_kolkata');
  });

  it('can manage cart items', () => {
    const product = { id: 'p1', name: 'Jersey', price: 1000, category: 'Merch', vendorId: 'v1' } as any;
    
    // Add to cart
    useVenueStore.getState().addToCart(product);
    expect(useVenueStore.getState().cart).toHaveLength(1);
    expect(useVenueStore.getState().cart[0].quantity).toBe(1);

    // Increase quantity
    useVenueStore.getState().addToCart(product);
    expect(useVenueStore.getState().cart[0].quantity).toBe(2);

    // Remove from cart
    useVenueStore.getState().removeFromCart('p1');
    expect(useVenueStore.getState().cart[0].quantity).toBe(1);

    useVenueStore.getState().removeFromCart('p1');
    expect(useVenueStore.getState().cart).toHaveLength(0);
  });

  it('can trigger and cancel SOS', () => {
    useVenueStore.getState().triggerSOS('Medical');
    let state = useVenueStore.getState();
    expect(state.sosActive).toBe(true);
    expect(state.sosType).toBe('Medical');
    expect(state.sosStatus).toBe('Dispatching');

    useVenueStore.getState().cancelSOS();
    state = useVenueStore.getState();
    expect(state.sosActive).toBe(false);
    expect(state.sosType).toBe(null);
  });

  it('can resolve zone congestion', () => {
    const waitTimes = [{ id: 'z1', name: 'Gate 1', waitTimeMinutes: 45, density: 'Critical' }] as any;
    useVenueStore.getState().setWaitTimes(waitTimes);
    
    useVenueStore.getState().resolveZoneCongestion('z1');
    const updated = useVenueStore.getState().waitTimes.find(w => w.id === 'z1');
    expect(updated?.waitTimeMinutes).toBeLessThan(45);
    expect(updated?.density).toBe('Low');
  });
});
