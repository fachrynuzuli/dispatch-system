import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) => {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsAnimatingOut(false);
      document.body.style.overflow = 'hidden';
    } else if (shouldRender) {
      setIsAnimatingOut(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsAnimatingOut(false);
      }, 300); // Match duration-300
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      if (!isOpen) document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!shouldRender) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 transition-all duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}
      role="dialog" 
      aria-modal="true" 
      aria-labelledby="modal-title"
    >
      <div 
        className={`absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${isAnimatingOut ? 'opacity-0' : 'opacity-100'}`}
        onClick={onClose}
      />
      <div 
        ref={modalRef}
        className={`relative bg-white border border-slate-200 shadow-soft-xl w-full ${maxWidth} max-h-[90vh] flex flex-col transform transition-all duration-300 rounded-2xl ${
          isAnimatingOut 
            ? 'scale-95 opacity-0 translate-y-4' 
            : 'scale-100 opacity-100 translate-y-0 animate-in fade-in zoom-in-95 duration-300'
        }`}
      >
        <div className="flex items-center justify-between p-6 border-b border-slate-200 bg-white rounded-t-2xl">
          <h3 id="modal-title" className="text-xl font-display font-semibold text-slate-900 tracking-tight">{title}</h3>
          <button 
            aria-label="Close modal"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};