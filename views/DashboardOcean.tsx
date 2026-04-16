import React, { useState } from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel, SparePart } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { TrendingUp, TrendingDown, Droplets, Activity, BarChart3, Ship, Fuel, ArrowRight, Layers } from 'lucide-react';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
  BarChart, Bar, Cell, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ComposedChart, Line, CartesianGrid, Legend,
} from 'recharts';
import {
  MOCK_DELIVERY_TREND,
  MOCK_LOADING_RATES_BY_UNIT,
  MOCK_LOADING_RATES_BY_OPERATOR,
  MOCK_LOADING_RATES_BY_WOOD,
  LOADING_RATE_TARGET,
  MOCK_FUEL_BY_UNIT,
  MOCK_FUEL_BY_OPERATOR,
  FUEL_EFFICIENCY_TARGET,
  MOCK_EQUIPMENT_UTILIZATION,
  MOCK_STACK_LOADING,
  MOCK_WOOD_SPECIES,
  DAILY_ACTUAL,
  MTD_ACTUAL_BASE,
  CHART_COLORS,
} from '../services/portMockData';

interface DashboardOceanProps {
  trucks: TruckType[];
  drivers: Driver[];
  requests: DispatchRequest[];
  vessels: Vessel[];
  onNavigate: (view: string) => void;
}

/**
 * Ocean Theme Dashboard
 * Analytics dashboard — chart-heavy, gradient cards, focus on trends and predictions
 */
export const DashboardOcean: React.FC<DashboardOceanProps> = ({
  trucks, drivers, requests, vessels, onNavigate,
}) => {
  const [loadingRateView, setLoadingRateView] = useState<'unit' | 'operator' | 'wood'>('unit');
  const [fuelView, setFuelView] = useState<'unit' | 'operator'>('unit');

  const activeTrucks = trucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const avgHealth = trucks.length > 0 ? (trucks.reduce((sum, t) => sum + t.healthScore, 0) / trucks.length).toFixed(1) : '0';
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;

  const loadingRateData = loadingRateView === 'unit' ? MOCK_LOADING_RATES_BY_UNIT :
    loadingRateView === 'operator' ? MOCK_LOADING_RATES_BY_OPERATOR.slice(0, 8) :
    MOCK_LOADING_RATES_BY_WOOD;

  const fuelData = fuelView === 'unit' ? MOCK_FUEL_BY_UNIT : MOCK_FUEL_BY_OPERATOR.slice(0, 8);

  // Radar data from equipment utilization
  const radarData = MOCK_EQUIPMENT_UTILIZATION.map(e => ({
    subject: e.unit,
    utilization: e.utilization,
    availability: (e.workingHours / e.availableHours) * 100,
  }));

  const stats = [
    { label: 'Active Fleet', value: `${activeTrucks}`, sub: `of ${trucks.length} total`, icon: Activity, gradient: 'from-sky-400 to-blue-600', trend: '+2 today', up: true },
    { label: 'Drivers Ready', value: `${availableDrivers}`, sub: 'Available now', icon: TrendingUp, gradient: 'from-cyan-400 to-teal-500', trend: 'Stable', up: true },
    { label: 'Daily Output', value: `${(DAILY_ACTUAL / 1000).toFixed(1)}k`, sub: 'Tonnes processed', icon: BarChart3, gradient: 'from-blue-400 to-indigo-500', trend: `MTD: ${(MTD_ACTUAL_BASE / 1000).toFixed(0)}k`, up: true },
    { label: 'Fleet Health', value: avgHealth, sub: 'Average score', icon: Droplets, gradient: 'from-emerald-400 to-cyan-500', trend: parseFloat(avgHealth) >= 90 ? 'Excellent' : 'Good', up: parseFloat(avgHealth) >= 85 },
  ];

  const ViewToggle = ({ options, active, onChange }: { options: { key: string; label: string }[]; active: string; onChange: (key: string) => void }) => (
    <div className="flex bg-sky-50 rounded-lg p-0.5 border border-sky-100">
      {options.map(o => (
        <button
          key={o.key}
          onClick={() => onChange(o.key)}
          className={`px-3 py-1 rounded-md text-[11px] font-medium transition-all ${
            active === o.key ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Gradient Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={i} className="relative overflow-hidden rounded-2xl p-5 text-white cursor-default group hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl">
              <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient}`}></div>
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <Icon className="w-5 h-5 text-white/80" />
                  <div className={`flex items-center gap-1 text-[11px] font-medium ${s.up ? 'text-white/90' : 'text-white/70'}`}>
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.trend}
                  </div>
                </div>
                <p className="text-3xl font-display font-bold tracking-tight">{s.value}</p>
                <p className="text-sm text-white/70 mt-1">{s.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delivery Trend (Full Width) */}
      <Card className="bg-white border-sky-100">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <Activity className="w-5 h-5 text-sky-500" /> Delivery Trend
            </h3>
            <span className="text-xs text-slate-400 bg-sky-50 px-3 py-1 rounded-full font-medium">Last 10 Days</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DELIVERY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="oceanTarget" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#94a3b8" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="oceanActual" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '12px', border: '1px solid #e0f2fe',
                    boxShadow: '0 4px 12px rgba(14,165,233,0.1)', backgroundColor: '#fff',
                    fontSize: '12px', fontFamily: 'Albert Sans',
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} t`, '']}
                />
                <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" fill="url(#oceanTarget)" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#oceanActual)" name="Actual" dot={{ r: 3, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Loading Rates + Fuel Efficiency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loading Rates */}
        <Card className="bg-white border-sky-100">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-500" /> Loading Rate
              </h3>
              <ViewToggle
                options={[{ key: 'unit', label: 'Unit' }, { key: 'operator', label: 'Operator' }, { key: 'wood', label: 'Wood Type' }]}
                active={loadingRateView}
                onChange={(k) => setLoadingRateView(k as any)}
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={loadingRateData} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px', border: '1px solid #e0f2fe',
                      backgroundColor: '#fff', fontSize: '11px', fontFamily: 'Albert Sans',
                    }}
                    formatter={(value: number) => [`${value} t/h`, '']}
                  />
                  <Bar dataKey="rate" radius={[6, 6, 0, 0]} maxBarSize={35} name="Rate">
                    {loadingRateData.map((entry, i) => (
                      <Cell key={i} fill={entry.rate >= entry.target ? '#0ea5e9' : '#f97316'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Fuel Efficiency */}
        <Card className="bg-white border-sky-100">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <Fuel className="w-5 h-5 text-emerald-500" /> Fuel Efficiency
              </h3>
              <ViewToggle
                options={[{ key: 'unit', label: 'Unit' }, { key: 'operator', label: 'Operator' }]}
                active={fuelView}
                onChange={(k) => setFuelView(k as any)}
              />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={fuelData} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f9ff" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} domain={[0.10, 0.20]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '10px', border: '1px solid #e0f2fe',
                      backgroundColor: '#fff', fontSize: '11px', fontFamily: 'Albert Sans',
                    }}
                    formatter={(value: number) => [`${value.toFixed(3)} L/t`, '']}
                  />
                  <Bar dataKey="efficiency" radius={[6, 6, 0, 0]} maxBarSize={35} name="Efficiency">
                    {fuelData.map((entry, i) => (
                      <Cell key={i} fill={entry.efficiency <= entry.target ? '#10b981' : '#f97316'} fillOpacity={0.85} />
                    ))}
                  </Bar>
                  <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Target" />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Equipment Radar + Stack Loading + Wood Species */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Equipment Utilization Radar */}
        <Card className="bg-white border-sky-100">
          <CardContent className="h-full flex flex-col">
            <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight mb-2 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-500" /> Equipment Profile
            </h3>
            <div className="flex-1 min-h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="#e0f2fe" />
                  <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 100]} />
                  <Radar name="Utilization" dataKey="utilization" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} strokeWidth={2} />
                  <Radar name="Work Ratio" dataKey="availability" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                  <Legend iconType="circle" formatter={(value) => <span className="text-slate-600 text-xs font-medium ml-1">{value}</span>} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Stack Loading Time */}
        <Card className="bg-white border-sky-100">
          <CardContent>
            <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-amber-500" /> Loading Time by Stack
            </h3>
            <div className="space-y-4">
              {MOCK_STACK_LOADING.map((stack, i) => {
                const timeMinutes = parseInt(stack.avgTime.split(':')[1]);
                const maxTime = 35;
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium text-slate-700">{stack.stackType}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400">{stack.trips} trips</span>
                        <span className="text-sm font-semibold text-slate-900">{stack.avgTime}</span>
                      </div>
                    </div>
                    <div className="h-3 bg-sky-50 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${(timeMinutes / maxTime) * 100}%`,
                          background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}, ${CHART_COLORS[(i + 1) % CHART_COLORS.length]})`,
                        }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Wood Species */}
        <Card className="bg-white border-sky-100">
          <CardContent>
            <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight mb-4 flex items-center gap-2">
              <Ship className="w-5 h-5 text-teal-500" /> Wood Species Mix
            </h3>
            <div className="space-y-4">
              {MOCK_WOOD_SPECIES.map((species, i) => (
                <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-gradient-to-r from-sky-50/50 to-transparent border border-sky-100/50">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                    {species.percentage}%
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{species.code}</p>
                    <p className="text-xs text-slate-500">{species.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{species.tonnage.toLocaleString()}</p>
                    <p className="text-xs text-slate-400">tonnes</p>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('vessels')}
              className="mt-4 w-full py-2.5 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-xl font-semibold text-sm hover:from-sky-600 hover:to-blue-700 transition-all active:scale-[0.98] shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              Port Operations <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
