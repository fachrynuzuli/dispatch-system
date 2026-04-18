import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Wrench, ClipboardCheck, AlertCircle } from 'lucide-react';

export const MaintenanceCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  
  const nextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  const prevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1));

  // Mock some scheduled dates based on the current month being viewed
  const today = new Date();
  const isCurrentMonth = today.getMonth() === currentMonth && today.getFullYear() === currentYear;
  
  // Generate deterministic mock dates based on the month
  const maintenanceDate = (currentMonth * 7) % 28 + 1;
  const inspectionDate = (currentMonth * 13) % 28 + 1;

  const days = [];
  // Empty slots for days before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="h-10 w-10"></div>);
  }
  
  // Actual days
  for (let i = 1; i <= daysInMonth; i++) {
    const isToday = isCurrentMonth && i === today.getDate();
    const isMaintenance = i === maintenanceDate;
    const isInspection = i === inspectionDate && i !== maintenanceDate;
    
    days.push(
      <div 
        key={i} 
        className={`relative h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition-all cursor-pointer border
          ${isToday ? 'bg-slate-900 text-white border-slate-900 shadow-soft-sm' : 'text-slate-700 border-transparent hover:bg-slate-50'}
          ${isMaintenance && !isToday ? 'bg-rose-50 text-rose-700 border-rose-200' : ''}
          ${isInspection && !isToday ? 'bg-amber-50 text-amber-700 border-amber-200' : ''}
        `}
      >
        {i}
        {isMaintenance && (
          <div className="absolute -bottom-1 -right-1 bg-white text-rose-500 p-1 rounded-md shadow-soft-sm border border-slate-200">
            <Wrench className="w-3 h-3" />
          </div>
        )}
        {isInspection && (
          <div className="absolute -bottom-1 -right-1 bg-white text-amber-500 p-1 rounded-md shadow-soft-sm border border-slate-200">
            <ClipboardCheck className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-soft-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 border-b border-slate-200 pb-4">
        <h4 className="font-display font-semibold text-slate-900 text-lg tracking-tight">{monthNames[currentMonth]} {currentYear}</h4>
        <div className="flex gap-2">
          <button aria-label="Previous month" onClick={prevMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
          <button aria-label="Next month" onClick={nextMonth} className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors"><ChevronRight className="w-5 h-5" /></button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2 mb-4 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{day}</div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-y-4 gap-x-2 place-items-center flex-1 content-start">
        {days}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200 grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <div className="w-3 h-3 bg-slate-900 rounded-full"></div> Today
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <div className="w-3 h-3 bg-rose-100 border border-rose-200 rounded-full"></div> Maintenance
        </div>
        <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded-full"></div> Inspection
        </div>
      </div>
    </div>
  );
};
