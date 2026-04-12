import { useVenueStore } from '../store/useVenueStore';
import type { WaitTime, GameEvent, Product } from '../store/useVenueStore';

const INITIAL_WAIT_TIMES: WaitTime[] = [
  { id: 'g1', name: 'North Exit Gate', type: 'exit', waitTimeMinutes: 2, density: 'Low' },
  { id: 'g2', name: 'Main Concourse Exit', type: 'exit', waitTimeMinutes: 18, density: 'Medium' },
  { id: 'g3', name: 'South Transit Gate', type: 'exit', waitTimeMinutes: 45, density: 'Critical' },
  { id: 'f1', name: 'Lumen Burgers', type: 'food', waitTimeMinutes: 12, density: 'Medium' },
  { id: 'f2', name: 'Seattle Dog Cart', type: 'food', waitTimeMinutes: 35, density: 'Critical' },
  { id: 'f3', name: 'Craft Beer Station', type: 'food', waitTimeMinutes: 5, density: 'Low' },
  { id: 'r1', name: 'Toilet Sec 102', type: 'restroom', waitTimeMinutes: 2, density: 'Low' },
  { id: 'r2', name: 'Toilet Sec 105', type: 'restroom', waitTimeMinutes: 15, density: 'High' },
  { id: 'r3', name: 'Toilet Sec 214', type: 'restroom', waitTimeMinutes: 25, density: 'High' },
  { id: 'p1', name: 'North VIP Parking', type: 'parking', waitTimeMinutes: 5, density: 'Low' },
  { id: 'p2', name: 'South Garage Exit', type: 'parking', waitTimeMinutes: 30, density: 'High' },
  { id: 'm1', name: 'Pro Shop Sec 120', type: 'merch', waitTimeMinutes: 42, density: 'Critical' },
];

const INITIAL_EVENTS: GameEvent[] = [
  { id: 'e1', title: 'Halftime Show', description: 'Optimal time for food & restroom runs', timeToEventMinutes: 15, isActive: false },
  { id: 'e2', title: 'Start of Q3', description: 'Action resumes', timeToEventMinutes: 30, isActive: false },
  { id: 'e3', title: 'Post-game Exit', description: 'Expect heavy traffic at all gates', timeToEventMinutes: 80, isActive: false },
];

export const MOCK_MENU_ITEMS: Product[] = [
  { id: 'f_m1', name: 'Stadium Burger', price: 12.50, category: 'Food', vendorId: 'f1' },
  { id: 'f_m2', name: 'Garlic Fries', price: 6.00, category: 'Food', vendorId: 'f1' },
  { id: 'f_m3', name: 'Seattle Dog w/ Onions', price: 8.50, category: 'Food', vendorId: 'f2' },
  { id: 'f_m4', name: 'Craft IPA 16oz', price: 14.00, category: 'Drink', vendorId: 'f3' },
  { id: 'f_m5', name: 'Domestic Light Beer', price: 9.00, category: 'Drink', vendorId: 'f3' },
];

export const MOCK_MERCH_ITEMS: Product[] = [
  { id: 'm_1', name: 'Home Jersey (Authentic)', price: 129.99, category: 'Merch', vendorId: 'm1' },
  { id: 'm_2', name: 'Team Beanie', price: 29.99, category: 'Merch', vendorId: 'm1' },
  { id: 'm_3', name: 'Signature Staff Hoodie', price: 74.50, category: 'Merch', vendorId: 'm1' },
  { id: 'm_4', name: 'Foam Finger', price: 15.00, category: 'Merch', vendorId: 'm1' },
];

export const startMockVenueEngine = () => {
  const store = useVenueStore.getState();
  store.setWaitTimes(INITIAL_WAIT_TIMES);
  store.setGameEvents(INITIAL_EVENTS);

  // Time evolution simulator
  setInterval(() => {
    const { waitTimes, gameEvents, addAlert, setLiveScore } = useVenueStore.getState();
    
    // Animate Wait Times
    const newWaitTimes = waitTimes.map((wt) => {
      let newTime = wt.waitTimeMinutes + Math.floor(Math.random() * 7) - 3;
      newTime = Math.max(0, Math.min(90, newTime)); // Bound 0-90
      
      let newDensity: WaitTime['density'] = 'Low';
      if (newTime > 30) newDensity = 'Critical';
      else if (newTime > 15) newDensity = 'High';
      else if (newTime > 5) newDensity = 'Medium';

      if (newDensity === 'Critical' && wt.density !== 'Critical') {
        addAlert(`Alert: ${wt.name} is severely overcrowded (${newTime}m). Dispatching staff.`);
      }

      return { ...wt, waitTimeMinutes: newTime, density: newDensity };
    });

    useVenueStore.getState().setWaitTimes(newWaitTimes);

    // Animate Game Events (countdown)
    const newEvents = gameEvents.map((evt) => {
      let newTime = evt.timeToEventMinutes;
      if (newTime !== null && newTime > 0) {
        newTime = Math.max(0, newTime - 1);
        if (newTime === 5 && evt.timeToEventMinutes !== 5) {
            addAlert(`Reminder: ${evt.title} begins in 5 minutes!`);
        }
      }
      return { ...evt, timeToEventMinutes: newTime, isActive: newTime === 0 };
    });
    useVenueStore.getState().setGameEvents(newEvents);

    // Simulate Match Score logic (football)
    setLiveScore((prev) => {
      // Simulate clock ticking by decrementing seconds (mocked format "MM:SS")
      const [minStr, secStr] = prev.clock.split(':');
      let min = parseInt(minStr);
      let sec = parseInt(secStr);

      sec -= 5;
      if (sec < 0) {
        sec = 55;
        min -= 1;
      }
      if (min < 0) min = 0; // End of quarter

      // Randomly update score sometimes
      const isScoreA = Math.random() > 0.98;
      const isScoreB = Math.random() > 0.99; // B scores less often

      if (isScoreA) addAlert(`TOUCHDOWN: ${prev.teamA} scores!`);
      if (isScoreB) addAlert(`FIELD GOAL: ${prev.teamB} scores!`);

      return {
        ...prev,
        scoreA: prev.scoreA + (isScoreA ? 7 : 0),
        scoreB: prev.scoreB + (isScoreB ? 3 : 0),
        clock: `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`
      };
    });
    
  }, 5000); 
};
