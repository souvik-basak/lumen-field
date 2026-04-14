import { useMemo } from 'react';
import { useVenueStore } from '../store/useVenueStore';
import { 
  Utensils, 
  MapPin, 
  Trophy, 
  Train, 
  ShieldCheck, 
  Zap, 
  Thermometer 
} from 'lucide-react';

export type SuggestionCategory = 'food' | 'navigation' | 'merch' | 'transit' | 'safety' | 'info';

export interface SmartSuggestion {
  id: string;
  title: string;
  text: string;
  category: SuggestionCategory;
  priority: number; // 0-10, 10 being highest
  icon: any;
  accentColor: string;
}

export const useSmartSuggestions = () => {
  const { 
    matchMinute, 
    matchStatus, 
    waitTimes, 
    liveScore, 
    activeStadiumId 
  } = useVenueStore();

  const suggestions = useMemo(() => {
    const list: SmartSuggestion[] = [];

    // 1. CONGESTION ALERTS (Priority 10)
    waitTimes.forEach(wt => {
      if (wt.density === 'Critical' && wt.type === 'exit') {
        list.push({
          id: `congestion-${wt.id}`,
          title: 'High Congestion Detected',
          text: `${wt.name} is currently overloaded. Please use the West Plaza exit for a 15-min faster departure.`,
          category: 'safety',
          priority: 10,
          icon: ShieldCheck,
          accentColor: '#ef4444' // red-500
        });
      }
    });

    // 2. MATCH PHASE LOGIC (Priority 5-8)
    if (matchStatus === 'warmup') {
      list.push({
        id: 'warmup-food',
        title: 'Skip the Halftime Rush',
        text: 'Wait times at food stalls are currently under 5 mins. Grab your snacks now before kick-off!',
        category: 'food',
        priority: 6,
        icon: Utensils,
        accentColor: '#0ea5e9' // sky-500
      });
    }

    if (matchStatus === 'live' && matchMinute > 35 && matchMinute < 45) {
      list.push({
        id: 'pre-halftime-order',
        title: 'Pre-order for Halftime',
        text: 'Halftime is approaching! Pre-order your drinks now via the app to skip the upcoming 20-min queue.',
        category: 'food',
        priority: 8,
        icon: Zap,
        accentColor: '#ec4899' // pink-500
      });
    }

    if (matchStatus === 'halftime') {
      list.push({
        id: 'halftime-merch',
        title: 'Locked in 0-0? Gear Up!',
        text: 'Support the team! Get a 15% discount on scarves at the East Merch Hub during the break.',
        category: 'merch',
        priority: 7,
        icon: Trophy,
        accentColor: '#8b5cf6' // violet-500
      });
    }

    if (matchStatus === 'live' && matchMinute > 85) {
      list.push({
        id: 'post-match-transit',
        title: 'Transit Optimization',
        text: 'Metro trains are running every 3 mins post-match. Suggested route: Exit via South Gate for the nearest station.',
        category: 'transit',
        priority: 9,
        icon: Train,
        accentColor: '#f59e0b' // amber-500
      });
    }

    // 3. GENERAL TIPS (Priority 2-4)
    if (matchStatus === 'live' && matchMinute < 30) {
      list.push({
        id: 'restroom-hack',
        title: 'Quick Pit Stop',
        text: 'Most fans are in their seats. Restrooms in Sec 102 and 108 have 0 wait time right now.',
        category: 'navigation',
        priority: 4,
        icon: MapPin,
        accentColor: '#10b981' // emerald-500
      });
    }

    // Weather / Hydration (Generic)
    list.push({
      id: 'hydration-tip',
      title: 'Fan Comfort',
      text: 'Stamina is key! It is currently 32°C. Stay hydrated to keep the noise going for the full 90 mins.',
      category: 'info',
      priority: 2,
      icon: Thermometer,
      accentColor: '#0ea5e9'
    });

    // 4. SCORE-BASED (Priority 7)
    if (liveScore.scoreA > liveScore.scoreB && matchMinute > 60) {
      list.push({
        id: 'winning-celebration',
        title: 'Winner\'s Special',
        text: 'The home team is leading! Flash your VIP pass for a free team sticker with any purchase.',
        category: 'merch',
        priority: 7,
        icon: Trophy,
        accentColor: '#10b981'
      });
    }

    // Sort by priority and take top 3
    return list.sort((a, b) => b.priority - a.priority).slice(0, 3);
  }, [matchMinute, matchStatus, waitTimes, liveScore, activeStadiumId]);

  return suggestions;
};
