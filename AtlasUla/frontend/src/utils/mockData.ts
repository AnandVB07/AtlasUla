import { Hotel, Restaurant, UserAchievement, JournalEntry, Trip, WeatherReport } from '../types';

export const MOCK_ACHIEVEMENTS: UserAchievement[] = [
  {
    id: 'first_trip',
    title: 'First Trip',
    description: 'Create your first travel itinerary',
    icon: 'Compass',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'budget_master',
    title: 'Budget Master',
    description: 'Keep your expenses under budget on a trip',
    icon: 'DollarSign',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'packing_pro',
    title: 'Packing Pro',
    description: 'Pack all items on your checklist',
    icon: 'Briefcase',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'food_explorer',
    title: 'Food Explorer',
    description: 'Log 3 dining experiences in your journal',
    icon: 'Utensils',
    unlockedAt: null,
    progress: 0,
    maxProgress: 3,
    unlocked: false,
  },
  {
    id: 'adventure_seeker',
    title: 'Adventure Seeker',
    description: 'Create an itinerary with adventure focus',
    icon: 'Zap',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'solo_traveler',
    title: 'Solo Traveler',
    description: 'Plan a solo trip',
    icon: 'User',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'weekend_warrior',
    title: 'Weekend Warrior',
    description: 'Plan a short trip of 3 days or less',
    icon: 'Calendar',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
    unlocked: false,
  },
  {
    id: 'streak_explorer',
    title: 'Streak Explorer',
    description: 'Log in 5 days in a row',
    icon: 'Flame',
    unlockedAt: null,
    progress: 1,
    maxProgress: 5,
    unlocked: false,
  }
];

export const MOCK_HOTELS: Record<string, Hotel[]> = {
  default: [
    {
      id: 'h1',
      name: 'The Glasshouse Sanctuary',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      price: 180,
      safetyScore: 95,
      distance: '0.8 km from center',
      amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Bar'],
      description: 'A modern architectural masterpiece featuring glass walls overlooking lush gardens. Features an infinity pool and curated wellness spa.'
    },
    {
      id: 'h2',
      name: 'Vanguard Boutique Hotel',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&auto=format&fit=crop&q=80',
      rating: 4.6,
      price: 120,
      safetyScore: 88,
      distance: '1.5 km from center',
      amenities: ['Free WiFi', 'Breakfast Included', 'Pet Friendly', 'Roof Bar'],
      description: 'Chic urban design meets classic comfort. Offers a stunning panoramic view of the skyline from its award-winning rooftop terrace.'
    },
    {
      id: 'h3',
      name: 'Minimalist Loft Stays',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&auto=format&fit=crop&q=80',
      rating: 4.2,
      price: 75,
      safetyScore: 90,
      distance: '2.4 km from center',
      amenities: ['Kitchenette', 'Free WiFi', 'Self Check-in', 'Workspace'],
      description: 'Sleek, industrial-style lofts optimized for digital nomads. Features high-speed fiber internet, modular desks, and custom local coffee.'
    }
  ],
  paris: [
    {
      id: 'hp1',
      name: 'Le Grand Lumière',
      image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      price: 320,
      safetyScore: 98,
      distance: '0.4 km from Eiffel Tower',
      amenities: ['Eiffel View', 'Michelin Dining', 'Butler Service', 'Spa'],
      description: 'Exquisite Parisian luxury overlooking the Eiffel Tower. Features museum-grade art collections and marble-clad suites.'
    },
    {
      id: 'hp2',
      name: 'Hôtel Marais Art Deco',
      image: 'https://images.unsplash.com/photo-1549294413-26f195afcbce?w=600&auto=format&fit=crop&q=80',
      rating: 4.5,
      price: 165,
      safetyScore: 92,
      distance: '0.2 km from Place des Vosges',
      amenities: ['Free WiFi', 'Bicycle Rental', 'Courtyard Garden', 'Library'],
      description: 'A stylish artistic retreat in the historic Marais district, capturing the classic 1920s Art Deco ambiance.'
    }
  ],
  tokyo: [
    {
      id: 'ht1',
      name: 'Shinjuku Neon Horizon',
      image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      price: 210,
      safetyScore: 99,
      distance: '0.3 km from Shinjuku Station',
      amenities: ['High-tech Room Controls', 'Skyline View', 'Onsen Baths', 'Gym'],
      description: 'Futuristic suites with floor-to-ceiling glass paneling overlooking Tokyo’s vibrant skyline. Includes a traditional sky-onsen.'
    },
    {
      id: 'ht2',
      name: 'Ryokan Koto-an',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      price: 290,
      safetyScore: 99,
      distance: '3.1 km from center (Asakusa)',
      amenities: ['Traditional Kaiseki Dinner', 'Private Onsen', 'Tatami Mats', 'Zen Garden'],
      description: 'An authentic traditional inn nestled in historic Asakusa. Offers futon bedding, private hot-spring tubs, and fine seasonal dining.'
    }
  ]
};

export const MOCK_RESTAURANTS: Record<string, Restaurant[]> = {
  default: [
    {
      id: 'r1',
      name: 'The Botanical Kitchen',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&auto=format&fit=crop&q=80',
      rating: 4.7,
      priceRange: '$$',
      safetyScore: 94,
      distance: '0.5 km',
      cuisine: 'Organic / Farm-to-Table',
      isVegetarian: true,
      isVegan: true,
      description: 'A vibrant garden conservatory serving plant-forward organic dishes, bio-dynamic mocktails, and fresh sourdough.',
      isLocalGem: false
    },
    {
      id: 'r2',
      name: 'Obsidian grill & Smoke',
      image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&auto=format&fit=crop&q=80',
      rating: 4.5,
      priceRange: '$$$',
      safetyScore: 91,
      distance: '1.2 km',
      cuisine: 'Modern Steakhouse / Smoked',
      isVegetarian: false,
      isVegan: false,
      description: 'Fine open-fire grilled selections utilizing local wood smoke and volcanic stone platters. Sleek, industrial dark interior.',
      isLocalGem: true
    },
    {
      id: 'r3',
      name: 'The Noodle Alley',
      image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&auto=format&fit=crop&q=80',
      rating: 4.3,
      priceRange: '$',
      safetyScore: 89,
      distance: '2.0 km',
      cuisine: 'Asian Street Noodles',
      isVegetarian: true,
      isVegan: false,
      description: 'A tiny, neon-lit alley stall serving rich homemade broths, hand-pulled noodles, and legendary pan-fried gyoza.',
      isLocalGem: true
    }
  ],
  paris: [
    {
      id: 'rp1',
      name: 'Chez André Coquelicot',
      image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=600&auto=format&fit=crop&q=80',
      rating: 4.8,
      priceRange: '$$',
      safetyScore: 95,
      distance: '0.8 km',
      cuisine: 'Classic French Bistro',
      isVegetarian: true,
      isVegan: false,
      description: 'A beloved family bistro in Montmartre, famous for its coq au vin, French onion soup, and buttery tarte tatin.',
      isLocalGem: true
    }
  ],
  tokyo: [
    {
      id: 'rt1',
      name: 'Tsukiji Omakase Shima',
      image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&auto=format&fit=crop&q=80',
      rating: 4.9,
      priceRange: '$$$',
      safetyScore: 98,
      distance: '1.5 km',
      cuisine: 'Premium Sushi Omakase',
      isVegetarian: false,
      isVegan: false,
      description: 'A 10-seat sushi counter run by a master chef with daily selections sourced straight from Toyosu Market.',
      isLocalGem: true
    }
  ]
};

export const MOCK_WEATHER: Record<string, WeatherReport> = {
  default: {
    city: 'Your Destination',
    temp: 22,
    humidity: 60,
    windSpeed: 12,
    rainProbability: 20,
    condition: 'Partly Cloudy',
    description: 'Pleasant weather, perfect for exploring the city.',
    icon: 'CloudSun',
    forecast: [
      { date: 'Day 1', temp: 22, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { date: 'Day 2', temp: 24, condition: 'Sunny', icon: 'Sun' },
      { date: 'Day 3', temp: 21, condition: 'Light Rain', icon: 'CloudRain' },
      { date: 'Day 4', temp: 20, condition: 'Mostly Cloudy', icon: 'Cloud' },
      { date: 'Day 5', temp: 23, condition: 'Sunny', icon: 'Sun' }
    ]
  },
  paris: {
    city: 'Paris',
    temp: 19,
    humidity: 75,
    windSpeed: 15,
    rainProbability: 40,
    condition: 'Light Showers',
    description: 'Chilly morning drizzle clearing up by afternoon. Carry an umbrella.',
    icon: 'CloudRain',
    forecast: [
      { date: 'Today', temp: 19, condition: 'Light Rain', icon: 'CloudRain' },
      { date: 'Tomorrow', temp: 21, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { date: 'Day 3', temp: 23, condition: 'Sunny', icon: 'Sun' },
      { date: 'Day 4', temp: 20, condition: 'Cloudy', icon: 'Cloud' },
      { date: 'Day 5', temp: 18, condition: 'Showers', icon: 'CloudRain' }
    ]
  },
  tokyo: {
    city: 'Tokyo',
    temp: 26,
    humidity: 80,
    windSpeed: 8,
    rainProbability: 10,
    condition: 'Sunny',
    description: 'Warm and sunny day. High UV index, sunscreen recommended.',
    icon: 'Sun',
    forecast: [
      { date: 'Today', temp: 26, condition: 'Sunny', icon: 'Sun' },
      { date: 'Tomorrow', temp: 27, condition: 'Clear', icon: 'Sun' },
      { date: 'Day 3', temp: 25, condition: 'Partly Cloudy', icon: 'CloudSun' },
      { date: 'Day 4', temp: 24, condition: 'Overcast', icon: 'Cloud' },
      { date: 'Day 5', temp: 22, condition: 'Rain', icon: 'CloudRain' }
    ]
  }
};

export const MOCK_JOURNAL_ENTRIES: JournalEntry[] = [
  {
    id: 'j1',
    tripId: 't1',
    tripName: 'Summer getaway in Paris',
    date: '2026-06-15',
    title: 'Sunset over the Seine',
    content: 'We rented bicycles and rode through the Latin Quarter before catching the sunset near Pont Neuf. We had fresh pastries from a bakery recommended by AtlasUla\'s AI assistant. The macarons were out of this world! Later, we watched the Eiffel Tower light show. A perfect day.',
    mood: '🤩',
    highlights: ['Biking the Latin Quarter', 'Pont Neuf Sunset', 'Eiffel Tower lights'],
    images: ['https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80'],
    aiSummary: 'A romantic day of cycling, river sunset views, and local culinary discoveries in Paris.'
  },
  {
    id: 'j2',
    tripId: 't1',
    tripName: 'Summer getaway in Paris',
    date: '2026-06-16',
    title: 'Rainy afternoon in the Louvre',
    content: 'It started pouring rain early in the morning. Luckily, AtlasUla\'s smart weather notifications suggested we shift our museum day to today. We spent hours lost inside the Louvre. The Winged Victory is much more impressive in person than the Mona Lisa. Finished the night with red wine and duck confit at a hidden gem bistro in Marais.',
    mood: '🍷',
    highlights: ['Louvre Exploration', 'Winged Victory', 'Bistro dining in Marais'],
    images: ['https://images.unsplash.com/photo-1549294413-26f195afcbce?w=600&auto=format&fit=crop&q=80'],
    aiSummary: 'Weather-optimized museum visit followed by traditional bistro dining.'
  }
];

export const MOCK_TRIPS: Trip[] = [
  {
    id: 't1',
    destination: 'Paris',
    startDate: '2026-06-14',
    endDate: '2026-06-18',
    days: 4,
    budgetTier: 'moderate',
    travelType: 'couple',
    interests: ['History', 'Food', 'Art', 'Shopping'],
    travelStyle: 'cultural',
    itinerary: [
      {
        dayNumber: 1,
        date: '2026-06-14',
        title: 'Iconic Landmarks',
        morning: {
          title: 'Eiffel Tower Climb',
          description: 'Take the stairs or elevator to the second floor for panoramic city views.',
          cost: 30,
          duration: '3 hours',
          location: 'Champ de Mars',
          category: 'sightseeing'
        },
        afternoon: {
          title: 'Lunch & Seine Cruise',
          description: 'Quick lunch followed by a relaxing boat tour on the Seine river.',
          cost: 25,
          duration: '2 hours',
          location: 'Seine Riverbanks',
          category: 'relaxation'
        },
        evening: {
          title: 'Dinner at Le Marais',
          description: 'Cozy traditional French dinner in the historic Marais district.',
          cost: 50,
          duration: '3 hours',
          location: 'Le Marais',
          category: 'dining'
        },
        estimatedCost: 105,
        travelTime: '45 mins total transit'
      },
      {
        dayNumber: 2,
        date: '2026-06-15',
        title: 'Masterpieces & Scenery',
        morning: {
          title: 'Louvre Museum Tour',
          description: 'Guided tour of historical art masterpieces including the Mona Lisa.',
          cost: 22,
          duration: '4 hours',
          location: 'Louvre Palace',
          category: 'culture'
        },
        afternoon: {
          title: 'Tuileries Garden Walk',
          description: 'Stroll through the gardens, enjoy coffee, and sit by the fountains.',
          cost: 5,
          duration: '1.5 hours',
          location: 'Jardin des Tuileries',
          category: 'relaxation'
        },
        evening: {
          title: 'Montmartre Sunset',
          description: 'Walk up to Sacré-Cœur for panoramic views of Paris at dusk.',
          cost: 35,
          duration: '3.5 hours',
          location: 'Montmartre',
          category: 'sightseeing'
        },
        estimatedCost: 62,
        travelTime: '1 hr transit'
      }
    ],
    packingList: [
      { id: 'p1', name: 'Passport & Travel Documents', category: 'Essentials', packed: true },
      { id: 'p2', name: 'European Power Adapter', category: 'Electronics', packed: true },
      { id: 'p3', name: 'Comfortable Walking Shoes', category: 'Clothing', packed: true },
      { id: 'p4', name: 'Umbrella / Light Trench', category: 'Clothing', packed: false, weatherSensitive: true },
      { id: 'p5', name: 'Camera', category: 'Electronics', packed: false },
      { id: 'p6', name: 'Toiletries & Skincare', category: 'Toiletries', packed: true }
    ],
    expenses: [
      { id: 'e1', title: 'Hôtel Marais (4 nights)', amount: 660, category: 'Hotel', date: '2026-06-14' },
      { id: 'e2', title: 'Louvre tickets', amount: 44, category: 'Entertainment', date: '2026-06-15' },
      { id: 'e3', title: 'Seine Dinner Cruise', amount: 100, category: 'Food', date: '2026-06-14' },
      { id: 'e4', title: 'Metro Passes', amount: 35, category: 'Transport', date: '2026-06-14' }
    ],
    budget: {
      total: 1200,
      Hotel: 600,
      Food: 300,
      Transport: 100,
      Shopping: 100,
      Emergency: 50,
      Entertainment: 50
    },
    aiTravelTips: [
      'Validate your metro ticket before boarding. Plainclothes officers issue heavy fines.',
      'Water at restaurants (carafe d\'eau) is free. Ask for it explicitly to save money.',
      'Purchase tickets for popular museums (Louvre, Orsay) online weeks in advance.'
    ],
    safetyScore: 92,
    createdAt: '2026-06-10'
  }
];

export const MOCK_ITINERARY_TEMPLATES: Record<string, any> = {
  paris: {
    destination: 'Paris, France',
    safetyScore: 91,
    aiTravelTips: [
      'Watch out for pickpockets near the Eiffel Tower and Sacré-Cœur.',
      'Install the Bonjour RATP app for easy Paris Metro navigation.',
      'French dinner usually starts around 8 PM. Book reservations in advance.'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Iconic Paris Landmarks',
        morning: {
          title: 'Eiffel Tower Summit Climb',
          description: 'Climb the stairs or take the elevator for jaw-dropping views of Paris.',
          cost: 32,
          duration: '3 hours',
          category: 'sightseeing'
        },
        afternoon: {
          title: 'Seine River Cruise & Crepes',
          description: 'Glide past Paris monuments on a 1-hour cruise, then eat hot street crepes.',
          cost: 20,
          duration: '2.5 hours',
          category: 'relaxation'
        },
        evening: {
          title: 'Dinner & Stroll in Montmartre',
          description: 'Climb the steps of Sacré-Cœur for sunset, then dine at a historic bistro.',
          cost: 45,
          duration: '3 hours',
          category: 'dining'
        },
        estimatedCost: 97,
        travelTime: '1 hr transit',
        alternativePlan: 'If it rains, do the cruise in the evening and visit the covered passages (Passages Couverts) in the afternoon.'
      },
      {
        dayNumber: 2,
        title: 'Art & Royal History',
        morning: {
          title: 'Louvre Museum Guided Tour',
          description: 'Fast-track entry to view Mona Lisa, Winged Victory, and other ancient treasures.',
          cost: 25,
          duration: '4 hours',
          category: 'culture'
        },
        afternoon: {
          title: 'Tuileries Gardens & Café Gourmand',
          description: 'Stroll through classical French gardens and enjoy espresso with mini desserts.',
          cost: 15,
          duration: '2 hours',
          category: 'relaxation'
        },
        evening: {
          title: 'Marais District Gallery Hop',
          description: 'Explore contemporary art galleries, designer shops, and eat Parisian falafel.',
          cost: 25,
          duration: '3 hours',
          category: 'shopping'
        },
        estimatedCost: 65,
        travelTime: '45 mins transit',
        alternativePlan: 'Swap the Louvre for Musee d\'Orsay if you prefer Impressionist art.'
      }
    ],
    packingSuggestions: [
      { name: 'Universal Adapter', category: 'Electronics', weatherSensitive: false },
      { name: 'Stylish Walking Sneakers', category: 'Clothing', weatherSensitive: false },
      { name: 'Light Rain Jacket', category: 'Clothing', weatherSensitive: true },
      { name: 'Anti-theft Daypack', category: 'Essentials', weatherSensitive: false },
      { name: 'Comfortable Scarf', category: 'Clothing', weatherSensitive: true }
    ],
    budgetDistribution: {
      Hotel: 0.50,
      Food: 0.25,
      Transport: 0.10,
      Shopping: 0.08,
      Emergency: 0.05,
      Entertainment: 0.02
    }
  },
  tokyo: {
    destination: 'Tokyo, Japan',
    safetyScore: 99,
    aiTravelTips: [
      'Tokyo is a cash-friendly city. Keep Japanese Yen cash on hand at all times.',
      'Purchase a digital Suica or Pasmo card on your phone for seamless train travel.',
      'Eating while walking is considered impolite. Eat at the store front or bench.'
    ],
    itinerary: [
      {
        dayNumber: 1,
        title: 'Tech & Youth Culture',
        morning: {
          title: 'Shibuya Crossing & Hachiko Statue',
          description: 'Cross the busiest intersection in the world and view the loyal dog statue.',
          cost: 5,
          duration: '2 hours',
          category: 'sightseeing'
        },
        afternoon: {
          title: 'Harajuku Takeshita Street Exploration',
          description: 'Experience colorful street food, crazy fashion shops, and giant cotton candy.',
          cost: 20,
          duration: '3 hours',
          category: 'shopping'
        },
        evening: {
          title: 'Shinjuku Omoide Yokocho Skewers',
          description: 'Eat Yakitori in narrow historic alleys filled with lanterns and charcoal smoke.',
          cost: 35,
          duration: '3 hours',
          category: 'dining'
        },
        estimatedCost: 60,
        travelTime: '30 mins transit',
        alternativePlan: 'If Shinjuku is too crowded, head to Golden Gai for a cozy bar crawl instead.'
      },
      {
        dayNumber: 2,
        title: 'Historic Temples & Tech',
        morning: {
          title: 'Senso-ji Temple (Asakusa)',
          description: 'Walk through the majestic Kaminarimon Gate and shop traditional snacks on Nakamise.',
          cost: 10,
          duration: '3 hours',
          category: 'culture'
        },
        afternoon: {
          title: 'Akihabara Electric Town',
          description: 'Browse massive electronics complexes, retro gaming stores, and anime shops.',
          cost: 15,
          duration: '3 hours',
          category: 'shopping'
        },
        evening: {
          title: 'Ramen Street & Tokyo Station',
          description: 'Slurp rich Tonkotsu ramen inside Tokyo Station\'s famous dining basement.',
          cost: 18,
          duration: '2 hours',
          category: 'dining'
        },
        estimatedCost: 43,
        travelTime: '1 hr transit',
        alternativePlan: 'Skip Akihabara and go to TeamLab Planets for digital artwork installation.'
      }
    ],
    packingSuggestions: [
      { name: 'Suica/Pasmo app pre-loaded', category: 'Essentials', weatherSensitive: false },
      { name: 'Easy Slip-on Shoes', category: 'Clothing', weatherSensitive: false },
      { name: 'Hand Towel (some restrooms lack paper)', category: 'Toiletries', weatherSensitive: false },
      { name: 'Pocket Wi-Fi / eSIM', category: 'Electronics', weatherSensitive: false },
      { name: 'Deodorant wipes (Japan summers are humid)', category: 'Toiletries', weatherSensitive: true }
    ],
    budgetDistribution: {
      Hotel: 0.45,
      Food: 0.30,
      Transport: 0.12,
      Shopping: 0.08,
      Emergency: 0.03,
      Entertainment: 0.02
    }
  }
};
