import React, { useState, useEffect } from 'react';
import { Card, Button } from '../components/UI';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Phone, 
  Building2, 
  Compass, 
  Sparkles,
  Info,
  Activity,
  HeartBeat
} from 'lucide-react';
import { Trip } from '../types';
import { toast } from 'react-hot-toast';

export const SafetyCenter: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);

  // SOS state
  const [sosCountdown, setSosCountdown] = useState<number | null>(null);
  const [sosActive, setSosActive] = useState(false);

  // Load Trips
  useEffect(() => {
    const stored = localStorage.getItem('atlasula_trips');
    if (stored) {
      try {
        const loaded: Trip[] = JSON.parse(stored);
        setTrips(loaded);
        if (loaded.length > 0) setSelectedTrip(loaded[0]);
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const triggerSOS = () => {
    if (sosActive) {
      setSosActive(false);
      setSosCountdown(null);
      toast.success('SOS Broadcast cancelled.');
      return;
    }

    setSosCountdown(3);
    toast('Initiating Emergency SOS broadcast...', { icon: '🚨' });
  };

  // SOS Countdown Timer
  useEffect(() => {
    if (sosCountdown === null) return;

    if (sosCountdown > 0) {
      const timer = setTimeout(() => {
        setSosCountdown(sosCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setSosActive(true);
      setSosCountdown(null);
      toast.error('Emergency SOS Broadcasted! Local embassy and contacts notified.', {
        duration: 5000,
        style: {
          background: '#EF4444',
          color: '#fff',
          border: '1px solid #ff6b6b'
        }
      });
    }
  }, [sosCountdown]);

  // Scam warnings based on destination
  const getScamsForDestination = () => {
    if (!selectedTrip) return [
      { title: 'Touting Taxis', desc: 'Drivers offering flat rates instead of using standard taxi meters. Always insist on meters or use ridesharing apps.' },
      { title: 'Street Game Bets', desc: 'Cups or shell games run by groups on streets. These are rigged setups designed to pickpocket observers.' }
    ];

    const dest = selectedTrip.destination.toLowerCase();
    if (dest.includes('paris')) {
      return [
        { title: 'Friendship Bracelet Trick', desc: 'People aggressively tying braided bracelets onto tourists wrists near Sacré-Cœur, then demanding cash payment.' },
        { title: 'Gold Ring Find scam', desc: 'Someone pretends to find a gold ring on the floor in front of you, offers it to you, then asks for a reward.' },
        { title: 'Fake Charity Petitions', desc: 'Groups of youth asking you to sign petitions for deaf/charity causes, which is a distraction to pickpocket you.' }
      ];
    }
    if (dest.includes('tokyo')) {
      return [
        { title: 'Kabukicho Bar Solicitation', desc: 'Touts inviting you to host/hostess bars offering cheap drinks. They hit you with huge hidden cover charges inside.' },
        { title: 'Fake Monk donations', desc: 'Touts dressed as Buddhist monks handing out gold tokens/prayers, then demanding aggressive donations.' }
      ];
    }

    return [
      { title: 'Touting Taxis', desc: 'Drivers offering flat rates instead of using standard taxi meters. Always insist on meters or use ridesharing apps.' },
      { title: 'Fake WiFi Hotspots', desc: 'Open, unencrypted WiFi networks named after local cafes. Use VPNs to avoid data sniffing.' },
      { title: 'ATM Card Skimmers', desc: 'Atm slots fitted with magnetic readers in quiet alleys. Only use ATMs inside registered banks.' }
    ];
  };

  // Emergency Numbers
  const getEmergencyNumbers = () => {
    if (!selectedTrip) return { police: '911', medical: '911', embassy: 'Not Registered' };

    const dest = selectedTrip.destination.toLowerCase();
    if (dest.includes('paris') || dest.includes('france')) {
      return { police: '17 (or 112)', medical: '15', embassy: '+1 (33) 143-122-222 (US Embassy)' };
    }
    if (dest.includes('tokyo') || dest.includes('japan')) {
      return { police: '110', medical: '119', embassy: '+1 (81) 33-224-5000 (US Embassy)' };
    }
    return { police: '112 / 911', medical: '112 / 911', embassy: 'Check Profile settings' };
  };

  const emerNumbers = getEmergencyNumbers();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Selector */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center border-b border-white/5 pb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Safety & SOS Vault</h1>
          <p className="text-xs text-textSecondary mt-1">Acquire emergency dialers, scam protection files, and activate medical SOS alerts.</p>
        </div>

        {trips.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-xs text-textSecondary font-medium">Active Trip:</span>
            <select
              value={selectedTrip?.id || ''}
              onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value) || null)}
              className="glass-input rounded-xl px-4 py-2 text-xs font-semibold focus:outline-none cursor-pointer bg-card"
            >
              {trips.map(t => (
                <option key={t.id} value={t.id}>📍 {t.destination}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: SOS Trigger & Scam Warnings */}
        <div className="lg:col-span-8 space-y-6">
          {/* SOS Section */}
          <Card 
            variant="glass" 
            className={`p-6 border-white/10 text-center relative overflow-hidden transition-all duration-500 ${
              sosActive 
                ? 'bg-gradient-to-br from-error/40 to-background border-error shadow-2xl' 
                : 'bg-gradient-to-br from-card/90 to-error/5 shadow-xl'
            }`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-error/10 rounded-full blur-2xl pointer-events-none" />

            <div className="max-w-md mx-auto space-y-4">
              <div className="w-12 h-12 rounded-xl bg-error/20 border border-error/30 flex items-center justify-center text-error mx-auto animate-pulse">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-white font-sora">Emergency SOS Broadcast</h2>
              <p className="text-xs text-textSecondary leading-relaxed">
                Need immediate help? Pressing the button below begins a 3-second countdown to broadcast your live GPS coords, health vault, and active travel details to local police and your nearest country embassy.
              </p>

              <div className="pt-2 flex justify-center">
                <Button 
                  onClick={triggerSOS}
                  variant="danger" 
                  className={`px-8 py-3.5 text-xs font-bold uppercase tracking-wider rounded-xl cursor-pointer ${
                    sosCountdown !== null ? 'animate-bounce bg-error-dark' : ''
                  }`}
                >
                  {sosCountdown !== null 
                    ? `Broadcasting in ${sosCountdown}s (Click Cancel)` 
                    : sosActive 
                      ? 'Cancel Active SOS Alarm' 
                      : 'Trigger Emergency SOS'}
                </Button>
              </div>
            </div>
          </Card>

          {/* Scams Warning list */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-white font-sora flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" /> Local Scams Directory
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {getScamsForDestination().map((scam, idx) => (
                <Card key={idx} variant="solid" className="p-4 bg-card/65 border-white/5 space-y-2">
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="text-error">•</span> {scam.title}
                  </h4>
                  <p className="text-[10px] text-textSecondary leading-relaxed">
                    {scam.desc}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Emergency Contacts Dialers */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-lg font-bold text-white font-sora">Hotline Numbers</h2>
          
          <Card variant="solid" className="p-5 bg-card/65 border-white/5 space-y-4">
            <div className="flex items-center gap-2.5 text-success">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-xs font-bold uppercase tracking-wider font-sora">Immediate Support</h3>
            </div>

            <div className="space-y-3 pt-1">
              {/* Police */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light"><Phone className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Local Police</h4>
                    <p className="text-[9px] text-textSecondary">Crime & Patrol</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-white">{emerNumbers.police}</span>
              </div>

              {/* Medical */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-error/20 flex items-center justify-center text-error"><Activity className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Ambulance / Medical</h4>
                    <p className="text-[9px] text-textSecondary">First-aid response</p>
                  </div>
                </div>
                <span className="text-xs font-extrabold text-white">{emerNumbers.medical}</span>
              </div>

              {/* Embassy */}
              <div className="p-3 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-2 items-start">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><Building2 className="w-4 h-4" /></div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Consular Embassy</h4>
                    <p className="text-[9px] text-textSecondary">Diplomatic assistance</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-accent pt-1">{emerNumbers.embassy}</span>
              </div>
            </div>
          </Card>

          {/* Safety Checklist */}
          <Card variant="solid" className="p-5 bg-card/45 border-white/5 space-y-3.5">
            <h3 className="font-bold text-xs text-white font-sora flex items-center gap-1.5">
              <Info className="w-4.5 h-4.5 text-accent" /> Atlas Safety tips
            </h3>
            <ul className="space-y-2 text-[10px] text-textSecondary leading-relaxed">
              <li>• Always secure copy of passports on cloud drives.</li>
              <li>• Notify banks of travel dates to prevent credit freezes.</li>
              <li>• Avoid wearing flashy jewelry in busy public squares.</li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SafetyCenter;
