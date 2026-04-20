import { describe, it, expect, vi, beforeEach } from 'vitest';
import { startMockVenueEngine, STADIUM_REGISTRY } from '../services/mockVenueData';
import { useVenueStore } from '../store/useVenueStore';

describe('mockVenueData engine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useVenueStore.getState().resetMatch();
  });

  it('updates match minute periodically', () => {
    // Set active stadium so engine runs
    useVenueStore.getState().setStadium('city_kolkata');
    
    startMockVenueEngine();
    
    // Fast forward time
    vi.advanceTimersByTime(5000); 
    
    const minute = useVenueStore.getState().matchMinute;
    expect(minute).toBeGreaterThan(0);
  });

  it('rotates match status from warmup to live', () => {
    useVenueStore.getState().setStadium('city_kolkata');
    startMockVenueEngine();

    // 1st tick is live because matchMinute becomes 1 immediately
    vi.advanceTimersByTime(1100); 
    expect(useVenueStore.getState().matchStatus).toBe('live');

    // Advance to halftime
    useVenueStore.getState().setMatchMinute(45);
    vi.advanceTimersByTime(4000); 
    expect(useVenueStore.getState().matchStatus).toBe('halftime');
  });

  it('stadium registry contains required initial data', () => {
    const kolkata = STADIUM_REGISTRY['city_kolkata'];
    expect(kolkata).toBeDefined();
    expect(kolkata.name).toBe('Lumen Field');
    expect(kolkata.initialWaitTimes.length).toBeGreaterThan(0);
  });
});
