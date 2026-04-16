import React, { useState, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { Sparkles, X, Send, Bot, ChevronUp } from 'lucide-react';
import { Button } from './ui/Button';
import { askFleetAssistant } from '../services/openRouterService';

const ClippyIcon = ({ className }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    {/* Paperclip wire (vertical) */}
    <path d="M8 7v10a4 4 0 0 0 8 0V5a6 6 0 0 0-12 0v12a8 8 0 0 0 16 0V8" />
    
    {/* Eyes */}
    <circle cx="10" cy="8" r="2" fill="white" stroke="currentColor" strokeWidth="1" />
    <circle cx="14" cy="8" r="2" fill="white" stroke="currentColor" strokeWidth="1" />
    
    {/* Pupils */}
    <circle cx="10.5" cy="8" r="0.75" fill="currentColor" stroke="none" />
    <circle cx="13.5" cy="8" r="0.75" fill="currentColor" stroke="none" />
  </svg>
);

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

  // Dragging State
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [hasMoved, setHasMoved] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isInitialized, setIsInitialized] = useState(false);
  const [dockSide, setDockSide] = useState<'left' | 'right'>('right');

  useEffect(() => {
    const padding = 24;
    const btnSize = 64;
    setPosition({ 
      x: window.innerWidth - btnSize - padding, 
      y: window.innerHeight - btnSize - padding 
    });
    setIsInitialized(true);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    setHasMoved(false);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setHasMoved(true);
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
    
    const btnSize = 64;
    const padding = 24;
    let newX = position.x;
    let newY = position.y;
    
    if (position.x + btnSize / 2 < window.innerWidth / 2) {
      newX = padding;
      setDockSide('left');
    } else {
      newX = window.innerWidth - btnSize - padding;
      setDockSide('right');
    }
    
    newY = Math.max(padding, Math.min(newY, window.innerHeight - btnSize - padding));
    setPosition({ x: newX, y: newY });
  };

  const handleClick = () => {
    if (!hasMoved) {
      setIsOpen(!isOpen);
    }
  };

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

  if (!isInitialized) return null;

  return (
    <div className="fixed inset-0 z-50 pointer-events-none">
      {/* Chat Window */}
      {isOpen && (
        <div className={`absolute bottom-24 pointer-events-auto w-[360px] h-[500px] bg-white rounded-2xl shadow-soft-xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in duration-200 ${dockSide === 'left' ? 'left-6 slide-in-from-bottom-5' : 'right-6 slide-in-from-bottom-5'}`}>
          {/* Header */}
          <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-brand-600" />
              <span className="font-semibold text-slate-900">Gemini Intelligence</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user' 
                    ? 'bg-slate-900 text-white rounded-br-none' 
                    : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-soft-sm markdown-body prose prose-sm max-w-none'
                }`}>
                  {m.role === 'ai' ? <Markdown>{m.text}</Markdown> : m.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-soft-sm flex gap-1">
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-75"></span>
                  <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-150"></span>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 bg-white border-t border-slate-200 flex gap-2">
            <input 
              className="flex-1 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200 focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 text-sm outline-none transition-all"
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
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onClick={handleClick}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          transition: isDragging ? 'none' : 'left 0.4s cubic-bezier(0.25, 1, 0.5, 1), top 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
          touchAction: 'none'
        }}
        className="absolute pointer-events-auto bg-slate-900 text-white rounded-full breathing-btn flex items-center justify-center w-16 h-16 cursor-grab active:cursor-grabbing"
      >
        <ClippyIcon className="w-8 h-8 text-brand-400" />
      </button>
    </div>
  );
};
