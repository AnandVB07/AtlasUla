import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Card } from '../components/UI';
import { 
  Sparkles, 
  MapPin, 
  Wallet, 
  ShieldCheck, 
  BookOpen, 
  Compass, 
  ChevronRight, 
  Flame, 
  Check, 
  ArrowRight,
  Globe
} from 'lucide-react';
import { motion } from 'framer-motion';

export const LandingPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background radial glows */}
      <div className="absolute top-[-10%] left-[-20%] w-[80vw] h-[80vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-20%] w-[80vw] h-[80vw] bg-accent/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Header / Navbar */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sora tracking-wide">
            AtlasUla
          </span>
          <span className="text-[9px] font-bold bg-primary/10 text-primary-light border border-primary/20 px-2 py-0.5 rounded-full">
            PREMIUM
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
            className="text-sm font-semibold text-textSecondary hover:text-white transition-colors cursor-pointer"
          >
            Sign In
          </button>
          <Button 
            variant="accent" 
            size="sm" 
            onClick={() => navigate(user ? '/dashboard' : '/auth')}
          >
            Get Started Free
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-12 pb-24 relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <motion.div 
          className="lg:col-span-7 space-y-6 text-left"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-accent-light">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Next-Gen Travel Engine</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white font-sora tracking-tight leading-[1.1]">
            Your AI Travel <br />
            <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Companion.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-textSecondary max-w-xl font-medium leading-relaxed">
            AtlasUla leverages artificial intelligence to build custom day-by-day itineraries, manage expenses, predict packing lists, and guide you safely through your next adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate(user ? '/dashboard' : '/auth')}
              className="gap-2 group shadow-xl"
            >
              Start Planning Now
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                const element = document.getElementById('features');
                element?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Features
            </Button>
          </div>

          {/* Micro stats banner */}
          <div className="pt-6 grid grid-cols-3 gap-6 max-w-md border-t border-white/5">
            <div>
              <p className="text-2xl font-extrabold text-white font-sora">99%</p>
              <p className="text-xs text-textSecondary mt-0.5">Itinerary accuracy</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white font-sora">120+</p>
              <p className="text-xs text-textSecondary mt-0.5">Countries supported</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-white font-sora">50k+</p>
              <p className="text-xs text-textSecondary mt-0.5">Trips completed</p>
            </div>
          </div>
        </motion.div>

        {/* Hero Interactive Visualization */}
        <motion.div 
          className="lg:col-span-5 relative flex items-center justify-center"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          {/* Main Globe SVG Container */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-full bg-gradient-to-br from-primary/10 to-accent/5 flex items-center justify-center border border-white/5 shadow-2xl">
            <div className="absolute inset-4 rounded-full border border-dashed border-white/10 animate-[spin_40s_linear_infinite]" />
            <div className="absolute inset-8 rounded-full border border-white/5 animate-[spin_20s_linear_infinite_reverse]" />
            
            {/* Pulsing Core */}
            <div className="w-40 h-40 rounded-full bg-gradient-to-tr from-primary/20 to-accent/20 blur-xl animate-pulse" />
            <Globe className="w-32 h-32 text-primary-light/40 absolute animate-pulse-glow" />

            {/* Floating UI Cards */}
            <motion.div 
              className="absolute -top-4 -left-4 glass-card p-3 rounded-xl border border-white/10 shadow-glass flex items-center gap-2.5 max-w-[170px]"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center text-success"><Check className="w-4 h-4" /></div>
              <div>
                <p className="text-[10px] text-textSecondary">Luggage packed</p>
                <p className="text-xs font-bold text-white">100% Progress</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute bottom-6 -right-6 glass-card p-3.5 rounded-xl border border-white/10 shadow-glass flex items-center gap-2.5 max-w-[190px]"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
            >
              <Compass className="w-5 h-5 text-accent animate-spin" style={{ animationDuration: '8s' }} />
              <div>
                <p className="text-[10px] text-textSecondary">Day 1: Paris Itinerary</p>
                <p className="text-xs font-bold text-white">Sunset at Eiffel Tower</p>
              </div>
            </motion.div>

            <motion.div 
              className="absolute top-20 -right-10 glass-card p-3 rounded-xl border border-white/10 shadow-glass flex items-center gap-2.5 max-w-[160px]"
              animate={{ x: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
            >
              <Wallet className="w-5 h-5 text-warning" />
              <div>
                <p className="text-[10px] text-textSecondary">Expense logged</p>
                <p className="text-xs font-bold text-warning">-$34.50 Lunch</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest font-sora">End-to-End Suite</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-sora">Everything you need for your trip.</h2>
          <p className="text-sm text-textSecondary leading-relaxed">
            AtlasUla consolidates travel planning, mapping, budgeting, weather alerts, journalizing, and gamification into a single, cohesive experience.
          </p>
        </div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light">
                  <Compass className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">AI-Driven Planner</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Enter your destination, budget tier, and style. Gemini generates a structured morning-afternoon-evening itinerary optimized for travel time and transit.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                Try Trip Planning <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                  <Wallet className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">Smart Budget Allocator</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Input a total budget and automatically allocate shares for hotels, food, emergency, and entertainment. Track daily logs with interactive charts.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                Manage Finances <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-success/20 border border-success/30 flex items-center justify-center text-success">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">Travel Safety Center</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Access local country safety indexes, scam alerts, embassy listings, and simulated SOS triggers to secure your path during the trip.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                View Safety Guides <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-warning/20 border border-warning/30 flex items-center justify-center text-warning">
                  <Flame className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">Gamified Travel Levels</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Earn XP by planning trips, tracking expenses, and keeping streaks. Unlock badges (e.g. Packing Pro, Budget Master) with confetti celebration.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                Check achievements <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center text-primary-light">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">Scrapbook Journal</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  Document visited places, select mood trackers, upload pictures, and run AI Memory Synthesis to write beautiful text summaries of your logs.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                Write Journal <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>

          <motion.div variants={itemVariants}>
            <Card variant="glow" className="p-6 space-y-4 h-full flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 border border-accent/30 flex items-center justify-center text-accent">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold font-sora">Smart AI Chatbot</h3>
                <p className="text-xs text-textSecondary leading-relaxed">
                  A persistent floating travel assistant that scans your active itineraries. Get dining, packing, weather advice, or packing modifications on the go.
                </p>
              </div>
              <div className="text-accent text-xs font-bold flex items-center gap-1 cursor-pointer pt-3 group" onClick={() => navigate('/auth')}>
                Chat with Assistant <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* Pricing Section */}
      <section className="max-w-7xl mx-auto px-6 py-24 border-t border-white/5 relative z-10">
        <div className="text-center max-w-xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-semibold text-accent uppercase tracking-widest font-sora">Transparent Plans</span>
          <h2 className="text-3xl font-bold text-white font-sora">Ready to elevate your journeys?</h2>
          
          {/* Billing period switcher */}
          <div className="flex items-center justify-center gap-3 pt-3">
            <span className={`text-xs ${billingPeriod === 'monthly' ? 'text-white font-bold' : 'text-textSecondary'}`}>Monthly</span>
            <button 
              onClick={() => setBillingPeriod(billingPeriod === 'monthly' ? 'yearly' : 'monthly')}
              className="w-11 h-6 bg-primary/20 border border-primary/40 rounded-full p-0.5 flex relative transition-all duration-300 items-center cursor-pointer"
            >
              <div className={`w-4.5 h-4.5 bg-primary rounded-full transition-all duration-300 ${billingPeriod === 'yearly' ? 'translate-x-5 bg-accent shadow shadow-accent/40' : 'translate-x-0'}`} />
            </button>
            <span className={`text-xs ${billingPeriod === 'yearly' ? 'text-white font-bold' : 'text-textSecondary'}`}>Yearly (Save 20%)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {/* Free Plan */}
          <Card variant="solid" className="p-8 flex flex-col justify-between bg-card/45 border-white/5 h-full">
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white font-sora">Explorer Class</h4>
                <p className="text-xs text-textSecondary mt-1">Perfect for casual weekend getaways.</p>
              </div>
              <div className="text-3xl font-black text-white font-sora">
                $0 <span className="text-sm font-medium text-textSecondary">/ forever</span>
              </div>
              <ul className="space-y-3">
                {['Plan up to 3 active itineraries', 'Standard weather checklists', 'Manual budget & expense logger', 'Safety checklists', 'Basic Travel Journal'].map((feature) => (
                  <li key={feature} className="flex gap-2.5 items-center text-xs text-textSecondary font-medium">
                    <Check className="w-4 h-4 text-success shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="outline" fullWidth className="mt-8" onClick={() => navigate('/auth')}>
              Get Started
            </Button>
          </Card>

          {/* Pro Plan */}
          <Card variant="glow" className="p-8 flex flex-col justify-between bg-gradient-to-br from-card to-primary/10 border-primary/45 shadow-xl relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 px-4 py-1 text-[9px] font-bold tracking-widest text-background bg-accent uppercase rounded-bl-xl font-sora">
              Best Value
            </div>
            
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-bold text-white font-sora">Globetrotter Pro</h4>
                <p className="text-xs text-textSecondary mt-1">For frequent travelers and AI-seeking nomads.</p>
              </div>
              <div className="text-3xl font-black text-white font-sora">
                {billingPeriod === 'monthly' ? '$8' : '$6.40'} <span className="text-sm font-medium text-textSecondary">/ month</span>
              </div>
              <ul className="space-y-3">
                {[
                  'Unlimited AI Travel Itineraries',
                  'Unlimited Gemini Travel Chat prompts',
                  'Advanced AI budget optimization suggestions',
                  'Weather-aware packing & warning engine',
                  'Interactive map integrations',
                  'AI Journal memories synthesis',
                  'Exclusive badges & level multipliers'
                ].map((feature) => (
                  <li key={feature} className="flex gap-2.5 items-center text-xs text-white font-medium">
                    <Check className="w-4 h-4 text-accent shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Button variant="accent" fullWidth className="mt-8" onClick={() => navigate('/auth')}>
              Upgrade to Pro
            </Button>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-sora tracking-wide">
            AtlasUla
          </span>
          <p className="text-xs text-textSecondary">© 2026. Your AI Travel Companion.</p>
        </div>
        <div className="flex gap-6 text-xs text-textSecondary">
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white transition-colors">Contact Support</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
