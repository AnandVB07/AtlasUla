import { Request, Response } from 'express';
import { readProfile, writeProfile } from '../config/db';

const LEVEL_XP_REQUIREMENTS = {
  Explorer: 0,
  Navigator: 500,
  Backpacker: 1200,
  Globetrotter: 2500,
  Legend: 5000
};

export const getProfile = (req: Request, res: Response) => {
  const profile = readProfile();
  res.json(profile);
};

export const updateProfileDetails = (req: Request, res: Response) => {
  const { displayName, photoURL } = req.body;
  const profile = readProfile();
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  if (displayName) profile.displayName = displayName;
  if (photoURL) profile.photoURL = photoURL;

  writeProfile(profile);
  res.json(profile);
};

export const gainXP = (req: Request, res: Response) => {
  const { amount } = req.body;
  if (!amount || isNaN(Number(amount))) {
    return res.status(400).json({ error: 'Invalid XP amount.' });
  }

  const profile = readProfile();
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  const numXP = Number(amount);
  const newXP = profile.xp + numXP;
  let newLevel = profile.travelLevel;

  // Check thresholds
  if (newXP >= LEVEL_XP_REQUIREMENTS.Legend) {
    newLevel = 'Legend';
  } else if (newXP >= LEVEL_XP_REQUIREMENTS.Globetrotter) {
    newLevel = 'Globetrotter';
  } else if (newXP >= LEVEL_XP_REQUIREMENTS.Backpacker) {
    newLevel = 'Backpacker';
  } else if (newXP >= LEVEL_XP_REQUIREMENTS.Navigator) {
    newLevel = 'Navigator';
  }

  profile.xp = newXP;
  profile.travelLevel = newLevel;

  writeProfile(profile);
  res.json(profile);
};

export const unlockAchievement = (req: Request, res: Response) => {
  const { id } = req.params;
  const profile = readProfile();
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  let unlockedNow = false;
  profile.achievements = profile.achievements.map((ach: any) => {
    if (ach.id === id && !ach.unlocked) {
      unlockedNow = true;
      return {
        ...ach,
        progress: ach.maxProgress,
        unlocked: true,
        unlockedAt: new Date().toISOString()
      };
    }
    return ach;
  });

  if (unlockedNow) {
    // Award 200 bonus XP for achievement unlock
    profile.xp += 200;
    
    // Check level up threshold
    let newLevel = profile.travelLevel;
    if (profile.xp >= LEVEL_XP_REQUIREMENTS.Legend) {
      newLevel = 'Legend';
    } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Globetrotter) {
      newLevel = 'Globetrotter';
    } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Backpacker) {
      newLevel = 'Backpacker';
    } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Navigator) {
      newLevel = 'Navigator';
    }
    profile.travelLevel = newLevel;
  }

  writeProfile(profile);
  res.json(profile);
};

export const tickStreak = (req: Request, res: Response) => {
  const profile = readProfile();
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  const today = new Date().toISOString().split('T')[0];
  const lastActive = profile.lastActiveDate;
  let newStreak = profile.streak;

  if (lastActive) {
    const lastDate = new Date(lastActive);
    const currentDate = new Date(today);
    const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      newStreak += 1;
    } else if (diffDays > 1) {
      newStreak = 1;
    }
  } else {
    newStreak = 1;
  }

  profile.streak = newStreak;
  profile.lastActiveDate = today;

  writeProfile(profile);
  res.json(profile);
};

export const completeTrip = (req: Request, res: Response) => {
  const { destination } = req.body;
  const profile = readProfile();
  if (!profile) return res.status(404).json({ error: 'Profile not found.' });

  const cities = [...profile.citiesVisited];
  const countries = [...profile.countriesVisited];

  const parts = destination.split(',').map((s: string) => s.trim());
  const city = parts[0];
  const country = parts[1] || '';

  if (city && !cities.includes(city)) {
    cities.push(city);
  }
  if (country && !countries.includes(country)) {
    countries.push(country);
  }

  profile.tripsCompleted += 1;
  profile.citiesVisited = cities;
  profile.countriesVisited = countries;
  profile.xp += 500; // 500 XP for completing a trip!

  // Check level up threshold
  let newLevel = profile.travelLevel;
  if (profile.xp >= LEVEL_XP_REQUIREMENTS.Legend) {
    newLevel = 'Legend';
  } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Globetrotter) {
    newLevel = 'Globetrotter';
  } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Backpacker) {
    newLevel = 'Backpacker';
  } else if (profile.xp >= LEVEL_XP_REQUIREMENTS.Navigator) {
    newLevel = 'Navigator';
  }
  profile.travelLevel = newLevel;

  writeProfile(profile);
  res.json(profile);
};
