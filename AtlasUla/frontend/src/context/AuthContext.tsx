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
import { auth, googleProvider, isConfigured } from '../firebase';
import { UserProfile, Trip } from '../types';
import { profileService } from '../services/api';
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

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemo, setIsDemo] = useState(!isConfigured);

  // Initialize session
  useEffect(() => {
    if (isConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setIsDemo(false);
          await loadProfile();
        } else {
          setUser(null);
          setProfile(null);
          setLoading(false);
        }
      });
      return unsubscribe;
    } else {
      const demoUserStr = localStorage.getItem('atlasula_demo_user');
      if (demoUserStr) {
        setUser(JSON.parse(demoUserStr));
        loadProfile();
      } else {
        setLoading(false);
      }
    }
  }, []);

  // LOAD PROFILE from REST API
  const loadProfile = async () => {
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (e) {
      console.error('Error loading profile:', e);
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN ACTIONS
  const login = async (email: string, password: string) => {
    if (isDemo) {
      const mockUser = {
        uid: 'demo_user_123',
        email,
        displayName: 'Guest Explorer',
        photoURL: 'https://api.dicebear.com/7.x/adventurer/svg?seed=demo_user_123'
      };
      localStorage.setItem('atlasula_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);
      await loadProfile();
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
      const uid = 'demo_' + Math.random().toString(36).substring(2, 9);
      const mockUser = {
        uid,
        email,
        displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${uid}`
      };
      localStorage.setItem('atlasula_demo_user', JSON.stringify(mockUser));
      setUser(mockUser);

      // Create profile via API
      const initialProfile = await profileService.updateProfile({
        displayName,
        photoURL: mockUser.photoURL
      });
      setProfile(initialProfile);
      setLoading(false);
      toast.success('Demo account created!');
      return;
    }

    if (auth) {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      await profileService.updateProfile({
        displayName,
        photoURL: `https://api.dicebear.com/7.x/adventurer/svg?seed=${result.user.uid}`
      });
      await loadProfile();
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
      await profileService.updateProfile({
        displayName: result.user.displayName || 'Google Explorer',
        photoURL: result.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${result.user.uid}`
      });
      await loadProfile();
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

  // GAMIFICATION: GAIN XP
  const gainXP = async (amount: number) => {
    if (!profile) return;
    try {
      const currentLevel = profile.travelLevel;
      const updated = await profileService.gainXP(amount);
      setProfile(updated);

      if (updated.travelLevel !== currentLevel) {
        confetti({
          particleCount: 150,
          spread: 80,
          colors: ['#7C5CFF', '#00D4FF', '#22C55E']
        });
        toast.success(`🎉 Level Up! You are now a ${updated.travelLevel}!`, {
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
    } catch (e) {
      console.error(e);
    }
  };

  // UNLOCK ACHIEVEMENT
  const unlockAchievement = async (id: string) => {
    if (!profile) return;
    
    // Check if already unlocked locally
    const ach = profile.achievements.find(a => a.id === id);
    if (ach && ach.unlocked) return;

    try {
      const updated = await profileService.unlockAchievement(id);
      setProfile(updated);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      const achObj = updated.achievements.find(a => a.id === id);
      toast.success(`🏆 Unlocked Badge: ${achObj?.title || 'Achievement'}!`, {
        duration: 4000,
        style: {
          background: '#161B33',
          color: '#fff',
          border: '1px solid #00D4FF',
        }
      });
    } catch (e) {
      console.error(e);
    }
  };

  // UPDATE STREAK
  const updateStreak = async () => {
    if (!profile) return;
    try {
      const updated = await profileService.tickStreak();
      setProfile(updated);
      
      if (updated.streak >= 5) {
        await unlockAchievement('streak_explorer');
      }
    } catch (e) {
      console.error(e);
    }
  };

  // COMPLETE TRIP
  const completeTripState = async (trip: Trip) => {
    if (!profile) return;
    try {
      const updated = await profileService.completeTrip(trip.destination);
      setProfile(updated);

      toast.success(`🎉 Trip to ${trip.destination} completed!`, { icon: '✈️' });
      
      confetti({
        particleCount: 150,
        spread: 80
      });

      await unlockAchievement('first_trip');
    } catch (e) {
      console.error(e);
    }
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
