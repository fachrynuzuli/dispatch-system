import React from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel, SparePart } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Truck, Activity, Anchor, Ship, Gauge, ArrowUpRight, ArrowDownRight, Minus, Clock, Zap, AlertTriangle } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import {
  MOCK_EQUIPMENT_AVAILABILITY,
  MOCK_EQUIPMENT_UTILIZATION,
  MOCK_BARGE_OPERATIONS,
  MOCK_DELIVERY_TREND,
  DAILY_ACTUAL,
  MTD_ACTUAL_BASE,
  MOCK_LOADING_RATES_BY_UNIT,
  LOADING_RATE_TARGET,
} from '../services/portMockData';
import { cn } from '@/lib/utils';

interface DashboardMidnightProps {
  trucks: TruckType[];
  drivers: Driver[];
  requests: DispatchRequest[];
  vessels: Vessel[];
  onNavigate: (view: string) => void;
}

export const DashboardMidnight: React.FC<DashboardMidnightProps> = ({
  trucks, drivers, requests, vessels, onNavigate,
}) => {
  const activeTrucks = trucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length;
  const maintenanceTrucks = trucks.filter(t => t.status === 'Maintenance').length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const restingDrivers = drivers.filter(d => d.status === 'Resting').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const completedRequests = requests.filter(r => r.status === 'Completed').length;
  const avgHealth = trucks.length > 0 ? (trucks.reduce((sum, t) => sum + t.healthScore, 0) / trucks.length).toFixed(1) : '0';
  const avgAvailability = (MOCK_EQUIPMENT_AVAILABILITY.reduce((s, e) => s + e.availability, 0) / MOCK_EQUIPMENT_AVAILABILITY.length).toFixed(1);
  const avgUtil = (MOCK_EQUIPMENT_UTILIZATION.reduce((s, e) => s + e.utilization, 0) / MOCK_EQUIPMENT_UTILIZATION.length).toFixed(0);

  const getTrend = (val: number, threshold: number) => {
    if (val >= threshold) return { icon: ArrowUpRight, color: 'text-emerald-400' };
    if (val >= threshold * 0.9) return { icon: Minus, color: 'text-amber-400' };
    return { icon: ArrowDownRight, color: 'text-rose-400' };
  };

  const metrics = [
    { label: 'TRUCKS ONLINE', value: `${activeTrucks}/${trucks.length}`, sub: `${maintenanceTrucks} in workshop`, ...getTrend(activeTrucks / trucks.length * 100, 70) },
    { label: 'DRIVERS READY', value: `${availableDrivers}`, sub: `${restingDrivers} resting`, ...getTrend(availableDrivers, 4) },
    { label: 'EQUIPMENT AVAIL', value: `${avgAvailability}%`, sub: `${MOCK_EQUIPMENT_AVAILABILITY.length} monitored`, ...getTrend(parseFloat(avgAvailability), 90) },
    { label: 'UTILIZATION', value: `${avgUtil}%`, sub: 'Avg across units', ...getTrend(parseInt(avgUtil), 70) },
    { label: 'FLEET HEALTH', value: avgHealth, sub: 'Avg Score /100', ...getTrend(parseFloat(avgHealth), 85) },
    { label: 'PENDING DISPATCH', value: pendingRequests.toString(), sub: `${completedRequests} completed`, ...getTrend(100 - pendingRequests * 10, 70) },
  ];

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700 font-mono">
      {/* 1. Dense Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => {
          const TrendIcon = m.icon;
          return (
            <Card key={i} className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50 hover:border-slate-600/60 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest">{m.label}</span>
                  <TrendIcon className={cn("w-3.5 h-3.5", m.color)} />
                </div>
                <p className="text-2xl font-bold text-slate-100 tracking-tight">{m.value}</p>
                <p className="text-[11px] text-slate-500 mt-1">{m.sub}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. Primary Operations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* Fleet Status */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-500" /> Fleet Status
            </CardTitle>
            <button onClick={() => onNavigate('assets')} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase">Detail →</button>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
              {trucks.slice(0, 8).map((truck, i) => {
                const statusColor = truck.status === 'Available' ? 'bg-emerald-500' :
                  truck.status === 'On Trip' ? 'bg-amber-500' :
                  truck.status === 'Maintenance' ? 'bg-rose-500' : 'bg-slate-500';
                return (
                  <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/40 hover:bg-slate-800/80 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={cn("w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,0,0,0.5)]", statusColor)}></div>
                      <div>
                        <p className="text-xs text-slate-200 font-medium">{truck.plate}</p>
                        <p className="text-[10px] text-slate-500">{truck.model}</p>
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <p className="text-xs text-slate-300">{truck.healthScore}%</p>
                      <Badge variant="outline" className="mt-1 h-4 px-1.5 text-[9px] text-slate-400 border-slate-700/50">{truck.status}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Loading Rate */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Loading Rate
            </CardTitle>
            <span className="text-[10px] text-slate-500">Target: {LOADING_RATE_TARGET} t/h</span>
          </CardHeader>
          <CardContent className="px-4 pb-4 h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_LOADING_RATES_BY_UNIT} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#e2e8f0' }}
                  formatter={(value: number) => [`${value} t/h`, 'Rate']}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {MOCK_LOADING_RATES_BY_UNIT.map((entry, i) => (
                    <Cell key={i} fill={entry.rate >= entry.target ? '#34d399' : '#f87171'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Delivery Trend */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" /> Delivery Trend
            </CardTitle>
            <span className="text-[10px] text-slate-500">10 Day</span>
          </CardHeader>
          <CardContent className="px-4 pb-4 h-[250px]">
             <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DELIVERY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#1e293b', fontSize: '11px', fontFamily: 'JetBrains Mono', color: '#e2e8f0' }} />
                <Line type="monotone" dataKey="target" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 3. Barge Operations Timeline */}
      <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
        <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-5">
           <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Ship className="w-4 h-4 text-indigo-400" /> Barge Operations
          </CardTitle>
          <button onClick={() => onNavigate('vessels')} className="text-[10px] text-slate-500 hover:text-slate-300 transition-colors uppercase">Port Ops →</button>
        </CardHeader>
        <CardContent className="px-5 pb-5 overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50">
                {['Barge', 'LP', 'Attach', 'Detach', 'Budget', 'Duration', 'Status'].map(h => (
                  <th key={h} className="text-[10px] text-slate-500 uppercase tracking-wider py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_BARGE_OPERATIONS.map((barge, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-xs text-slate-200 font-medium">{barge.name}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{barge.loadingPoint}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{barge.attachTime || '—'}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{barge.detachTime || '—'}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{barge.budgetDuration}</td>
                  <td className="py-2.5 px-3 text-xs text-slate-400">{barge.actualDuration || '—'}</td>
                  <td className="py-2.5 px-3">
                    <Badge variant={barge.status === 'live' ? 'default' : barge.status === 'done' ? 'secondary' : 'outline'} 
                           className={cn(
                             "text-[9px] uppercase shadow-none font-medium h-5",
                             barge.status === 'live' && "bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border-none",
                             barge.status === 'done' && "bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 border-none",
                             barge.status === 'pending' && "text-slate-400 border-slate-600/50"
                           )}>
                      {barge.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>}
                      {barge.status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* 4. Equipment Availability + Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Availability */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Gauge className="w-4 h-4 text-emerald-400" /> Equipment Availability
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {MOCK_EQUIPMENT_AVAILABILITY.map((eq, i) => (
                <div key={i} className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 w-16">{eq.unit}</span>
                  <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${eq.availability}%`,
                        background: eq.availability >= 90 ? '#34d399' : eq.availability >= 80 ? '#fbbf24' : '#f87171',
                      }}
                    ></div>
                  </div>
                  <span className="text-xs text-slate-300 w-12 text-right">{eq.availability}%</span>
                  <span className="text-[10px] text-slate-500 w-14 text-right flex items-center justify-end gap-1">
                    <ArrowDownRight className="w-3 h-3 text-rose-400/70" /> {eq.downtime}h
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Utilization */}
        <Card className="bg-slate-900/60 backdrop-blur-sm border-slate-700/50">
          <CardHeader className="pb-4 pt-5 px-5">
            <CardTitle className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" /> Equipment Utilization
            </CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            <div className="space-y-4">
              {MOCK_EQUIPMENT_UTILIZATION.map((eq, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-slate-400">{eq.unit}</span>
                    <span className="text-[10px] text-slate-400">{eq.utilization}% <span className="text-slate-600 px-1">|</span> {eq.workingHours}h / {eq.availableHours}h</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${eq.utilization}%`,
                        background: `linear-gradient(90deg, #38bdf8, ${eq.utilization >= 75 ? '#818cf8' : '#64748b'})`,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};
