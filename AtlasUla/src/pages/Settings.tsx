import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { 
  Settings as SettingsIcon, 
  Key, 
  Trash2, 
  User, 
  Bell, 
  ShieldAlert,
  Sparkles,
  Save,
  RotateCcw
} from 'lucide-react';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export const Settings: React.FC = () => {
  const { profile, user, isDemo, gainXP } = useAuth();
  
  // States
  const [displayName, setDisplayName] = useState('');
  const [avatarSeed, setAvatarSeed] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [weatherKey, setWeatherKey] = useState('');
  const [mapsKey, setMapsKey] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.displayName || '');
      setAvatarSeed(profile.uid || '');
      
      // Load keys from LocalStorage
      setGeminiKey(localStorage.getItem('atlasula_gemini_key') || '');
      setWeatherKey(localStorage.getItem('atlasula_weather_key') || '');
      setMapsKey(localStorage.getItem('atlasula_maps_key') || '');
    }
  }, [profile]);

  if (!profile || !user) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedPhotoURL = avatarSeed 
        ? `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`
        : profile.photoURL;

      if (isDemo) {
        const profilesStr = localStorage.getItem('atlasula_demo_profiles') || '{}';
        const profiles = JSON.parse(profilesStr);
        profiles[user.uid] = {
          ...profile,
          displayName,
          photoURL: updatedPhotoURL
        };
        localStorage.setItem('atlasula_demo_profiles', JSON.stringify(profiles));
      } else if (db) {
        const docRef = doc(db, 'users', user.uid);
        await updateDoc(docRef, { displayName, photoURL: updatedPhotoURL });
      }
      
      toast.success('Profile details saved! Reload might be needed to refresh avatars.');
      gainXP(30);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAPIKeys = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save API keys to local storage for services usage
    if (geminiKey) localStorage.setItem('atlasula_gemini_key', geminiKey);
    else localStorage.removeItem('atlasula_gemini_key');

    if (weatherKey) localStorage.setItem('atlasula_weather_key', weatherKey);
    else localStorage.removeItem('atlasula_weather_key');

    if (mapsKey) localStorage.setItem('atlasula_maps_key', mapsKey);
    else localStorage.removeItem('atlasula_maps_key');

    toast.success('API credential tokens stored safely.');
    gainXP(50);
  };

  const handleWipeData = () => {
    if (confirm('🚨 CRITICAL CAUTION: Wipe all local travel logs, budget lists, journal scrapbooks, and profiles? This action is irreversible.')) {
      localStorage.removeItem('atlasula_trips');
      localStorage.removeItem('atlasula_journal');
      localStorage.removeItem('atlasula_demo_user');
      localStorage.removeItem('atlasula_demo_profiles');
      localStorage.removeItem('atlasula_gemini_key');
      localStorage.removeItem('atlasula_weather_key');
      localStorage.removeItem('atlasula_maps_key');
      
      toast.error('All local database instances wiped clean.');
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold text-white font-sora">App Settings</h1>
        <p className="text-xs text-textSecondary mt-1">Configure profile details, active API keys, notifications, or wipe local database caches.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Edit profile & keys */}
        <div className="lg:col-span-8 space-y-6">
          {/* Profile settings */}
          <Card variant="solid" className="p-6 bg-card/60 border-white/5 space-y-4">
            <h2 className="text-base font-bold text-white font-sora flex items-center gap-2 border-b border-white/5 pb-2">
              <User className="w-5 h-5 text-primary-light" /> Edit Profile Details
            </h2>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Display Name"
                  placeholder="Explorer Name"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />

                <Input
                  label="Avatar Seed Word"
                  placeholder="e.g. wanderer, adventure"
                  helperText="Drives custom profile avatar illustration styles."
                  value={avatarSeed}
                  onChange={(e) => setAvatarSeed(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="primary" disabled={loading} className="gap-2 cursor-pointer">
                  <Save className="w-4 h-4" /> Save Profile Details
                </Button>
              </div>
            </form>
          </Card>

          {/* API keys */}
          <Card variant="solid" className="p-6 bg-card/60 border-white/5 space-y-4">
            <h2 className="text-base font-bold text-white font-sora flex items-center gap-2 border-b border-white/5 pb-2">
              <Key className="w-5 h-5 text-accent" /> API Keys Configuration
            </h2>
            <p className="text-[10px] text-textSecondary leading-relaxed">
              AtlasUla integrates Google Gemini API and OpenWeather out-of-the-box in demo mode. Input your custom keys below to connect live feeds.
            </p>

            <form onSubmit={handleSaveAPIKeys} className="space-y-4">
              <Input
                label="Gemini API Key"
                type="password"
                placeholder="AI Itineraries & chat assistant key"
                value={geminiKey}
                onChange={(e) => setGeminiKey(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="OpenWeather Map Key"
                  type="password"
                  placeholder="Current and 5-day weather feed token"
                  value={weatherKey}
                  onChange={(e) => setWeatherKey(e.target.value)}
                />

                <Input
                  label="Google Maps Token"
                  type="password"
                  placeholder="Interactive maps geocoding credential"
                  value={mapsKey}
                  onChange={(e) => setMapsKey(e.target.value)}
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" variant="accent" className="gap-2 text-background font-bold cursor-pointer">
                  <Save className="w-4 h-4" /> Store API Credentials
                </Button>
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Danger actions & Notification switches */}
        <div className="lg:col-span-4 space-y-6">
          {/* Notifications */}
          <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
            <h3 className="font-bold text-xs text-white font-sora flex items-center gap-2 border-b border-white/5 pb-2">
              <Bell className="w-4.5 h-4.5 text-success" /> Notification Rules
            </h3>
            
            <label className="flex items-center justify-between text-xs text-textSecondary cursor-pointer py-1.5">
              <span>Enable Smart Weather Alerts</span>
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="accent-primary w-4.5 h-4.5 rounded border-white/10 bg-white/5"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-textSecondary cursor-pointer py-1.5">
              <span>Enable Daily Budget Warnings</span>
              <input
                type="checkbox"
                defaultChecked={true}
                className="accent-primary w-4.5 h-4.5 rounded border-white/10 bg-white/5"
              />
            </label>
          </Card>

          {/* Danger zone */}
          <Card variant="solid" className="p-5 bg-card/45 border-white/5 space-y-4">
            <h3 className="font-bold text-xs text-error font-sora flex items-center gap-2 border-b border-error/15 pb-2">
              <ShieldAlert className="w-4.5 h-4.5 text-error animate-pulse" /> Danger Zone
            </h3>
            
            <p className="text-[9px] text-textSecondary leading-relaxed">
              Wiping local data removes all planned itineraries, logged expenses, journal files, and login states immediately. This cannot be undone.
            </p>

            <div className="pt-2">
              <Button 
                onClick={handleWipeData}
                variant="danger" 
                fullWidth 
                className="gap-2 text-xs py-2 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Wipe Local Cache Data
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
