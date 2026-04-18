import React from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel, SparePart } from '../types';
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

interface DashboardMidnightProps {
  trucks: TruckType[];
  drivers: Driver[];
  requests: DispatchRequest[];
  vessels: Vessel[];
  onNavigate: (view: string) => void;
}

/**
 * Midnight Theme Dashboard
 * Operations war room — dense data, dark glass panels, real-time feeds, monospace accents
 */
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

  const getTrend = (val: number, threshold: number): { icon: any; color: string } => {
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

  const bargeStatusColor = (status: string) => {
    if (status === 'done') return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    if (status === 'live') return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  };

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Dense Metric Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {metrics.map((m, i) => {
          const TrendIcon = m.icon;
          return (
            <div key={i} className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/60 transition-all group cursor-default">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">{m.label}</span>
                <TrendIcon className={`w-3.5 h-3.5 ${m.color}`} />
              </div>
              <p className="text-2xl font-mono font-bold text-slate-200 tracking-tight">{m.value}</p>
              <p className="text-[11px] text-slate-500 mt-1 font-mono">{m.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Truck Status Grid + Loading Rates + Delivery Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Truck Status Grid */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-slate-500" /> Fleet Status
            </h3>
            <button onClick={() => onNavigate('assets')} className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider">
              Detail →
            </button>
          </div>
          <div className="space-y-2 max-h-[280px] overflow-y-auto">
            {trucks.slice(0, 8).map((truck, i) => {
              const statusColor = truck.status === 'Available' ? 'bg-emerald-500' :
                truck.status === 'On Trip' ? 'bg-amber-500' :
                truck.status === 'Maintenance' ? 'bg-rose-500' : 'bg-slate-500';
              return (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-slate-800/50 hover:bg-slate-800/80 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${statusColor}`}></div>
                    <div>
                      <p className="text-xs font-mono text-slate-200 font-medium">{truck.plate}</p>
                      <p className="text-[10px] font-mono text-slate-500">{truck.model}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-mono text-slate-300">{truck.healthScore}%</p>
                    <p className="text-[10px] font-mono text-slate-600">{truck.status}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Loading Rate by Unit */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" /> Loading Rate
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Target: {LOADING_RATE_TARGET} t/h</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_LOADING_RATES_BY_UNIT} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px', border: '1px solid #334155',
                    backgroundColor: '#1e293b', fontSize: '11px',
                    fontFamily: 'JetBrains Mono', color: '#e2e8f0',
                  }}
                  formatter={(value: number) => [`${value} t/h`, 'Rate']}
                />
                <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {MOCK_LOADING_RATES_BY_UNIT.map((entry, i) => (
                    <Cell key={i} fill={entry.rate >= entry.target ? '#34d399' : '#f87171'} fillOpacity={0.8} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Delivery Trend */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Delivery Trend
            </h3>
            <span className="text-[10px] font-mono text-slate-500">10 Day</span>
          </div>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MOCK_DELIVERY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b', fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px', border: '1px solid #334155',
                    backgroundColor: '#1e293b', fontSize: '11px',
                    fontFamily: 'JetBrains Mono', color: '#e2e8f0',
                  }}
                />
                <Line type="monotone" dataKey="target" stroke="#475569" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                <Line type="monotone" dataKey="actual" stroke="#38bdf8" strokeWidth={2.5} dot={{ r: 3, fill: '#38bdf8' }} name="Actual" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Barge Operations Timeline */}
      <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <Ship className="w-4 h-4 text-blue-400" /> Barge Operations
          </h3>
          <button onClick={() => onNavigate('vessels')} className="text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider">
            Port Ops →
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-700/50">
                {['Barge', 'LP', 'Attach', 'Detach', 'Budget', 'Duration', 'Status'].map(h => (
                  <th key={h} className="text-[10px] font-mono text-slate-500 uppercase tracking-wider py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_BARGE_OPERATIONS.map((barge, i) => (
                <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-200 font-medium">{barge.name}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{barge.loadingPoint}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{barge.attachTime || '—'}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{barge.detachTime || '—'}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{barge.budgetDuration}</td>
                  <td className="py-2.5 px-3 text-xs font-mono text-slate-400">{barge.actualDuration || '—'}</td>
                  <td className="py-2.5 px-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-mono font-medium border ${bargeStatusColor(barge.status)}`}>
                      {barge.status === 'live' && <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse"></span>}
                      {barge.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Equipment Availability + Utilization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Availability */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Gauge className="w-4 h-4 text-emerald-400" /> Equipment Availability
          </h3>
          <div className="space-y-3">
            {MOCK_EQUIPMENT_AVAILABILITY.map((eq, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-xs font-mono text-slate-400 w-16">{eq.unit}</span>
                <div className="flex-1 h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-1000"
                    style={{
                      width: `${eq.availability}%`,
                      background: eq.availability >= 90 ? '#34d399' : eq.availability >= 80 ? '#fbbf24' : '#f87171',
                    }}
                  ></div>
                </div>
                <span className="text-xs font-mono text-slate-300 w-12 text-right">{eq.availability}%</span>
                <span className="text-[10px] font-mono text-slate-600 w-14 text-right">{eq.downtime}h ↓</span>
              </div>
            ))}
          </div>
        </div>

        {/* Utilization */}
        <div className="bg-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-xl p-5">
          <h3 className="text-sm font-mono font-semibold text-slate-300 uppercase tracking-wider mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Equipment Utilization
          </h3>
          <div className="space-y-3">
            {MOCK_EQUIPMENT_UTILIZATION.map((eq, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-slate-400">{eq.unit}</span>
                  <span className="text-xs font-mono text-slate-300">{eq.utilization}% — {eq.workingHours}h / {eq.availableHours}h</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
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
        </div>
      </div>
    </div>
  );
};
