export const INITIAL_ACHIEVEMENTS = [
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

export const MOCK_HOTELS = [
  {
    id: 'h1',
    name: 'The Glasshouse Sanctuary',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&auto=format&fit=crop&q=80',
    rating: 4.8,
    price: 180,
    safetyScore: 95,
    distance: '0.8 km from center',
    amenities: ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Bar'],
    description: 'A modern architectural masterpiece featuring glass walls overlooking lush gardens.'
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
    description: 'Chic urban design meets classic comfort. Offers a stunning panoramic view of the skyline.'
  }
];

export const MOCK_RESTAURANTS = [
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
    description: 'A vibrant garden conservatory serving plant-forward organic dishes.',
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
    description: 'Fine open-fire grilled selections utilizing local wood smoke.',
    isLocalGem: true
  }
];

export const MOCK_WEATHER = {
  city: 'Your Destination',
  temp: 22,
  humidity: 60,
  windSpeed: 12,
  rainProbability: 20,
  condition: 'Partly Cloudy',
  description: 'Pleasant weather, perfect for exploring.',
  icon: 'CloudSun',
  forecast: [
    { date: 'Day 1', temp: 22, condition: 'Partly Cloudy', icon: 'CloudSun' },
    { date: 'Day 2', temp: 24, condition: 'Sunny', icon: 'Sun' },
    { date: 'Day 3', temp: 21, condition: 'Light Rain', icon: 'CloudRain' },
    { date: 'Day 4', temp: 20, condition: 'Mostly Cloudy', icon: 'Cloud' },
    { date: 'Day 5', temp: 23, condition: 'Sunny', icon: 'Sun' }
  ]
};

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
        alternativePlan: 'If it rains, do the cruise in the evening and visit the covered passages.'
      },
      {
        dayNumber: 2,
        title: 'Art & Royal History',
        morning: {
          title: 'Louvre Museum Guided Tour',
          description: 'Fast-track entry to view Mona Lisa and other ancient treasures.',
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
          description: 'Explore contemporary art galleries, designer shops, and eat falafel.',
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
      { name: 'Anti-theft Daypack', category: 'Essentials', weatherSensitive: false }
    ],
    budgetDistribution: {
      Hotel: 0.45,
      Food: 0.25,
      Transport: 0.12,
      Shopping: 0.08,
      Emergency: 0.05,
      Entertainment: 0.05
    }
  },
  tokyo: {
    destination: 'Tokyo, Japan',
    safetyScore: 99,
    aiTravelTips: [
      'Tokyo is a cash-friendly city. Keep Japanese Yen cash on hand at all times.',
      'Purchase a digital Suica or Pasmo card on your phone for seamless train travel.'
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
      }
    ],
    packingSuggestions: [
      { name: 'Suica/Pasmo app pre-loaded', category: 'Essentials', weatherSensitive: false },
      { name: 'Easy Slip-on Shoes', category: 'Clothing', weatherSensitive: false },
      { name: 'Pocket Wi-Fi / eSIM', category: 'Electronics', weatherSensitive: false }
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
