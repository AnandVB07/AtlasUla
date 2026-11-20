import {

Award,
BrainCircuit,
CloudSun,
DollarSign,
Plane,
ShieldCheck,
Sparkles
} from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button,Card } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartPlanning = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden select-none">
      {/* Dynamic Background Glow Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl opacity-60 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl opacity-60 pointer-events-none" />

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

      {/* Nav Bar */}
      <header className="max-w-7xl mx-auto px-6 py-5 flex justify-between items-center relative z-20">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-accent flex items-center justify-center glow-primary">
            <Plane className="w-5 h-5 text-white" />
          </div>
          <span className="font-sora font-black text-lg tracking-tight text-white">AtlasUla</span>
        </div>

        <Button 
          variant="glass" 
          size="sm"
          onClick={handleStartPlanning}
          className="text-xs font-semibold py-1.5 px-4 cursor-pointer"
        >
          {user ? 'Go to Dashboard' : 'Sign In'}
        </Button>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto px-6 pt-16 pb-20 text-center relative z-10 flex flex-col items-center">
        {/* Tag Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5 text-sm font-bold text-accent uppercase tracking-widest mb-6 animate-pulse-glow">
          <Sparkles className="w-3.5 h-3.5" /> Introducing AtlasUla
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-black text-white font-sora tracking-tight leading-[1.1] max-w-4xl">
          Your Intelligent <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-accent to-success">AI Travel</span> Companion.
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-textSecondary mt-6 max-w-2xl leading-relaxed">
          Make room for the adventure. Bring your itinerary, budget, packing list, and travel memories together in one beautiful place.
        </p>

        {/* Hero Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-10">
          <Button 
            variant="accent" 
            size="lg" 
            onClick={handleStartPlanning}
            className="gap-2 text-background font-bold px-8 cursor-pointer"
          >
            Start Planning Now
          </Button>
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => {
              const el = document.getElementById('features');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-8 cursor-pointer"
          >
            Explore Features
          </Button>
        </div>

        {/* Hero Mockup Widget */}
        <div className="w-full max-w-4xl mt-16 rounded-2xl border border-white/10 overflow-hidden shadow-2xl relative bg-card/25 aspect-[16/10] group">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <div className="absolute top-4 left-4 flex gap-1.5 z-20">
            <div className="w-2.5 h-2.5 rounded-full bg-error" />
            <div className="w-2.5 h-2.5 rounded-full bg-warning" />
            <div className="w-2.5 h-2.5 rounded-full bg-success" />
          </div>

          <img src="https://images.unsplash.com/photo-1516483638261-f4dbaf036963?auto=format&fit=crop&w=1200&q=80" alt="Colorful coastal villages along the Italian Riviera" className="absolute inset-0 w-full h-full object-cover opacity-65" loading="lazy" width="1200" height="750" />
          {/* Interactive Screen Preview */}
          <div className="p-8 flex flex-col justify-between h-full bg-gradient-to-br from-card/60 to-background/70 select-none relative pt-12">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div className="text-left space-y-1.5">
                <span className="text-sm text-accent uppercase tracking-widest font-sora font-semibold">Active Itinerary Match</span>
                <h3 className="text-lg font-bold text-white font-sora">✈️ Summer Escape: Cinque Terre, Italy</h3>
                <p className="text-sm text-textSecondary">Day 1: Coastal trails & seaside dining</p>
              </div>

              <div className="flex gap-2 bg-white/5 border border-white/10 p-1 rounded-xl text-sm font-semibold text-textSecondary">
                <span className="px-2.5 py-1 bg-primary text-white rounded-lg">Itinerary</span>
                <span className="px-2.5 py-1">Budgets</span>
                <span className="px-2.5 py-1">SOS</span>
              </div>
            </div>

            {/* Bottom Floating Stats */}
            <div className="grid grid-cols-3 gap-4 border-t border-white/5 pt-4 text-left">
              <div>
                <span className="text-xs text-textSecondary uppercase font-semibold">Lodging Allocated</span>
                <p className="text-xs font-bold text-white mt-0.5">$650.00 / $1200</p>
              </div>
              <div>
                <span className="text-xs text-textSecondary uppercase font-semibold">Weather Outlook</span>
                <p className="text-xs font-bold text-warning flex items-center gap-1 mt-0.5"><CloudSun className="w-3.5 h-3.5" /> 26° Sunny</p>
              </div>
              <div>
                <span className="text-xs text-textSecondary uppercase font-semibold">Gamification Score</span>
                <p className="text-xs font-bold text-accent mt-0.5">Lv. 3 Globetrotter</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 relative z-10 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-bold font-sora text-white">Full-Suite Features</h2>
          <p className="text-xs text-textSecondary max-w-sm mx-auto">Everything you need to orchestrate the ultimate vacation outline.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-3 hover:border-primary/20 transition-all duration-300">
            <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center text-primary-light"><BrainCircuit className="w-5 h-5" /></div>
            <h3 className="text-xs font-bold text-white font-sora">Gemini AI Planner</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Generates high-fidelity daily itineraries containing detailed sightseeing, dinings, costs, and backup alternatives.</p>
          </Card>

          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-3 hover:border-primary/20 transition-all duration-300">
            <div className="w-9 h-9 rounded-lg bg-accent/20 flex items-center justify-center text-accent"><DollarSign className="w-5 h-5" /></div>
            <h3 className="text-xs font-bold text-white font-sora">Category Auditor</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Log expense transactions, divide budgets into lodging, transit, and food, and audit items using AI.</p>
          </Card>

          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-3 hover:border-primary/20 transition-all duration-300">
            <div className="w-9 h-9 rounded-lg bg-warning/20 flex items-center justify-center text-warning"><Award className="w-5 h-5" /></div>
            <h3 className="text-xs font-bold text-white font-sora">Gamified XP</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Complete itineraries, check off packing items, and keep login streaks to unlock travel badges and level ratings.</p>
          </Card>

          <Card variant="solid" className="p-5 bg-card/60 border-white/5 space-y-3 hover:border-primary/20 transition-all duration-300">
            <div className="w-9 h-9 rounded-lg bg-success/20 flex items-center justify-center text-success"><ShieldCheck className="w-5 h-5" /></div>
            <h3 className="text-xs font-bold text-white font-sora">Safety Center</h3>
            <p className="text-sm text-textSecondary leading-relaxed">Review location danger ratings, check emergency details, and protect credentials in the vault.</p>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
