import React, { useState, useEffect } from 'react';
import { Sparkles, X, Send, Bot, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { askFleetAssistant } from '../services/geminiService';

interface GeminiAssistantProps {
  contextData: string;
}

export const GeminiAssistant: React.FC<GeminiAssistantProps> = ({ contextData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hi! I can help you analyze fleet performance or answer questions about specific trucks.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setInput('');
    setIsTyping(true);

    const aiResponse = await askFleetAssistant(userMsg, contextData);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse }]);
    setIsTyping(false);
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none`}>
      {/* Chat Window */}
      {isOpen && (
        <div className="pointer-events-auto w-[360px] h-[500px] mb-4 bg-white rounded-2xl shadow-soft-xl border border-slate-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 fade-in duration-200">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-brand-600 to-brand-500 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-200" />
              <span className="font-semibold">Gemini Intelligence</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user' 
                    ? 'bg-brand-600 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input 
              className="flex-1 px-4 py-2 bg-slate-50 rounded-xl border-none focus:ring-2 focus:ring-brand-500/20 text-sm outline-none"
              placeholder="Ask about your fleet..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto bg-brand-600 hover:bg-brand-500 text-white p-4 rounded-full shadow-lg shadow-brand-500/30 transition-all hover:scale-105 active:scale-95 group flex items-center gap-2"
      >
        <div className="relative">
          <Sparkles className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
          </span>
        </div>
        {!isOpen && <span className="font-medium pr-1">Ask AI</span>}
      </button>
    </div>
  );
};
