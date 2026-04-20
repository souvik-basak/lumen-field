import { useEffect } from 'react';
import { collection, query, where, onSnapshot, limit, orderBy, getDocs, doc } from 'firebase/firestore';
import { db } from '../../services/googleIntegrations';
import { useVenueStore } from '../../store/useVenueStore';

/**
 * CloudWatcher Component (Headless).
 * Monitors Firestore for real-time SOS events and syncs them to the Staff UI.
 */
export default function CloudWatcher() {
  const { 
    triggerSOS, 
    cancelSOS, 
    sosActive, 
    setStadiums, 
    activeStadiumId, 
    setLiveScore, 
    setWaitTimes,
    setOrders,
    updateOrderStatus
  } = useVenueStore();

  useEffect(() => {
    // 1. Initial Hydration of Stadiums
    const hydrateStadiums = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'stadiums'));
        const registry: any = {};
        querySnapshot.forEach((doc) => {
          registry[doc.id] = doc.data();
        });
        if (Object.keys(registry).length > 0) {
          setStadiums(registry);
          console.log('[CloudWatcher] Stadium registry hydrated from Cloud');
        }
      } catch (err) {
        console.error('[CloudWatcher] Hydration failed:', err);
      }
    };
    hydrateStadiums();

    // Listen for the most recent active SOS event
    const q = query(
      collection(db, 'sos_events'),
      where('status', '==', 'active'),
      orderBy('timestamp', 'desc'),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      // Use the store's current state to avoid stale closure issues
      const currentSosActive = useVenueStore.getState().sosActive;
      const currentSosId = useVenueStore.getState().activeSosId;

      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        const id = snapshot.docs[0].id;
        
        console.log(`[CloudWatcher] Active SOS detected: ${id}`, data);
        
        // Trigger if not already active or if it's a NEW SOS event
        if (!currentSosActive || currentSosId !== id) {
          triggerSOS(data.type || 'Security', id);
        }
      } else {
        // Only cancel if we were actually tracking an SOS from the cloud
        // and that document has now been resolved/deleted from the 'active' query.
        if (currentSosActive && currentSosId && !currentSosId.startsWith('local-')) {
           console.log('[CloudWatcher] SOS resolved in cloud, clearing local state.');
           cancelSOS();
        }
      }
    }, (error) => {
      console.error('[CloudWatcher] Firestore listener error:', error);
    });

    return () => {
      console.log('[CloudWatcher] Stopping Firestore SOS listener.');
      unsubscribe();
    };
  }, [triggerSOS, cancelSOS, setStadiums]); // Removed sosActive from dependencies

  // 2.5 Food Orders Listener
  useEffect(() => {
    if (!activeStadiumId) return;
    
    console.log(`[CloudWatcher] Listening for Food Orders at ${activeStadiumId}...`);
    const q = query(
      collection(db, 'food_orders'),
      where('stadiumId', '==', activeStadiumId),
      where('status', '!=', 'Delivered'),
      orderBy('status'), // This might require a composite index, using orderBy timestamp instead
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const orders = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as any[];
      setOrders(orders);
      console.log(`[CloudWatcher] Syncing ${orders.length} food orders.`);
    }, (err) => {
        console.warn('[CloudWatcher] Orders listener failed (likely missing index):', err);
    });

    return () => unsub();
  }, [activeStadiumId, setOrders]);

  // 3. Live Match & Wait Time Listener
  useEffect(() => {
    if (!activeStadiumId) return;

    console.log(`[CloudWatcher] Listening for Live Ops at ${activeStadiumId}...`);
    const unsub = onSnapshot(doc(db, 'live_ops', activeStadiumId), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        console.log('[CloudWatcher] Live Ops Update received:', data);
        
        if (data.liveScore) setLiveScore(data.liveScore);
        if (data.waitTimes) setWaitTimes(data.waitTimes);
      }
    });

    return () => unsub();
  }, [activeStadiumId, setLiveScore, setWaitTimes]);

  // 4. Local Multi-Tab Sync Listener (BroadcastChannel)
  useEffect(() => {
    const syncChannel = new BroadcastChannel('venue-sync-channel');
    
    syncChannel.onmessage = (event) => {
      const { type, data } = event.data;
      const currentState = useVenueStore.getState();

      console.log(`[BroadcastChannel] Local sync received: ${type}`, data);

      switch (type) {
        case 'SOS_TRIGGERED':
          if (!currentState.sosActive || currentState.activeSosId !== data.id) {
            triggerSOS(data.type, data.id);
          }
          break;
        case 'SOS_RESOLVED':
          if (currentState.sosActive && currentState.activeSosId === data.id) {
            cancelSOS();
          }
          break;
        case 'ORDER_PLACED':
          if (!currentState.orders.find(o => o.id === data.id)) {
            setOrders([data, ...currentState.orders]);
          }
          break;
        case 'ORDER_UPDATED':
          updateOrderStatus(data.id, data.status);
          break;
      }
    };

    return () => syncChannel.close();
  }, [triggerSOS, cancelSOS, setOrders, updateOrderStatus]);

  // This component doesn't render anything
  return null;
}
