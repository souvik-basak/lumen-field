import { useVenueStore } from '../store/useVenueStore';
import type { WaitTime, GameEvent, Product, Stadium, CommentaryEntry } from '../store/useVenueStore';

export const STADIUM_REGISTRY: Record<string, Stadium & { initialWaitTimes: WaitTime[], menu: Product[], merch: Product[] }> = {
  'city_kolkata': {
    id: 'city_kolkata',
    name: 'Salt Lake Stadium',
    city: 'Kolkata',
    lat: 22.5695,
    lng: 88.4094,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['1WBOLpRW2_E', 'c5nhWy7Zoxg', 'IzbCLBXAGFM', 'ZeXx3nRWmTA'],
    transit: {
      name: 'East-West Metro',
      line: 'Green Line (Line 2)',
      nearestStation: 'Salt Lake Stadium Metro'
    },
    parking: {
      totalSpots: 4500,
      sections: ['P1 - North', 'P2 - VIP', 'P3 - Public']
    },
    capacity: 68000,
    initialWaitTimes: [
      { id: 'g1', name: 'Gate 1 (Metro Side)', type: 'exit', waitTimeMinutes: 12, density: 'Medium' },
      { id: 'f1', name: 'Kolkata Kati Rolls', type: 'food', waitTimeMinutes: 15, density: 'Medium' },
      { id: 't1', name: 'Salt Lake Metro Station', type: 'transit', waitTimeMinutes: 10, density: 'Low' },
      { id: 'p1', name: 'Premium Parking P1', type: 'parking', waitTimeMinutes: 5, density: 'Low' },
      { id: 'm1', name: 'Merch Sec 104', type: 'merch', waitTimeMinutes: 5, density: 'Low' },
    ],
    menu: [
      { id: 'f_k1', name: 'Double Kati Roll', price: 180, category: 'Food', vendorId: 'f1' },
      { id: 'f_k2', name: 'Fish Fry (2pcs)', price: 220, category: 'Food', vendorId: 'f2' },
      { id: 'f_k3', name: 'Masala Chai', price: 40, category: 'Drink', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_k1', name: 'Mohun Bagan Jersey', price: 1499, category: 'Merch', vendorId: 'm1' },
      { id: 'm_k2', name: 'East Bengal Scarf', price: 499, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_mumbai': {
    id: 'city_mumbai',
    name: 'Mumbai Football Arena',
    city: 'Mumbai',
    lat: 19.1294,
    lng: 72.8362,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['ZeXx3nRWmTA', '1WBOLpRW2_E', 'c5nhWy7Zoxg', 'IzbCLBXAGFM'],
    transit: {
      name: 'Mumbai Suburban',
      line: 'Western Line',
      nearestStation: 'Andheri Station'
    },
    parking: {
      totalSpots: 2000,
      sections: ['Level 1 - VIP', 'Level 2 - General']
    },
    capacity: 18000,
    initialWaitTimes: [
      { id: 'g1', name: 'Main Gate (Andheri)', type: 'exit', waitTimeMinutes: 5, density: 'Low' },
      { id: 'f1', name: 'Mumbai Vada Pav', type: 'food', waitTimeMinutes: 8, density: 'Low' },
      { id: 't1', name: 'Andheri Metro/Local Hub', type: 'transit', waitTimeMinutes: 15, density: 'Medium' },
      { id: 'p1', name: 'Arena Parking L2', type: 'parking', waitTimeMinutes: 10, density: 'Medium' },
      { id: 'm1', name: 'MCFC Merch Hub', type: 'merch', waitTimeMinutes: 15, density: 'Medium' },
    ],
    menu: [
      { id: 'f_m1', name: 'Special Vada Pav', price: 60, category: 'Food', vendorId: 'f1' },
      { id: 'f_m2', name: 'Butter Pav Bhaji', price: 160, category: 'Food', vendorId: 'f2' },
      { id: 'f_m3', name: 'Cutting Chai', price: 20, category: 'Drink', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_m1', name: 'Mumbai City FC Home', price: 1299, category: 'Merch', vendorId: 'm1' },
      { id: 'm_m2', name: 'ISL Official Ball', price: 2499, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_bengaluru': {
    id: 'city_bengaluru',
    name: 'Kanteerava Stadium',
    city: 'Bengaluru',
    lat: 12.9697,
    lng: 77.5627,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['IzbCLBXAGFM', 'ZeXx3nRWmTA', '1WBOLpRW2_E', 'c5nhWy7Zoxg'],
    transit: {
      name: 'Namma Metro',
      line: 'Purple Line',
      nearestStation: 'Cubbon Park Metro'
    },
    parking: {
      totalSpots: 1500,
      sections: ['Campus Lot', 'VIP Entrance']
    },
    capacity: 12000,
    initialWaitTimes: [
      { id: 'g1', name: 'Gate 2 (Cubbon Park)', type: 'exit', waitTimeMinutes: 8, density: 'Medium' },
      { id: 'f1', name: 'BFC Masala Dosa', type: 'food', waitTimeMinutes: 4, density: 'Low' },
      { id: 't1', name: 'Cubbon Park Metro', type: 'transit', waitTimeMinutes: 12, density: 'Medium' },
      { id: 'p1', name: 'VIP East Parking', type: 'parking', waitTimeMinutes: 8, density: 'Low' },
      { id: 'm1', name: 'Blues Store', type: 'merch', waitTimeMinutes: 30, density: 'High' },
    ],
    menu: [
      { id: 'f_b1', name: 'Ghee Podi Dosa', price: 110, category: 'Food', vendorId: 'f1' },
      { id: 'f_b2', name: 'Filter Coffee', price: 35, category: 'Drink', vendorId: 'f2' },
      { id: 'f_b3', name: 'Mangalore Buns', price: 80, category: 'Snack', vendorId: 'f1' },
    ],
    merch: [
      { id: 'm_b1', name: 'BFC Home Jersey', price: 1399, category: 'Merch', vendorId: 'm1' },
      { id: 'm_b2', name: 'Blue Scarf', price: 399, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_delhi': {
    id: 'city_delhi',
    name: 'JLN Stadium',
    city: 'Delhi',
    lat: 28.5829,
    lng: 77.2344,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['K4DyBUG242c', 'i-Qp7ZpA_6g', '3FmByK-6R9c', 'aqz-KE-bpKQ'],
    transit: {
      name: 'Delhi Metro',
      line: 'Violet Line',
      nearestStation: 'JLN Stadium Metro'
    },
    parking: {
      totalSpots: 5000,
      sections: ['Gate 1 Complex', 'Gate 3 Complex', 'NDMC Overflow']
    },
    capacity: 60000,
    initialWaitTimes: [
      { id: 'g1', name: 'Metro Entry Gate', type: 'exit', waitTimeMinutes: 20, density: 'High' },
      { id: 'f1', name: 'Delhi Momos', type: 'food', waitTimeMinutes: 10, density: 'Medium' },
      { id: 't1', name: 'JLN Stadium Metro', type: 'transit', waitTimeMinutes: 22, density: 'High' },
      { id: 'p1', name: 'Gate 1 Parking Complex', type: 'parking', waitTimeMinutes: 18, density: 'High' },
      { id: 'm1', name: 'National Team Store', type: 'merch', waitTimeMinutes: 25, density: 'High' },
    ],
    menu: [
      { id: 'f_d1', name: 'Steamed Momos (8pcs)', price: 150, category: 'Food', vendorId: 'f1' },
      { id: 'f_d2', name: 'Special Chole Bhature', price: 120, category: 'Food', vendorId: 'f2' },
      { id: 'f_d3', name: 'Lassi', price: 70, category: 'Drink', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_d1', name: 'India Home Jersey', price: 1999, category: 'Merch', vendorId: 'm1' },
      { id: 'm_d2', name: 'Blue Pilgrims Scarf', price: 599, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_kochi': {
    id: 'city_kochi',
    name: 'JLN Stadium',
    city: 'Kochi',
    lat: 9.9972,
    lng: 76.3011,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['_oW_T_7_oP0', 'aqz-KE-bpKQ', 'vK9vV8H-rQo', 'i-Qp7ZpA_6g'],
    transit: {
      name: 'Kochi Metro',
      line: 'Aqua Line',
      nearestStation: 'JLN Stadium Metro'
    },
    parking: {
      totalSpots: 3500,
      sections: ['East Block', 'West VIP']
    },
    capacity: 60000,
    initialWaitTimes: [
      { id: 'g1', name: 'South Stand', type: 'exit', waitTimeMinutes: 35, density: 'Critical' },
      { id: 'f1', name: 'Malabar Paratha Hub', type: 'food', waitTimeMinutes: 22, density: 'High' },
      { id: 't1', name: 'JLN Metro Station', type: 'transit', waitTimeMinutes: 45, density: 'Critical' },
      { id: 'p1', name: 'Public Parking A', type: 'parking', waitTimeMinutes: 30, density: 'High' },
      { id: 'm1', name: 'Yellow Army Merch', type: 'merch', waitTimeMinutes: 40, density: 'Critical' },
    ],
    menu: [
      { id: 'f_ko1', name: 'Beef Roast & Paratha', price: 240, category: 'Food', vendorId: 'f1' },
      { id: 'f_ko2', name: 'Fresh Coconut Water', price: 50, category: 'Drink', vendorId: 'f2' },
      { id: 'f_ko3', name: 'Banana Chips', price: 60, category: 'Snack', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_ko1', name: 'Kerala Blasters Jersey', price: 1499, category: 'Merch', vendorId: 'm1' },
      { id: 'm_ko2', name: 'KBFC Yellow Scarf', price: 449, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_bhubaneswar': {
    id: 'city_bhubaneswar',
    name: 'Kalinga Stadium',
    city: 'Bhubaneswar',
    lat: 20.2881,
    lng: 85.8238,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['aqz-KE-bpKQ', '6M-n2A-rLGs', '3e_126uF1R0', 'vK9vV8H-rQo'],
    transit: {
      name: 'City Bus Rapid Transit',
      line: 'Blue Route',
      nearestStation: 'Kalinga Stadium Bus Stand'
    },
    parking: {
      totalSpots: 3000,
      sections: ['North Lot A', 'South Lot B']
    },
    capacity: 15000,
    initialWaitTimes: [
      { id: 'g1', name: 'Main Gate', type: 'exit', waitTimeMinutes: 10, density: 'Medium' },
      { id: 'f1', name: 'Odia Food Corner', type: 'food', waitTimeMinutes: 12, density: 'Medium' },
      { id: 't1', name: 'Kalinga Stadium Bus Stand', type: 'transit', waitTimeMinutes: 8, density: 'Low' },
      { id: 'p1', name: 'North Lot A', type: 'parking', waitTimeMinutes: 6, density: 'Low' },
      { id: 'm1', name: 'Odisha FC Store', type: 'merch', waitTimeMinutes: 10, density: 'Low' },
    ],
    menu: [
      { id: 'f_bh1', name: 'Dahibara Aludum', price: 80, category: 'Food', vendorId: 'f2' },
      { id: 'f_bh2', name: 'Odia Pahala Rosogolla', price: 40, category: 'Snack', vendorId: 'f1' },
      { id: 'f_bh3', name: 'Sweet Lassi', price: 50, category: 'Drink', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_bh1', name: 'Odisha FC Home Kit', price: 1299, category: 'Merch', vendorId: 'm1' },
      { id: 'm_bh2', name: 'Juggernauts Scarf', price: 399, category: 'Merch', vendorId: 'm1' },
    ]
  },
  'city_goa': {
    id: 'city_goa',
    name: 'Fatorda Stadium',
    city: 'Goa',
    lat: 15.2892,
    lng: 73.9622,
    vendors: ['f1', 'f2', 'f3', 'm1'],
    videoIds: ['vK9vV8H-rQo', '_oW_T_7_oP0', 'aqz-KE-bpKQ', 'i-Qp7ZpA_6g'],
    transit: {
      name: 'Kadamba Transport',
      line: 'South Margao Line',
      nearestStation: 'Fatorda Bus Station'
    },
    parking: {
      totalSpots: 2500,
      sections: ['Fatorda East', 'Stadium Road West']
    },
    capacity: 19000,
    initialWaitTimes: [
      { id: 'g1', name: 'Main Stand', type: 'exit', waitTimeMinutes: 15, density: 'Medium' },
      { id: 'f1', name: 'Goan Fish Thali', type: 'food', waitTimeMinutes: 20, density: 'High' },
      { id: 't1', name: 'Fatorda Bus Station', type: 'transit', waitTimeMinutes: 10, density: 'Low' },
      { id: 'p1', name: 'Fatorda East Lot', type: 'parking', waitTimeMinutes: 12, density: 'Medium' },
      { id: 'm1', name: 'FC Goa Fan Zone', type: 'merch', waitTimeMinutes: 18, density: 'Medium' },
    ],
    menu: [
      { id: 'f_g1', name: 'Fish Thali', price: 280, category: 'Food', vendorId: 'f1' },
      { id: 'f_g2', name: 'Chorizo Poyee', price: 180, category: 'Food', vendorId: 'f2' },
      { id: 'f_g3', name: 'Bebinca (2pcs)', price: 90, category: 'Snack', vendorId: 'f3' },
    ],
    merch: [
      { id: 'm_g1', name: 'FC Goa Home Jersey', price: 1399, category: 'Merch', vendorId: 'm1' },
      { id: 'm_g2', name: 'Gaurs Scarf', price: 449, category: 'Merch', vendorId: 'm1' },
    ]
  }
};

const MATCHES = [
  // Kolkata Matches
  { teamA: 'Mohun Bagan', teamB: 'East Bengal', city: 'city_kolkata' },
  { teamA: 'India', teamB: 'Kuwait', city: 'city_kolkata' },
  { teamA: 'Mohun Bagan', teamB: 'Jamshedpur FC', city: 'city_kolkata' },
  
  // Mumbai Matches
  { teamA: 'Mumbai City', teamB: 'Kerala Blasters', city: 'city_mumbai' },
  { teamA: 'FC Goa', teamB: 'Mumbai City', city: 'city_mumbai' },
  { teamA: 'Argentina', teamB: 'France', city: 'city_mumbai' },
  
  // Bengaluru Matches
  { teamA: 'Bengaluru FC', teamB: 'Chennaiyin FC', city: 'city_bengaluru' },
  { teamA: 'Bengaluru FC', teamB: 'Kerala Blasters', city: 'city_bengaluru' },
  
  // Delhi Matches
  { teamA: 'India', teamB: 'Afghanistan', city: 'city_delhi' },
  { teamA: 'Delhi FC', teamB: 'Mohammedan SC', city: 'city_delhi' },
  { teamA: 'India', teamB: 'Qatar', city: 'city_delhi' },

  // Kochi Matches
  { teamA: 'Kerala Blasters', teamB: 'East Bengal', city: 'city_kochi' },
  { teamA: 'Kerala Blasters', teamB: 'Mumbai City', city: 'city_kochi' },

  // Bhubaneswar Matches
  { teamA: 'Odisha FC', teamB: 'Mohun Bagan', city: 'city_bhubaneswar' },
  { teamA: 'Odisha FC', teamB: 'Hyderabad FC', city: 'city_bhubaneswar' },

  // Goa Matches
  { teamA: 'FC Goa', teamB: 'Kerala Blasters', city: 'city_goa' },
  { teamA: 'FC Goa', teamB: 'Jamshedpur FC', city: 'city_goa' },
];

export const startMockVenueEngine = () => {
  let scoreA = 0;
  let scoreB = 0;
  let currentMatch = MATCHES[0];

  const tick = () => {
    const { 
      activeStadiumId, 
      setWaitTimes, 
      setLiveScore, 
      setMatchStatus, 
      setMatchMinute,
      matchMinute,
      addCommentary, 
      matchStatus,
      addAlert,
      sosActive,
      sosType,
      sosStatus,
      setSOSStatus
    } = useVenueStore.getState();
    
    if (!activeStadiumId) {
      setTimeout(tick, 2000);
      return;
    }

    const stadium = STADIUM_REGISTRY[activeStadiumId];
    if (!stadium) {
      setTimeout(tick, 2000);
      return;
    }

    // Update current match teams based on city if not set
    if (activeStadiumId !== currentMatch.city) {
      const cityMatches = MATCHES.filter(m => m.city === activeStadiumId);
      currentMatch = cityMatches[Math.floor(Math.random() * cityMatches.length)] || MATCHES[0];
      setMatchMinute(0);
      scoreA = 0;
      scoreB = 0;
      setMatchStatus('warmup');
      useVenueStore.getState().resetMatch();
      setTimeout(tick, 1000);
      return;
    }

    const currentMin = matchMinute + 1;
    setMatchMinute(currentMin);

    // Match Status Logic
    if (currentMin <= 0) {
      setMatchStatus('warmup');
    } else if (currentMin <= 45) {
      setMatchStatus('live');
    } else if (currentMin <= 60) {
      setMatchStatus('halftime');
    } else if (currentMin <= 105) {
      setMatchStatus('live');
    } else {
      setMatchStatus('finished');
      // No more ticks until reset
      return; 
    }

    // Live Score & Clock Simulation
    const clockMin = currentMin <= 45 ? currentMin : currentMin <= 60 ? 45 : currentMin - 15;
    const displayClock = `${clockMin.toString().padStart(2, '0')}:00`;
    const period = currentMin <= 45 ? '1st Half' : currentMin <= 60 ? 'Halftime' : '2nd Half';

    // Random Goals with Variety
    let goalAdded = false;
    if (matchStatus === 'live') {
      const goalScenarios = [
        { msg: "GOAL! A powerful header from the corner kick!", type: 'header' },
        { msg: "GOAL! A clinical finish into the bottom corner!", type: 'clinical' },
        { msg: "GOAL! A absolute screamer from 30 yards out!", type: 'screamer' },
        { msg: "GOAL! Penalty converted with absolute composure!", type: 'penalty' },
        { msg: "GOAL! Deflecting off the keeper and tricking inside!", type: 'lucky' },
        { msg: "GOAL! A brilliant solo run ends with a cheeky chip!", type: 'solo' },
      ];

      // Team A Goal
      if (Math.random() > 0.982) {
        scoreA++;
        goalAdded = true;
        const scenario = goalScenarios[Math.floor(Math.random() * goalScenarios.length)];
        addCommentary({ 
          time: `${clockMin}'`, 
          text: `${scenario.msg} ${currentMatch.teamA} take control!`, 
          type: 'goal' 
        });
      } 
      // Team B Goal
      else if (Math.random() > 0.985) {
        scoreB++;
        goalAdded = true;
        const scenario = goalScenarios[Math.floor(Math.random() * goalScenarios.length)];
        addCommentary({ 
          time: `${clockMin}'`, 
          text: `${scenario.msg} ${currentMatch.teamB} level things up!`, 
          type: 'goal' 
        });
      }

      // Random Incidents (Non-Goal)
      if (Math.random() > 0.94 && !goalAdded) {
        const incidents = [
          '⚡ VAR Check: High foot in the box... No penalty awarded.',
          '🧤 What a Save! The keeper tips it over the bar at full stretch!',
          '🟨 Yellow Card: Tactical foul to stop a dangerous counter-attack.',
          '⛳ Corner Kick: The crowd is roaring for a set-piece breakthrough!',
          '🔄 Substitution: Tactical change to shore up the defense.',
          '🏟️ Atmosphere Check: The home fans are making an incredible noise!',
          '🛑 Foul: A rough challenge in the midfield stops the play.',
          '🎯 Woodwork! The shot thumps against the crossbar!',
        ];
        addCommentary({ 
          time: `${clockMin}'`, 
          text: incidents[Math.floor(Math.random() * incidents.length)], 
          type: 'info' 
        });
      }
    }

    setLiveScore({
      teamA: currentMatch.teamA,
      teamB: currentMatch.teamB,
      scoreA,
      scoreB,
      clock: displayClock,
      period
    });

    // Animate Wait Times slightly and update Density
    const newWaitTimes = stadium.initialWaitTimes.map(wt => {
      const minutes = Math.max(2, wt.waitTimeMinutes + Math.floor(Math.random() * 5) - 2);
      let density: WaitTime['density'] = 'Low';
      if (minutes > 30) density = 'Critical';
      else if (minutes > 20) density = 'High';
      else if (minutes > 10) density = 'Medium';
      
      return { ...wt, waitTimeMinutes: minutes, density };
    });
    setWaitTimes(newWaitTimes);

    // Push Match Alerts
    if (goalAdded) {
      addAlert(`🚨 GOAL! ${scoreA} - ${scoreB}. The stadium is erupting!`);
    } else if (Math.random() > 0.97 && matchStatus === 'live') {
      const liveAlerts = [
          "⚠️ High congestion near Gate 1. Use Gate 3 for faster exit.",
          "📢 VAR CHECK: Possible penalty for the home side!",
          "🏟️ Record attendance announced: Full house today!",
          "🍔 Flash Deal: 20% off all beverages for the next 5 minutes!"
      ];
      addAlert(liveAlerts[Math.floor(Math.random() * liveAlerts.length)]);
    }

    // SOS Command Center Simulation
    if (sosActive && sosStatus === 'Dispatching') {
       if (Math.random() > 0.7) {
         setSOSStatus('Dispatched');
         addCommentary({ 
            time: `${clockMin}'`, 
            text: `🔸 [SECURE] ${sosType} responders dispatched to VIP Section 104.`, 
            type: 'system' 
         });
         addAlert(`🚨 Assistance En-route: Our ${sosType} team is moving to your position.`);
       }
    }

    // Dynamic Interval Calculation
    // Goal: 10 mins total. 5 mins Halftime (300s), 5 mins Play (300s total for 90 game mins)
    // Gameplay: 300s / 90 mins = 3.33s (3333ms)
    // Halftime: 300s / 15 mins = 20s (20000ms)
    const isActuallyHalftime = currentMin > 45 && currentMin <= 60;
    const nextInterval = isActuallyHalftime ? 20000 : 3333;
    
    setTimeout(tick, nextInterval);
  };

  // Start the first tick
  setTimeout(tick, 1000);
};
