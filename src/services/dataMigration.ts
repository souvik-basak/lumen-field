import { collection, doc, writeBatch, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './googleIntegrations';
import { STADIUM_REGISTRY } from './mockVenueData';

/**
 * Data Migration Service.
 * Seeds the live Firestore database with the massive venue JSON data.
 */

export const seedStadiumsToCloud = async () => {
  try {
    console.log('[Migration] Starting stadium data seed...');
    const batch = writeBatch(db);

    Object.entries(STADIUM_REGISTRY).forEach(([id, data]) => {
      const stadiumRef = doc(db, 'stadiums', id);
      batch.set(stadiumRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    });

    await batch.commit();
    console.log('[Migration] Stadiums collection seeded successfully.');
    return true;
  } catch (error) {
    console.error('[Migration] Failed to seed stadiums:', error);
    throw error;
  }
};

let isSyncDisabled = false;

export const syncMatchStateToCloud = async (stadiumId: string, state: any) => {
  if (isSyncDisabled) return;

  try {
    const matchRef = doc(db, 'live_ops', stadiumId);
    await setDoc(matchRef, {
      ...state,
      lastUpdate: serverTimestamp(),
    }, { merge: true });
  } catch (error: any) {
    // Detect Quota Exceeded (Resource Exhausted)
    if (error.code === 'resource-exhausted' || error.message?.includes('Quota')) {
      console.warn('[Migration] Firestore Quota Exceeded. Disabling further cloud syncs for this session.');
      isSyncDisabled = true;
    } else {
      console.error('[Migration] Failed to sync match state:', error);
    }
  }
};
