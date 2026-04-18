import React, { useState } from 'react';
import { Driver } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { SearchFilter } from '../components/ui/SearchFilter';
import { User, Shield, Clock, AlertTriangle } from 'lucide-react';

interface DriversViewProps {
  drivers: Driver[];
}

export const DriversView: React.FC<DriversViewProps> = ({ drivers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [fatigueFilter, setFatigueFilter] = useState('All');

  const getFatigueColor = (level: string) => {
    switch (level) {
      case 'Low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      default: return 'text-slate-600';
    }
  };

  const highFatigueCount = drivers.filter(d => d.fatigueLevel === 'High').length;

  const filteredDrivers = drivers.filter(d => {
    const matchesSearch = d.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFatigue = fatigueFilter === 'All' || d.fatigueLevel === fatigueFilter;
    return matchesSearch && matchesFatigue;
  });

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-2xl font-display font-semibold tracking-tight text-slate-900">Driver Workforce</h2>
           <p className="text-sm text-slate-500 mt-1">Safety, fatigue and certification management</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchFilter
             searchTerm={searchTerm}
             onSearchChange={setSearchTerm}
             activeFilter={fatigueFilter}
             onFilterChange={setFatigueFilter}
             placeholder="Search drivers..."
             filterOptions={[
                { label: 'Low Fatigue', value: 'Low' },
                { label: 'Medium Fatigue', value: 'Medium' },
                { label: 'High Fatigue', value: 'High' }
             ]}
          />
        </div>
      </div>

      {/* Alert Banner */}
      {highFatigueCount > 0 && (
          <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl flex items-center gap-3 text-rose-800 animate-in slide-in-from-top-2">
            <div className="p-2 bg-rose-100 rounded-full">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
            </div>
            <div>
                <p className="font-bold">Safety Alert: {highFatigueCount} Drivers exceed fatigue limits</p>
                <p className="text-sm text-rose-600">Consider resting these drivers before next assignment.</p>
            </div>
          </div>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2">
            <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span className="text-sm font-medium text-slate-700">{drivers.filter(d => d.status === 'Available').length} Ready</span>
            </div>
             <div className="bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm flex items-center gap-2 whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span className="text-sm font-medium text-slate-700">{highFatigueCount} High Fatigue</span>
            </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDrivers.map(driver => (
          <Card key={driver.id} className={`group hover:border-brand-200 transition-all ${driver.fatigueLevel === 'High' ? 'border-rose-100 bg-rose-50/10' : ''}`}>
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors relative">
                    <User className="w-6 h-6" />
                    {driver.fatigueLevel === 'High' && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-white animate-pulse"></span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900 leading-tight">{driver.name}</h4>
                    <span className="text-xs text-slate-500">{driver.licenseClass}</span>
                  </div>
                </div>
                <Badge variant={driver.status === 'Available' ? 'success' : driver.status === 'On Trip' ? 'info' : 'neutral'}>
                  {driver.status}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Shield className="w-3.5 h-3.5" /> Safety Score
                    </div>
                    <span className={`font-bold text-sm ${driver.safetyScore > 80 ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {driver.safetyScore}/100
                    </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className={`p-2 rounded-lg border text-center ${getFatigueColor(driver.fatigueLevel)}`}>
                        <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wide mb-0.5 opacity-80">
                            <AlertTriangle className="w-3 h-3" /> Fatigue
                        </div>
                        <span className="font-semibold text-sm">{driver.fatigueLevel}</span>
                    </div>
                     <div className="p-2 rounded-lg border border-slate-100 bg-white text-center text-slate-600">
                        <div className="flex items-center justify-center gap-1 text-[10px] uppercase font-bold tracking-wide mb-0.5 opacity-80 text-slate-400">
                            <Clock className="w-3 h-3" /> Exp
                        </div>
                        <span className="font-semibold text-sm">{driver.yearsExperience} yrs</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-2">
                    {driver.certifications.map(cert => (
                        <span key={cert} className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-brand-50 text-brand-700 border border-brand-100">
                            {cert}
                        </span>
                    ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredDrivers.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">No drivers found.</div>
        )}
      </div>
    </div>
  );
};