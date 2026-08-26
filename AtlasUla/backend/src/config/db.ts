import fs from 'fs';
import path from 'path';
import { INITIAL_ACHIEVEMENTS } from '../utils/mockData';

const DATA_DIR = path.resolve(__dirname, '../../data');
const TRIPS_FILE = path.join(DATA_DIR, 'trips.json');
const JOURNAL_FILE = path.join(DATA_DIR, 'journal.json');
const PROFILE_FILE = path.join(DATA_DIR, 'profile.json');

// Ensure data directory exists
function ensureDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function readTrips(): any[] {
  ensureDir();
  if (!fs.existsSync(TRIPS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(TRIPS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read trips database, returning empty list:', error);
    return [];
  }
}

export function writeTrips(trips: any[]): void {
  ensureDir();
  try {
    fs.writeFileSync(TRIPS_FILE, JSON.stringify(trips, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to trips database:', error);
  }
}

export function readJournal(): any[] {
  ensureDir();
  if (!fs.existsSync(JOURNAL_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(JOURNAL_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read journal database, returning empty list:', error);
    return [];
  }
}

export function writeJournal(journal: any[]): void {
  ensureDir();
  try {
    fs.writeFileSync(JOURNAL_FILE, JSON.stringify(journal, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to journal database:', error);
  }
}

export function readProfile(): any {
  ensureDir();
  if (!fs.existsSync(PROFILE_FILE)) {
    // Generate initial profile
    const initialProfile = {
      uid: 'demo_user_123',
      email: 'demo@atlasula.ai',
      displayName: 'Guest Explorer',
      photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=demo_user_123`,
      travelLevel: 'Explorer',
      xp: 100,
      streak: 1,
      lastActiveDate: new Date().toISOString().split('T')[0],
      countriesVisited: [],
      citiesVisited: [],
      tripsCompleted: 0,
      achievements: INITIAL_ACHIEVEMENTS,
    };
    writeProfile(initialProfile);
    return initialProfile;
  }
  try {
    const data = fs.readFileSync(PROFILE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to read profile database:', error);
    return null;
  }
}

export function writeProfile(profile: any): void {
  ensureDir();
  try {
    fs.writeFileSync(PROFILE_FILE, JSON.stringify(profile, null, 2), 'utf-8');
  } catch (error) {
    console.error('Failed to write to profile database:', error);
  }
}
