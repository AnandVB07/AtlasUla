export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  travelLevel: string; // "Explorer", "Navigator", "Backpacker", "Globetrotter", "Legend"
  xp: number;
  streak: number;
  lastActiveDate: string | null;
  countriesVisited: string[];
  citiesVisited: string[];
  tripsCompleted: number;
  achievements: UserAchievement[];
}

export interface UserAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
}

export interface Activity {
  title: string;
  description: string;
  cost: number;
  duration: string;
  location?: string;
  category: 'sightseeing' | 'dining' | 'adventure' | 'relaxation' | 'shopping' | 'culture';
}

export interface DayItinerary {
  dayNumber: number;
  date: string;
  title: string;
  morning: Activity;
  afternoon: Activity;
  evening: Activity;
  estimatedCost: number;
  travelTime: string;
  alternativePlan?: string;
}

export interface PackingItem {
  id: string;
  name: string;
  category: 'Essentials' | 'Clothing' | 'Toiletries' | 'Electronics' | 'Activities' | 'Other';
  packed: boolean;
  weatherSensitive?: boolean;
}

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: 'Hotel' | 'Food' | 'Transport' | 'Shopping' | 'Emergency' | 'Entertainment';
  date: string;
  notes?: string;
}

export interface BudgetAllocation {
  total: number;
  Hotel: number;
  Food: number;
  Transport: number;
  Shopping: number;
  Emergency: number;
  Entertainment: number;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  days: number;
  budgetTier: 'budget' | 'moderate' | 'luxury';
  travelType: 'solo' | 'couple' | 'family' | 'friends';
  interests: string[];
  travelStyle: 'adventure' | 'cultural' | 'relaxation' | 'foodie' | 'balanced';
  itinerary: DayItinerary[];
  packingList: PackingItem[];
  expenses: Expense[];
  budget: BudgetAllocation;
  aiTravelTips?: string[];
  safetyScore?: number;
  createdAt: string;
}

export interface Hotel {
  id: string;
  name: string;
  image: string;
  rating: number;
  price: number; // per night
  safetyScore: number;
  distance: string; // from center
  amenities: string[];
  description: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  priceRange: '$' | '$$' | '$$$';
  safetyScore: number;
  distance: string;
  cuisine: string;
  isVegetarian: boolean;
  isVegan: boolean;
  description: string;
  isLocalGem: boolean;
}

export interface JournalEntry {
  id: string;
  tripId: string;
  tripName: string;
  date: string;
  title: string;
  content: string;
  mood: '😊' | '😎' | '😴' | '🤩' | '🤯' | '🧗' | '🍷';
  highlights: string[];
  images: string[];
  aiSummary?: string;
}

export interface WeatherReport {
  city: string;
  temp: number;
  humidity: number;
  windSpeed: number;
  rainProbability: number;
  condition: string;
  description: string;
  icon: string;
  forecast: {
    date: string;
    temp: number;
    condition: string;
    icon: string;
  }[];
}
