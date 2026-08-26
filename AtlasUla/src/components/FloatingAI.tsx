import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { getAIChatResponse, isGeminiConfigured } from '../gemini';
import { useAuth } from '../context/AuthContext';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Trip } from '../types';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export const FloatingAI: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: "Hi! I'm Atlas, your AI Travel Companion. ✈️\n\nAsk me anything about your trip, packing advice, local tips, or budget summaries!",
      sender: 'ai',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeTrip, setActiveTrip] = useState<Trip | undefined>(undefined);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load user trips to provide active context to Gemini
  useEffect(() => {
    if (user) {
      const storedTrips = localStorage.getItem('atlasula_trips');
      if (storedTrips) {
        try {
          const trips: Trip[] = JSON.parse(storedTrips);
          if (trips.length > 0) {
            // Find most recent or upcoming trip
            setActiveTrip(trips[0]);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [user, isOpen]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!user) return null;

  const quickPrompts = [
    'What should I pack?',
    'How do I save budget?',
    'Suggest restaurants',
    'Travel safety tips',
    'Summarize my trip'
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      text: textToSend,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const context = activeTrip 
        ? { destination: activeTrip.destination, activeTrip } 
        : undefined;

      const aiResponseText = await getAIChatResponse(textToSend, context);
      
      const aiMsg: Message = {
        id: Math.random().toString(),
        text: aiResponseText,
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error(error);
      const errorMsg: Message = {
        id: Math.random().toString(),
        text: 'Sorry, I ran into an error connecting to my core brain. Please try again.',
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-20 right-4 lg:bottom-6 lg:right-6 w-14 h-14 rounded-full bg-gradient-to-r from-primary to-accent hover:from-primary-light hover:to-accent-light flex items-center justify-center text-white shadow-xl glow-primary hover:scale-105 transition-all duration-300 z-40 group cursor-pointer"
        aria-label="AI Travel Assistant"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <div className="relative">
            <MessageSquare className="w-6 h-6" />
            <Sparkles className="w-3.5 h-3.5 absolute -top-1.5 -right-1.5 text-white animate-pulse-glow" />
          </div>
        )}
      </button>

      {/* Chat Container */}
      {isOpen && (
        <div className="fixed bottom-[92px] right-4 lg:bottom-24 lg:right-6 w-[calc(100vw-32px)] sm:w-[380px] h-[500px] glass-card rounded-2xl flex flex-col z-40 shadow-2xl overflow-hidden border border-white/10 animate-float">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/20 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Sparkles className="w-4 h-4 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold text-sm font-sora">Atlas AI</h3>
                <p className="text-[10px] text-accent font-medium">Your Travel Companion</p>
              </div>
            </div>
            
            {activeTrip && (
              <span className="text-[10px] bg-white/5 px-2.5 py-1 rounded-full border border-white/5 font-medium max-w-[150px] truncate text-textSecondary">
                📍 {activeTrip.destination}
              </span>
            )}
          </div>

          {/* API Info Banner if missing */}
          {!isGeminiConfigured && (
            <div className="px-3 py-1.5 bg-warning/10 border-b border-warning/20 text-[10px] text-warning flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>Running in Demo Mode (Simulated responses).</span>
            </div>
          )}

          {/* Messages Thread */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap ${
                    msg.sender === 'user'
                      ? 'bg-primary text-white rounded-tr-none shadow-glass-sm'
                      : 'bg-white/5 text-textSecondary rounded-tl-none border border-white/5'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Loading Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white/5 text-textSecondary rounded-2xl rounded-tl-none border border-white/5 px-4 py-3 flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 rounded-full bg-accent animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5 shrink-0">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSend(prompt)}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs text-textSecondary hover:bg-primary/20 hover:text-white hover:border-primary/40 whitespace-nowrap transition-all duration-200 shrink-0 cursor-pointer"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(input);
            }}
            className="p-3 border-t border-white/5 flex gap-2 items-center bg-card/45 shrink-0"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask Atlas about your trips..."
              className="flex-1 glass-input rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              type="submit"
              disabled={!input.trim()}
              className="w-10 h-10 rounded-xl bg-primary hover:bg-primary-light disabled:bg-white/5 disabled:text-textSecondary/40 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default FloatingAI;
