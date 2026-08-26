import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from './UI';
import { MessageSquare, X, Send, Sparkles, SendHorizontal } from 'lucide-react';
import { chatService, tripService } from '../services/api';
import { Trip } from '../types';

export const FloatingAI: React.FC = () => {
  const { user } = useAuth();
  
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([
    { role: 'assistant', content: "Hey! ✈️ I'm **Atlas**, your AI Travel Companion. Ask me anything about transit, weather, budget splits, packing checklists, or local scams!" }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTrip, setActiveTrip] = useState<Trip | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isOpen]);

  // Load active trip context for AI assistant
  useEffect(() => {
    const loadActiveTrip = async () => {
      if (user) {
        try {
          const trips = await tripService.getTrips();
          if (trips.length > 0) {
            // Sort by startDate
            const sorted = [...trips].sort(
              (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
            );
            setActiveTrip(sorted[0]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    };
    if (isOpen) {
      loadActiveTrip();
    }
  }, [isOpen, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loading) return;

    const userMsg = inputValue.trim();
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputValue('');
    setLoading(true);

    try {
      const response = await chatService.sendMessage(userMsg, {
        destination: activeTrip?.destination,
        activeTrip: activeTrip
          ? {
              destination: activeTrip.destination,
              days: activeTrip.days,
              budgetTier: activeTrip.budgetTier,
              travelStyle: activeTrip.travelStyle,
              interests: activeTrip.interests,
            }
          : undefined,
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: "⚠️ Sorry, my communication link was interrupted. Check your network or make sure the Express backend server is launched." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed bottom-24 lg:bottom-6 right-6 z-40 select-none">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-12 h-12 rounded-full bg-gradient-to-tr from-primary to-accent border border-primary/30 flex items-center justify-center text-white glow-primary hover:scale-105 transition-all shadow-xl cursor-pointer"
        >
          <MessageSquare className="w-5 h-5 animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card 
          variant="glass" 
          className="w-[340px] sm:w-[380px] h-[480px] border-white/10 flex flex-col justify-between overflow-hidden shadow-2xl animate-float p-0 bg-background/95"
        >
          {/* Header */}
          <div className="flex justify-between items-center px-4 py-3 bg-white/5 border-b border-white/5 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center"><Sparkles className="w-3.5 h-3.5 text-white" /></div>
              <h3 className="text-xs font-bold text-white font-sora">Atlas Assistant</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-textSecondary hover:text-white p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Logs */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 no-scrollbar">
            {messages.map((msg, idx) => {
              const isUser = msg.role === 'user';
              return (
                <div key={idx} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed ${
                    isUser 
                      ? 'bg-primary text-white rounded-tr-none font-medium' 
                      : 'bg-white/5 border border-white/5 text-textSecondary rounded-tl-none'
                  }`}>
                    {/* Simple markdown parsing helper for bolding **text** */}
                    {msg.content.split('**').map((part, i) => 
                      i % 2 === 1 ? <strong key={i} className="text-white font-bold">{part}</strong> : part
                    )}
                  </div>
                </div>
              );
            })}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/5 border border-white/5 rounded-2xl rounded-tl-none px-3.5 py-2 text-xs text-textSecondary/60 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-textSecondary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer Form */}
          <form onSubmit={handleSendMessage} className="p-3 border-t border-white/5 bg-white/5 flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask Atlas about transit, weather..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-grow bg-background/50 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-primary font-medium"
            />
            <button
              type="submit"
              className="w-9 h-9 rounded-xl bg-primary hover:bg-primary-dark transition-colors text-white flex items-center justify-center cursor-pointer shrink-0"
            >
              <SendHorizontal className="w-4 h-4" />
            </button>
          </form>
        </Card>
      )}
    </div>
  );
};

export default FloatingAI;
