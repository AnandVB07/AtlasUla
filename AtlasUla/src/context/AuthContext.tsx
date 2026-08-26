import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup, 
  sendPasswordResetEmail,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isConfigured } from '../firebase';
import { UserProfile, UserAchievement, Trip } from '../types';
import { MOCK_ACHIEVEMENTS } from '../utils/mockData';
import confetti from 'canvas-confetti';
import { toast } from 'react-hot-toast';

interface AuthContextType {
  user: User | { email: string; displayName: string; photoURL: string; uid: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  isDemo: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  gainXP: (amount: number) => Promise<void>;
  unlockAchievement: (id: string) => Promise<void>;
  updateStreak: () => Promise<void>;
  completeTripState: (trip: Trip) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LEVEL_XP_REQUIREMENTS = {
  Explorer: 0,      // Level 1: 0 - 499
  Navigator: 500,   // Level 2: 500 - 1199
  Backpacker: 1200, // Level 3: 1200 - 2499
  Globetrotter: 2500, // Level 4: 2500 - 4999
  Legend: 5000      // Level 5: 5000+
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isConfigured);

  // Initialize demo or live user session
  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setIsDemo(false);
          await loadUserProfile(currentUser.uid, currentUser.email, currentUser.displayName);
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });
      return unsubscribe;
    } else {
      // Demo authentication tracking
      const demoUserStr = localStorage.getItem('atlasula_demo_user');
      if (demoUserStr) {
        const demoUser = JSON.parse(demoUserStr);
        setUser(demoUser);
        loadDemoProfile(demoUser.uid);
      } else {
        setLoading(false);
      }
    }
  }, []);

  // LOAD PROFILE (Firebase Firestore)
  const loadUserProfile = async (uid: string, email: string | null, displayName: string | null) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setProfile(docSnap.data() as UserProfile);
      } else {
        // Create initial profile
        const newProfile: UserProfile = {
          uid,
          email,
          displayName: displayName || 'Traveler',
          photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`,
          travelLevel: 'Explorer',
          xp: 100, // start with 100 XP
          streak: 1,
          lastActiveDate: new Date().toISOString().split('T')[0],
          countriesVisited: [],
          citiesVisited: [],
          tripsCompleted: 0,
          achievements: MOCK_ACHIEVEMENTS,
        };
        await setDoc(docRef, newProfile);
        setProfile(newProfile);
      }
    } catch (e) {
      console.error('Error loading Firestore user profile:', e);
      toast.error('Failed to sync profile with database.');
    } finally {
      setLoading(false);
    }
  };

  // LOAD PROFILE (Demo LocalStorage)
  const loadDemoProfile = (uid: string) => {
    const profiles = localStorage.getItem('atlasula_demo_profiles');
    let profileData: UserProfile | null = null;

    if (profiles) {
      const parsedProfiles = JSON.parse(profiles);
      profileData = parsedProfiles[uid] || null;
    }

    if (profileData) {
      setProfile(profileData);
    } else {
      const newProfile: UserProfile = {
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
        achievements: MOCK_ACHIEVEMENTS,
      };
      saveDemoProfile(uid, newProfile);
      setProfile(newProfile);
    }
    setLoading(false);
  };

  const saveDemoProfile = (uid: string, data: UserProfile) => {
    const profilesStr = localStorage.getItem('atlasula_demo_profiles') || '{}';
    const profiles = JSON.parse(profilesStr);
    profiles[uid] = data;
    localStorage.setItem('atlasula_demo_profiles', JSON.stringify(profiles));
  };

  // LOGIN ACTIONS
  const login = async (email: string, password: string) => {
    if (isDemo) {
      // Mock log in
      const mockUser = {
        uid: 'demo_user_123',
        email,
        displayName: 'Guest Explorer',
        photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=demo_user_123'
      };
      localStorage.setItem('atlasula_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      loadDemoProfile(mockUser.uid);
      toast.success('Signed in to demo space.');
      return;
    }

    if (auth) {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully.');
    }
  };

  const signup = async (email: string, password: string, displayName: string) => {
    if (isDemo) {
      // Mock Sign up
      const uid = 'demo_' + Math.random().toString(36).substring(2, 9);
      const mockUser = {
        uid,
        email,
        displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };
      localStorage.setItem('atlasula_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);

      const initialProfile: UserProfile = {
        uid,
        email,
        displayName,
        photoURL: mockUser.photoURL,
        travelLevel: 'Explorer',
        xp: 100,
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        countriesVisited: [],
        citiesVisited: [],
        tripsCompleted: 0,
        achievements: MOCK_ACHIEVEMENTS,
      };
      saveDemoProfile(uid, initialProfile);
      setProfile(initialProfile);
      setLoading(false);
      toast.success('Demo account created!');
      return;
    }

    if (auth) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await loadUserProfile(result.user.uid, email, displayName);
      toast.success('Account created!');
    }
  };

  const loginWithGoogle = async () => {
    if (isDemo) {
      await signup('google.demo@atlasula.ai', 'password', 'Google Explorer');
      return;
    }

    if (auth && googleProvider) {
      const result = await signInWithPopup(auth, googleProvider);
      await loadUserProfile(result.user.uid, result.user.email, result.user.displayName);
      toast.success('Signed in with Google.');
    }
  };

  const logout = async () => {
    if (isDemo) {
      localStorage.removeItem('atlasula_demo_user');
      setUser(null);
      setProfile(null);
      toast.success('Logged out from demo space.');
      return;
    }

    if (auth) {
      await signOut(auth);
      toast.success('Logged out.');
    }
  };

  const resetPassword = async (email: string) => {
    if (isDemo) {
      toast.success('Password reset email simulated.');
      return;
    }
    if (auth) {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent.');
    }
  };

  // GAMIFICATION LOGIC: GAIN XP
  const gainXP = async (amount: number) => {
    if (!profile || !user) return;

    const newXP = profile.xp + amount;
    let newLevel = profile.travelLevel;

    // Check level thresholds
    if (newXP >= LEVEL_XP_REQUIREMENTS.Legend) {
      newLevel = 'Legend';
    } else if (newXP >= LEVEL_XP_REQUIREMENTS.Globetrotter) {
      newLevel = 'Globetrotter';
    } else if (newXP >= LEVEL_XP_REQUIREMENTS.Backpacker) {
      newLevel = 'Backpacker';
    } else if (newXP >= LEVEL_XP_REQUIREMENTS.Navigator) {
      newLevel = 'Navigator';
    }

    const levelChanged = newLevel !== profile.travelLevel;
    const updatedProfile = {
      ...profile,
      xp: newXP,
      travelLevel: newLevel
    };

    if (levelChanged) {
      // Trigger level-up explosion!
      confetti({
        particleCount: 150,
        spread: 80,
        colors: ['#7C5CFF', '#00D4FF', '#22C55E']
      });
      toast.success(`🎉 Level Up! You are now a ${newLevel}!`, {
        duration: 5000,
        icon: '🏆',
        style: {
          background: '#161B33',
          color: '#fff',
          border: '1px solid #7C5CFF',
        }
      });
    } else {
      toast.success(`+${amount} XP earned`, { id: 'xp-gain' });
    }

    setProfile(updatedProfile);

    if (isDemo) {
      saveDemoProfile(user.uid, updatedProfile);
    } else if (db) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { xp: newXP, travelLevel: newLevel });
    }
  };

  // UNLOCK ACHIEVEMENT
  const unlockAchievement = async (id: string) => {
    if (!profile || !user) return;

    let unlockedNow = false;
    const updatedAchievements = profile.achievements.map((ach) => {
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

    if (!unlockedNow) return;

    const updatedProfile = {
      ...profile,
      achievements: updatedAchievements
    };

    // Confetti effect!
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const achObj = profile.achievements.find(a => a.id === id);
    toast.success(`🏆 Unlocked Badge: ${achObj?.title || 'Achievement'}!`, {
      duration: 4000,
      style: {
        background: '#161B33',
        color: '#fff',
        border: '1px solid #00D4FF',
      }
    });

    setProfile(updatedProfile);

    // Sync profile
    if (isDemo) {
      saveDemoProfile(user.uid, updatedProfile);
    } else if (db) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { achievements: updatedAchievements });
    }

    // Award bonus XP for unlock
    await gainXP(200);
  };

  // UPDATE STREAK
  const updateStreak = async () => {
    if (!profile || !user) return;

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
        // Unlock streak explorer achievement if conditions met
        if (newStreak >= 5) {
          setTimeout(() => unlockAchievement('streak_explorer'), 1000);
        }
      } else if (diffDays > 1) {
        newStreak = 1; // reset streak
      }
    } else {
      newStreak = 1;
    }

    const updatedProfile = {
      ...profile,
      streak: newStreak,
      lastActiveDate: today
    };

    setProfile(updatedProfile);

    if (isDemo) {
      saveDemoProfile(user.uid, updatedProfile);
    } else if (db) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { streak: newStreak, lastActiveDate: today });
    }
  };

  // COMPLETE TRIP STATE (increments completions, records visited cities/countries)
  const completeTripState = async (trip: Trip) => {
    if (!profile || !user) return;

    const cities = [...profile.citiesVisited];
    const countries = [...profile.countriesVisited];

    // Destructure city/country
    const parts = trip.destination.split(',').map(s => s.trim());
    const city = parts[0];
    const country = parts[1] || '';

    if (city && !cities.includes(city)) {
      cities.push(city);
    }
    if (country && !countries.includes(country)) {
      countries.push(country);
    }

    const updatedProfile = {
      ...profile,
      tripsCompleted: profile.tripsCompleted + 1,
      citiesVisited: cities,
      countriesVisited: countries
    };

    setProfile(updatedProfile);

    if (isDemo) {
      saveDemoProfile(user.uid, updatedProfile);
    } else if (db) {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, { 
        tripsCompleted: profile.tripsCompleted + 1, 
        citiesVisited: cities,
        countriesVisited: countries
      });
    }

    toast.success(`🎉 Trip to ${trip.destination} completed!`, { icon: '✈️' });
    await gainXP(500); // 500 XP bonus for completing trip!
    await unlockAchievement('first_trip');
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      isDemo,
      login,
      signup,
      loginWithGoogle,
      logout,
      resetPassword,
      gainXP,
      unlockAchievement,
      updateStreak,
      completeTripState
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
