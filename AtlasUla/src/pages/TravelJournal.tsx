import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button, Input } from '../components/UI';
import { 
  BookOpen, 
  Plus, 
  Trash2, 
  Sparkles, 
  FileText,
  Calendar,
  Smile,
  Image as ImageIcon,
  Check,
  ChevronRight
} from 'lucide-react';
import { JournalEntry, Trip } from '../types';
import { MOCK_JOURNAL_ENTRIES } from '../utils/mockData';
import { generateJournalSummary } from '../gemini';
import { toast } from 'react-hot-toast';

export const TravelJournal: React.FC = () => {
  const { user, gainXP, unlockAchievement } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  
  // Form State
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [entryTitle, setEntryTitle] = useState('');
  const [entryContent, setEntryContent] = useState('');
  const [entryMood, setEntryMood] = useState<'😊' | '😎' | '😴' | '🤩' | '🤯' | '🧗' | '🍷'>('😊');
  const [entryHighlights, setEntryHighlights] = useState('');
  const [entryImageUrl, setEntryImageUrl] = useState('');

  // AI loading state
  const [aiGeneratingId, setAiGeneratingId] = useState<string | null>(null);

  // Load entries & trips
  useEffect(() => {
    if (user) {
      // Load trips
      const storedTrips = localStorage.getItem('atlasula_trips');
      if (storedTrips) {
        try {
          const parsed = JSON.parse(storedTrips);
          setTrips(parsed);
          if (parsed.length > 0) setSelectedTrip(parsed[0]);
        } catch (e) {
          console.error(e);
        }
      }

      // Load journal entries
      const storedEntries = localStorage.getItem('atlasula_journal');
      if (storedEntries) {
        try {
          setEntries(JSON.parse(storedEntries));
        } catch (e) {
          console.error(e);
        }
      } else {
        setEntries(MOCK_JOURNAL_ENTRIES);
        localStorage.setItem('atlasula_journal', JSON.stringify(MOCK_JOURNAL_ENTRIES));
      }
    }
  }, [user]);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrip || !entryTitle.trim() || !entryContent.trim()) {
      toast.error('Please enter a title and content.');
      return;
    }

    const newEntry: JournalEntry = {
      id: 'journal_' + Math.random().toString(36).substring(2, 9),
      tripId: selectedTrip.id,
      tripName: selectedTrip.destination,
      date: new Date().toISOString().split('T')[0],
      title: entryTitle,
      content: entryContent,
      mood: entryMood,
      highlights: entryHighlights ? entryHighlights.split(',').map(s => s.trim()) : [],
      images: entryImageUrl ? [entryImageUrl] : ['https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&auto=format&fit=crop&q=80']
    };

    const updated = [newEntry, ...entries];
    setEntries(updated);
    localStorage.setItem('atlasula_journal', JSON.stringify(updated));

    // Reset Form
    setEntryTitle('');
    setEntryContent('');
    setEntryHighlights('');
    setEntryImageUrl('');
    setShowAddModal(false);
    toast.success('Journal entry saved!');
    
    // XP reward
    gainXP(100);

    // Food explorer check
    if (entryHighlights.toLowerCase().includes('dining') || entryContent.toLowerCase().includes('eat')) {
      const foodCount = updated.filter(e => e.content.toLowerCase().includes('eat') || e.highlights.some(h => h.toLowerCase().includes('food') || h.toLowerCase().includes('dine'))).length;
      if (foodCount >= 3) {
        unlockAchievement('food_explorer');
      }
    }
  };

  const handleDeleteEntry = (id: string) => {
    if (confirm('Delete this journal entry?')) {
      const updated = entries.filter(e => e.id !== id);
      setEntries(updated);
      localStorage.setItem('atlasula_journal', JSON.stringify(updated));
      toast.success('Entry deleted.');
    }
  };

  const handleGenerateSummary = async (entry: JournalEntry) => {
    setAiGeneratingId(entry.id);
    try {
      const summary = await generateJournalSummary(entry.title, entry.content, entry.highlights);
      
      const updated = entries.map(e => 
        e.id === entry.id ? { ...e, aiSummary: summary } : e
      );
      setEntries(updated);
      localStorage.setItem('atlasula_journal', JSON.stringify(updated));
      toast.success('AI highlight summary generated!');
      gainXP(30);
    } catch (e) {
      console.error(e);
      toast.error('AI synthesis failed. Try again.');
    } finally {
      setAiGeneratingId(null);
    }
  };

  const handleExportPDF = () => {
    toast.success('Compiling PDF scrapbook... Download started.', { icon: '📄' });
    window.print();
  };

  const moods = ['😊', '😎', '😴', '🤩', '🤯', '🧗', '🍷'] as const;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white/5 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white font-sora">Travel Journal</h1>
          <p className="text-xs text-textSecondary mt-1">Capture your memories, select mood trackers, and generate AI highlights.</p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-1.5 cursor-pointer">
            <FileText className="w-3.5 h-3.5" /> Export PDF
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowAddModal(true)} className="gap-1.5 cursor-pointer">
            <Plus className="w-3.5 h-3.5" /> Log Entry
          </Button>
        </div>
      </div>

      {/* Main timeline */}
      <div className="max-w-3xl mx-auto space-y-8 relative before:absolute before:left-6 before:top-2 before:bottom-2 before:w-[1px] before:bg-white/5">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div key={entry.id} className="relative pl-14">
              {/* Timeline circle node */}
              <div className="absolute left-3.5 top-1.5 w-5 h-5 rounded-full bg-background border-2 border-primary flex items-center justify-center z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
              </div>

              {/* Entry Card */}
              <Card variant="glow" className="p-5 flex flex-col md:flex-row gap-5 items-stretch bg-card/65 border-white/5">
                {/* Photo (if exists) */}
                {entry.images && entry.images.length > 0 && (
                  <div className="w-full md:w-36 h-36 rounded-xl overflow-hidden shrink-0 relative bg-white/5">
                    <img 
                      src={entry.images[0]} 
                      alt={entry.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 text-xl bg-background/60 backdrop-blur px-2 py-0.5 rounded-md leading-none">
                      {entry.mood}
                    </div>
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <span className="text-[10px] text-accent font-semibold">{entry.tripName}</span>
                        <h3 className="text-sm font-bold text-white font-sora mt-0.5">{entry.title}</h3>
                      </div>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-1 rounded bg-white/5 text-textSecondary hover:text-error transition-all cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-[10px] text-textSecondary flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-textSecondary/50" /> {entry.date}
                    </p>

                    <p className="text-xs text-textSecondary leading-relaxed pt-1.5">
                      {entry.content}
                    </p>
                  </div>

                  {/* Highlights */}
                  {entry.highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {entry.highlights.map(h => (
                        <span key={h} className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 border border-white/5 text-textSecondary">#{h}</span>
                      ))}
                    </div>
                  )}

                  {/* AI Summary Block */}
                  <div className="pt-4 border-t border-white/5 mt-4">
                    {entry.aiSummary ? (
                      <div className="p-3 bg-primary/5 border border-primary/20 rounded-xl flex gap-2.5 items-start">
                        <Sparkles className="w-4 h-4 text-accent shrink-0 mt-0.5 animate-pulse-glow" />
                        <div>
                          <h5 className="text-[9px] font-bold text-accent uppercase tracking-wider font-sora">Atlas Memory Highlights</h5>
                          <p className="text-[10px] text-textSecondary mt-1 leading-relaxed">
                            {entry.aiSummary}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleGenerateSummary(entry)}
                        disabled={aiGeneratingId === entry.id}
                        variant="glass"
                        size="sm"
                        className="gap-1.5 text-[10px] py-1.5 px-3 cursor-pointer"
                      >
                        {aiGeneratingId === entry.id ? (
                          <div className="w-3.5 h-3.5 rounded-full border border-white border-t-transparent animate-spin" />
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-accent" />
                            Synthesize AI Summary
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </div>
          ))
        ) : (
          <div className="text-center text-xs text-textSecondary p-12">
            Write your first journal entry to start compiling travel memories scrapbook!
          </div>
        )}
      </div>

      {/* Add Entry Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="absolute inset-0" onClick={() => setShowAddModal(false)} />
          <Card variant="glass" className="w-full max-w-lg relative z-10 border-white/10 p-6 space-y-4 max-h-[90vh] overflow-y-auto no-scrollbar transform animate-float">
            <div>
              <h3 className="font-bold text-sm font-sora text-white">Log Travel Memory</h3>
              <p className="text-[10px] text-textSecondary mt-0.5">Write details about your day trip</p>
            </div>

            <form onSubmit={handleAddEntry} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Select Trip</label>
                  <select
                    value={selectedTrip?.id || ''}
                    onChange={(e) => setSelectedTrip(trips.find(t => t.id === e.target.value) || null)}
                    className="w-full glass-input rounded-xl px-3 py-2.5 text-xs font-semibold focus:outline-none bg-card cursor-pointer"
                    required
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>{t.destination}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Mood</label>
                  <div className="flex gap-1 bg-white/5 border border-white/10 p-1.5 rounded-xl justify-around">
                    {moods.map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setEntryMood(m)}
                        className={`text-sm p-1 rounded transition-all cursor-pointer ${entryMood === m ? 'bg-primary scale-110' : 'hover:scale-105'}`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <Input
                label="Entry Title"
                placeholder="e.g. Sunset cycle ride near Seine"
                required
                value={entryTitle}
                onChange={(e) => setEntryTitle(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Journal Content</label>
                <textarea
                  placeholder="Describe your day, interactions, food tastes, and emotions..."
                  required
                  value={entryContent}
                  onChange={(e) => setEntryContent(e.target.value)}
                  rows={4}
                  className="w-full glass-input rounded-xl p-3 text-xs focus:outline-none"
                />
              </div>

              <Input
                label="Highlights (comma separated)"
                placeholder="e.g. Eifel lights, bicycle ride, red wine"
                value={entryHighlights}
                onChange={(e) => setEntryHighlights(e.target.value)}
              />

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-textSecondary uppercase tracking-wider font-sora">Photo Image Link (Optional)</label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-2.5 w-4 h-4 text-textSecondary" />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={entryImageUrl}
                    onChange={(e) => setEntryImageUrl(e.target.value)}
                    className="w-full glass-input rounded-xl pl-9 pr-4 py-2.5 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button type="submit" variant="primary" className="flex-1 cursor-pointer">Save Memory</Button>
                <Button type="button" variant="outline" onClick={() => setShowAddModal(false)} className="cursor-pointer">Cancel</Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TravelJournal;
