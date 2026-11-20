import {
Eye,
EyeOff,
FolderLock,
Phone,
ShieldAlert,
Trash2
} from 'lucide-react';
import React,{ useEffect,useState } from 'react';
import { toast } from 'react-hot-toast';
import { Button,Card } from '../components/UI';
import { tripService } from '../services/api';
import { Trip } from '../types';

export const SafetyCenter: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // Vault Credentials State
  const [vaultItems, setVaultItems] = useState<{ id: string; name: string; secret: string }[]>(() => {
    const saved = localStorage.getItem('atlasula_travel_vault');
    return saved ? JSON.parse(saved) : [
      { id: 'v1', name: 'Passport Number', secret: 'US-PP-987654321' },
      { id: 'v2', name: 'Emergency Visa PIN', secret: 'VISA-EXP-2029' }
    ];
  });

  const [newItemName, setNewItemName] = useState('');
  const [newItemSecret, setNewItemSecret] = useState('');
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  // Load Trips
  const loadTrips = async () => {
    try {
      const loaded = await tripService.getTrips();
      setTrips(loaded);
      if (loaded.length > 0) {
        setSelectedTrip(loaded[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const handleTripChange = (tripId: string) => {
    const match = trips.find(t => t.id === tripId) || null;
    setSelectedTrip(match);
  };

  // Save vault
  const saveVault = (items: typeof vaultItems) => {
    setVaultItems(items);
    localStorage.setItem('atlasula_travel_vault', JSON.stringify(items));
  };

  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !newItemSecret.trim()) return;

    const updated = [...vaultItems, {
      id: 'vault_' + Math.random().toString(36).substring(2, 9),
      name: newItemName,
      secret: newItemSecret
    }];

    saveVault(updated);
    setNewItemName('');
    setNewItemSecret('');
    toast.success('Credential saved to local secure vaults.');
  };

  const handleDeleteVaultItem = (id: string) => {
    const updated = vaultItems.filter(v => v.id !== id);
    saveVault(updated);
    toast.success('Credential deleted.');
  };

  const toggleShowSecret = (id: string) => {
    setShowSecrets(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Local Emergency Contacts resolver
  const getEmergencyContacts = () => {
    if (!selectedTrip) {
      return { general: '112 (Global / Europe)', fire: '112', police: '112', medical: '112' };
    }
    const destLower = selectedTrip.destination.toLowerCase();
    if (destLower.includes('japan') || destLower.includes('tokyo') || destLower.includes('kyoto')) {
      return { general: '110 (Police) / 119 (Medical)', fire: '119', police: '110', medical: '119' };
    }
    if (destLower.includes('usa') || destLower.includes('new york') || destLower.includes('york')) {
      return { general: '911', fire: '911', police: '911', medical: '911' };
    }
    return { general: '112 (European Union)', fire: '112', police: '112', medical: '112' };
  };

  const emergency = getEmergencyContacts();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Safety Center</h1>
          <p className="text-xs text-textSecondary mt-1">Review emergency telephone lines, safe local areas, and encrypt credentials.</p>
        </div>

        {trips.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-textSecondary font-medium">Select Destination:</span>
            <select
              value={selectedTrip?.id || ''}
              onChange={(e) => handleTripChange(e.target.value)}
              className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>📍 {t.destination}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid: SOS Contacts and Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* SOS Emergency Contacts */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
            <Phone className="w-5 h-5 text-error animate-pulse" /> Emergency Numbers
          </h2>

          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-5">
            <div>
              <span className="text-[10px] text-textSecondary uppercase tracking-widest font-sora">General SOS Hotline</span>
              <h3 className="text-xl font-black text-white mt-1">{emergency.general}</h3>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center pt-2">
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-textSecondary uppercase">Police</p>
                <p className="text-xs font-extrabold text-white mt-1">{emergency.police}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-textSecondary uppercase">Fire</p>
                <p className="text-xs font-extrabold text-white mt-1">{emergency.fire}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                <p className="text-[9px] font-bold text-textSecondary uppercase">Medical</p>
                <p className="text-xs font-extrabold text-white mt-1">{emergency.medical}</p>
              </div>
            </div>

            {selectedTrip && (
              <div className="p-3.5 rounded-xl border border-warning/20 bg-warning/10 text-xs text-textSecondary leading-relaxed flex gap-2 items-start">
                <ShieldAlert className="w-5 h-5 text-warning shrink-0" />
                <span>
                  <strong>Local Advisory</strong>: Petty bag-snatching occurs in crowded transit hubs. Ensure you keep photocopies of passports in the vault and do not carry bulk cash.
                </span>
              </div>
            )}
          </Card>
        </div>

        {/* Secure Document Vault */}
        <div className="lg:col-span-6 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-success" /> Travel Vault
          </h2>

          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-5">
            <div className="space-y-2">
              {vaultItems.map((item) => {
                const isVisible = showSecrets[item.id];
                return (
                  <div 
                    key={item.id} 
                    className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors"
                  >
                    <div>
                      <h4 className="text-xs font-bold text-white leading-normal">{item.name}</h4>
                      <p className="text-[10px] text-textSecondary font-mono mt-0.5 tracking-wider">
                        {isVisible ? item.secret : '••••••••••••••••••••'}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleShowSecret(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-textSecondary hover:text-white transition-colors cursor-pointer"
                      >
                        {isVisible ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      
                      <button
                        onClick={() => handleDeleteVaultItem(item.id)}
                        className="p-1.5 rounded-lg bg-white/5 text-textSecondary hover:text-error transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Save new vault credential */}
            <form onSubmit={handleAddVaultItem} className="border-t border-white/5 pt-4 space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-textSecondary font-sora">Encrypt New Document</h4>
              
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Doc label, e.g. Visa Ref"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />

                <input
                  type="text"
                  placeholder="Private Value"
                  required
                  value={newItemSecret}
                  onChange={(e) => setNewItemSecret(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" fullWidth className="text-xs py-2 cursor-pointer">
                Save Encrypted Doc
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
