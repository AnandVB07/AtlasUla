import axios from 'axios';
import { Trip, Expense, PackingItem, JournalEntry, UserProfile } from '../types';
import { MOCK_TRIPS, MOCK_WEATHER } from '../utils/mockData';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// ==========================================
// FALLBACK HELPERS (LOCAL STORAGE)
// ==========================================

function getLocalTrips(): Trip[] {
  const data = localStorage.getItem('atlasula_trips');
  return data ? JSON.parse(data) : MOCK_TRIPS;
}

function saveLocalTrips(trips: Trip[]) {
  localStorage.setItem('atlasula_trips', JSON.stringify(trips));
}

function getLocalJournal(): JournalEntry[] {
  const data = localStorage.getItem('atlasula_journal');
  return data ? JSON.parse(data) : [];
}

function saveLocalJournal(journal: JournalEntry[]) {
  localStorage.setItem('atlasula_journal', JSON.stringify(journal));
}

function getLocalProfile(uid = 'demo_user_123'): UserProfile {
  const profilesStr = localStorage.getItem('atlasula_demo_profiles') || '{}';
  const profiles = JSON.parse(profilesStr);
  
  if (profiles[uid]) {
    return profiles[uid];
  }
  
  const defaultProfile: UserProfile = {
    uid,
    email: 'demo@atlasula.ai',
    displayName: 'Guest Explorer',
    photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
    travelLevel: 'Explorer',
    xp: 100,
    streak: 1,
    lastActiveDate: new Date().toISOString().split('T')[0],
    countriesVisited: [],
    citiesVisited: [],
    tripsCompleted: 0,
    achievements: [],
  };
  profiles[uid] = defaultProfile;
  localStorage.setItem('atlasula_demo_profiles', JSON.stringify(profiles));
  return defaultProfile;
}

function saveLocalProfile(profile: UserProfile) {
  const profilesStr = localStorage.getItem('atlasula_demo_profiles') || '{}';
  const profiles = JSON.parse(profilesStr);
  profiles[profile.uid] = profile;
  localStorage.setItem('atlasula_demo_profiles', JSON.stringify(profiles));
}

// ==========================================
// API SERVICES WITH ROBUST FALLBACKS
// ==========================================

export const tripService = {
  getTrips: async (): Promise<Trip[]> => {
    try {
      const res = await client.get('/trips');
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Fetching trips from LocalStorage.');
      return getLocalTrips();
    }
  },

  generateItinerary: async (params: {
    destination: string;
    days: number;
    budgetTier: 'budget' | 'moderate' | 'luxury';
    travelType: string;
    interests: string[];
    travelStyle: string;
  }): Promise<any> => {
    try {
      const res = await client.post('/trips/generate', params);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Running client-side simulation.');
      // Import the dynamic mock planner from frontend code base
      const { generateAITrip } = await import('../gemini');
      return generateAITrip(params);
    }
  },

  saveTrip: async (trip: Trip): Promise<Trip> => {
    try {
      const res = await client.post('/trips', trip);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Saving trip locally.');
      const local = getLocalTrips();
      local.push(trip);
      saveLocalTrips(local);
      return trip;
    }
  },

  deleteTrip: async (id: string): Promise<void> => {
    try {
      await client.delete(`/trips/${id}`);
    } catch (e) {
      console.warn('Backend server offline. Deleting trip locally.');
      const local = getLocalTrips();
      const filtered = local.filter(t => t.id !== id);
      saveLocalTrips(filtered);
    }
  },

  logExpense: async (tripId: string, expense: Expense): Promise<Trip> => {
    try {
      const res = await client.post(`/trips/${tripId}/expenses`, expense);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Logging expense locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].expenses = [expense, ...local[tripIdx].expenses];
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  },

  deleteExpense: async (tripId: string, expId: string): Promise<Trip> => {
    try {
      const res = await client.delete(`/trips/${tripId}/expenses/${expId}`);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Deleting expense locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].expenses = local[tripIdx].expenses.filter(e => e.id !== expId);
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  },

  togglePackingItem: async (tripId: string, itemId: string): Promise<Trip> => {
    try {
      const res = await client.put(`/trips/${tripId}/packing/${itemId}/toggle`);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Toggling packing item locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].packingList = local[tripIdx].packingList.map(item => {
          if (item.id === itemId) return { ...item, packed: !item.packed };
          return item;
        });
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  },

  addPackingItem: async (tripId: string, item: PackingItem): Promise<Trip> => {
    try {
      const res = await client.post(`/trips/${tripId}/packing`, item);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Adding packing item locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].packingList.push(item);
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  },

  deletePackingItem: async (tripId: string, itemId: string): Promise<Trip> => {
    try {
      const res = await client.delete(`/trips/${tripId}/packing/${itemId}`);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Deleting packing item locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].packingList = local[tripIdx].packingList.filter(item => item.id !== itemId);
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  },

  updateBudgetTotal: async (tripId: string, total: number): Promise<Trip> => {
    try {
      const res = await client.put(`/trips/${tripId}/budget`, { total });
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Adjusting budget total locally.');
      const local = getLocalTrips();
      const tripIdx = local.findIndex(t => t.id === tripId);
      if (tripIdx !== -1) {
        local[tripIdx].budget = {
          total,
          Hotel: Math.round(total * 0.45),
          Food: Math.round(total * 0.25),
          Transport: Math.round(total * 0.12),
          Shopping: Math.round(total * 0.08),
          Emergency: Math.round(total * 0.05),
          Entertainment: Math.round(total * 0.05)
        };
        saveLocalTrips(local);
        return local[tripIdx];
      }
      throw new Error('Trip not found');
    }
  }
};

export const journalService = {
  getJournal: async (): Promise<JournalEntry[]> => {
    try {
      const res = await client.get('/journal');
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Fetching journal locally.');
      return getLocalJournal();
    }
  },

  saveEntry: async (entry: JournalEntry): Promise<JournalEntry> => {
    try {
      const res = await client.post('/journal', entry);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Saving journal entry locally.');
      const local = getLocalJournal();
      local.unshift(entry);
      saveLocalJournal(local);
      return entry;
    }
  },

  deleteEntry: async (id: string): Promise<void> => {
    try {
      await client.delete(`/journal/${id}`);
    } catch (e) {
      console.warn('Backend server offline. Deleting journal entry locally.');
      const local = getLocalJournal();
      const filtered = local.filter(e => e.id !== id);
      saveLocalJournal(filtered);
    }
  },

  generateAISummary: async (id: string, details: { title: string; content: string; highlights: string[] }): Promise<string> => {
    try {
      const res = await client.post(`/journal/${id}/summary`, details);
      return res.data.summary;
    } catch (e) {
      console.warn('Backend server offline. Synthesizing summary locally.');
      const { generateJournalSummary } = await import('../gemini');
      return generateJournalSummary(details.title, details.content, details.highlights);
    }
  }
};

export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    try {
      const res = await client.get('/profile');
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Fetching profile locally.');
      return getLocalProfile();
    }
  },

  updateProfile: async (details: { displayName: string; photoURL: string }): Promise<UserProfile> => {
    try {
      const res = await client.put('/profile', details);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Updating profile locally.');
      const local = getLocalProfile();
      local.displayName = details.displayName;
      local.photoURL = details.photoURL;
      saveLocalProfile(local);
      return local;
    }
  },

  gainXP: async (amount: number): Promise<UserProfile> => {
    try {
      const res = await client.post('/profile/xp', { amount });
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Incrementing XP locally.');
      const local = getLocalProfile();
      const LEVEL_XP_REQUIREMENTS = { Explorer: 0, Navigator: 500, Backpacker: 1200, Globetrotter: 2500, Legend: 5000 };
      local.xp += amount;
      if (local.xp >= LEVEL_XP_REQUIREMENTS.Legend) local.travelLevel = 'Legend';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Globetrotter) local.travelLevel = 'Globetrotter';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Backpacker) local.travelLevel = 'Backpacker';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Navigator) local.travelLevel = 'Navigator';
      saveLocalProfile(local);
      return local;
    }
  },

  tickStreak: async (): Promise<UserProfile> => {
    try {
      const res = await client.post('/profile/streak');
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Ticking streak locally.');
      const local = getLocalProfile();
      const today = new Date().toISOString().split('T')[0];
      const lastActive = local.lastActiveDate;
      let newStreak = local.streak;
      if (lastActive) {
        const diffDays = Math.ceil(Math.abs(new Date(today).getTime() - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) newStreak += 1;
        else if (diffDays > 1) newStreak = 1;
      } else {
        newStreak = 1;
      }
      local.streak = newStreak;
      local.lastActiveDate = today;
      saveLocalProfile(local);
      return local;
    }
  },

  unlockAchievement: async (id: string): Promise<UserProfile> => {
    try {
      const res = await client.post(`/profile/achievement/${id}`);
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Unlocking achievement locally.');
      const local = getLocalProfile();
      let unlockedNow = false;
      local.achievements = local.achievements.map(ach => {
        if (ach.id === id && !ach.unlocked) {
          unlockedNow = true;
          return { ...ach, progress: ach.maxProgress, unlocked: true, unlockedAt: new Date().toISOString() };
        }
        return ach;
      });
      if (unlockedNow) {
        local.xp += 200;
        const LEVEL_XP_REQUIREMENTS = { Explorer: 0, Navigator: 500, Backpacker: 1200, Globetrotter: 2500, Legend: 5000 };
        if (local.xp >= LEVEL_XP_REQUIREMENTS.Legend) local.travelLevel = 'Legend';
        else if (local.xp >= LEVEL_XP_REQUIREMENTS.Globetrotter) local.travelLevel = 'Globetrotter';
        else if (local.xp >= LEVEL_XP_REQUIREMENTS.Backpacker) local.travelLevel = 'Backpacker';
        else if (local.xp >= LEVEL_XP_REQUIREMENTS.Navigator) local.travelLevel = 'Navigator';
      }
      saveLocalProfile(local);
      return local;
    }
  },

  completeTrip: async (destination: string): Promise<UserProfile> => {
    try {
      const res = await client.post('/profile/complete-trip', { destination });
      return res.data;
    } catch (e) {
      console.warn('Backend server offline. Logging trip completion locally.');
      const local = getLocalProfile();
      const cities = [...local.citiesVisited];
      const countries = [...local.countriesVisited];
      const parts = destination.split(',').map(s => s.trim());
      const city = parts[0];
      const country = parts[1] || '';
      if (city && !cities.includes(city)) cities.push(city);
      if (country && !countries.includes(country)) countries.push(country);
      local.tripsCompleted += 1;
      local.citiesVisited = cities;
      local.countriesVisited = countries;
      local.xp += 500;
      const LEVEL_XP_REQUIREMENTS = { Explorer: 0, Navigator: 500, Backpacker: 1200, Globetrotter: 2500, Legend: 5000 };
      if (local.xp >= LEVEL_XP_REQUIREMENTS.Legend) local.travelLevel = 'Legend';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Globetrotter) local.travelLevel = 'Globetrotter';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Backpacker) local.travelLevel = 'Backpacker';
      else if (local.xp >= LEVEL_XP_REQUIREMENTS.Navigator) local.travelLevel = 'Navigator';
      saveLocalProfile(local);
      return local;
    }
  }
};

export const chatService = {
  sendMessage: async (message: string, context?: any): Promise<string> => {
    try {
      const res = await client.post('/chat', { message, context });
      return res.data.response;
    } catch (e) {
      console.warn('Backend server offline. Intercepting query locally.');
      const { getAIChatResponse } = await import('../gemini');
      return getAIChatResponse(message, context);
    }
  }
};
