import {
AlertTriangle,
FolderSync,
Trash2,
User
} from 'lucide-react';
import React,{ useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button,Card,Input } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/api';

export const Settings: React.FC = () => {
  const { profile, isDemo, logout } = useAuth();
  
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [avatarSeed, setAvatarSeed] = useState(profile?.uid || '123');
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const photoURL = `https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`;

    try {
      await profileService.updateProfile({ displayName, photoURL });
      toast.success('Profile details updated successfully.');
    } catch (e) {
      toast.error('Failed to update details.');
    } finally {
      setLoading(false);
    }
  };

  const handleWipeData = () => {
    if (confirm('🚨 CRITICAL WARNING:\nThis will permanently delete all saved itineraries, expense databases, vault documents, and scrapbooks. This action is irreversible.\n\nProceed with full data wipe?')) {
      localStorage.clear();
      toast.success('Local Storage databases formatted successfully.');
      logout();
      window.location.href = '/';
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 animate-fade-in pb-12 select-none">
      {/* Header */}
      <div className="border-b border-white/5 pb-4">
        <h1 className="text-2xl font-bold text-white font-sora">App Configuration</h1>
        <p className="text-xs text-textSecondary mt-1">Configure profile details, manage security, or format local databases.</p>
      </div>

      {/* Profile Details Edit */}
      <Card variant="solid" className="p-6 bg-card/60 border-white/5">
        <h3 className="text-sm font-bold text-white font-sora flex items-center gap-2 mb-4">
          <User className="w-4.5 h-4.5 text-primary-light" /> Edit Profile Details
        </h3>

        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <Input
            label="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            placeholder="Explorer"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <Input
              label="Avatar Dicebear Seed"
              value={avatarSeed}
              onChange={(e) => setAvatarSeed(e.target.value)}
              placeholder="e.g. advent123"
            />
            {/* Live avatar preview */}
            <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 rounded-xl justify-center h-12">
              <span className="text-[10px] text-textSecondary uppercase font-bold">Preview:</span>
              <img 
                src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${avatarSeed}`} 
                alt="Avatar Seed Preview"
                className="w-8 h-8 object-contain"
              />
            </div>
          </div>

          <Button type="submit" variant="primary" disabled={loading} className="text-xs h-9 cursor-pointer">
            {loading ? 'Syncing...' : 'Save Profile Details'}
          </Button>
        </form>
      </Card>

      {/* Sync Service status */}
      <Card variant="solid" className="p-6 bg-card/65 border-white/5 space-y-4">
        <h3 className="text-sm font-bold text-white font-sora flex items-center gap-2">
          <FolderSync className="w-4.5 h-4.5 text-accent" /> Cloud Storage Sync
        </h3>

        <div className="flex items-center justify-between text-xs border-b border-white/5 pb-3">
          <span className="text-textSecondary">Sync Database Mode</span>
          <span className={`font-bold px-2 py-0.5 rounded-full border ${
            isDemo 
              ? 'bg-warning/15 border-warning/30 text-warning'
              : 'bg-success/15 border-success/30 text-success'
          }`}>
            {isDemo ? 'Offline Sandbox (Demo)' : 'Live API Connected'}
          </span>
        </div>

        <p className="text-[10px] text-textSecondary leading-relaxed">
          Offline sandbox utilizes LocalStorage for immediate persistence and operates entirely client-side. Live API automatically mirrors operations to the Firebase Firestore / Node.js servers when configured.
        </p>
      </Card>

      {/* Danger Zone formatting data */}
      <Card variant="solid" className="p-6 bg-card/30 border-error/20 space-y-4">
        <h3 className="text-sm font-bold text-error font-sora flex items-center gap-2">
          <AlertTriangle className="w-4.5 h-4.5 text-error animate-pulse" /> Danger Zone
        </h3>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h4 className="text-xs font-bold text-white">Reset Local Workspace</h4>
            <p className="text-[10px] text-textSecondary mt-0.5">Wipe all itineraries, expenses, travel logs, and local scrapbook memories.</p>
          </div>
          
          <Button 
            onClick={handleWipeData}
            variant="outline" 
            size="sm"
            className="border-error/30 text-error hover:bg-error/15 gap-1.5 shrink-0 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" /> Wipe Database
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
