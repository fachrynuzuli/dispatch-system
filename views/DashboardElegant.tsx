import React from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel, SparePart } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { HealthDistributionChart } from '../components/HealthDistributionChart';
import { Truck, CheckCircle, Clock, AlertTriangle, ClipboardCheck, Ship, Anchor, ArrowRight, Fuel, TreePine } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import {
  MOCK_DELIVERY_TREND,
  MOCK_WOOD_SPECIES,
  MOCK_BARGE_OPERATIONS,
  DAILY_ACTUAL,
  MTD_ACTUAL_BASE,
} from '../services/portMockData';

interface DashboardElegantProps {
  trucks: TruckType[];
  drivers: Driver[];
  requests: DispatchRequest[];
  vessels: Vessel[];
  onNavigate: (view: string) => void;
}

/**
 * Elegant Claude Theme Dashboard
 * Executive command center — editorial layout, serif headlines, warm data viz
 */
export const DashboardElegant: React.FC<DashboardElegantProps> = ({
  trucks, drivers, requests, vessels, onNavigate,
}) => {
  const activeTrucks = trucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const pendingRequests = requests.filter(r => r.status === 'Pending').length;
  const avgHealth = trucks.length > 0 ? (trucks.reduce((sum, t) => sum + t.healthScore, 0) / trucks.length).toFixed(1) : '0';
  const liveBarge = MOCK_BARGE_OPERATIONS.filter(b => b.status === 'live');

  const recentActivities = [
    { title: 'Trip Finished: RTP0231', desc: 'Delivered 140t Wood to Alpha Port', time: '10 mins ago', icon: CheckCircle, color: 'text-emerald-500' },
    { title: 'Delay Alert: BDP1102', desc: 'Stuck at South District access road (Traffic)', time: '45 mins ago', icon: Clock, color: 'text-amber-500' },
    { title: 'Accident Report: RMP4005', desc: 'Minor scrape at Workshop Yard B', time: '2 hours ago', icon: AlertTriangle, color: 'text-rose-500' },
    { title: 'Inspection Passed: RTP0550', desc: 'Ready for dispatch (Heavy Haul)', time: '3 hours ago', icon: ClipboardCheck, color: 'text-brand-500' },
  ];

  const woodColors = ['#D97757', '#a34729', '#e8cfc4'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Trucks', value: activeTrucks, sub: `/ ${trucks.length} Total`, color: 'text-brand-600' },
          { label: 'Active Drivers', value: availableDrivers, sub: 'Ready for Dispatch', color: 'text-slate-900' },
          { label: 'Daily Throughput', value: DAILY_ACTUAL.toLocaleString(), sub: 'Tonnes Today', color: 'text-slate-900' },
          { label: 'Fleet Health', value: avgHealth, sub: 'Avg Score', color: 'text-slate-900' },
        ].map((stat, i) => (
          <Card key={i} interactive className="bg-white">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={`text-4xl font-display font-semibold tracking-tight ${stat.color}`}>{stat.value}</span>
              </div>
              <span className="text-xs text-slate-400 mt-3 block">{stat.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hero CTA + Health Chart + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dispatch CTA */}
        <Card className="bg-brand-50 border border-brand-200 shadow-soft-sm overflow-hidden relative group cursor-pointer hover:-translate-y-1 transition-all duration-300" onClick={() => onNavigate('dispatch')}>
          <CardContent className="h-full flex flex-col justify-center items-start p-8 relative z-10">
            <div className="mb-6 p-4 bg-white rounded-2xl border border-brand-100 shadow-soft-sm group-hover:scale-110 transition-transform duration-300">
              <Truck className="w-8 h-8 text-brand-600" />
            </div>
            <h2 className="text-2xl font-display font-semibold mb-3 tracking-tight text-slate-900">Optimization Ready</h2>
            <p className="text-slate-700 mb-8 max-w-xs leading-relaxed text-sm">
              {pendingRequests} pending dispatch requests can be optimized with available assets using AI.
            </p>
            <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-soft-sm flex items-center gap-2">
              Go to Dispatch <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>

        {/* Health Distribution */}
        <div className="lg:col-span-1">
          <HealthDistributionChart trucks={trucks} />
        </div>

        {/* Live Feed */}
        <Card className="lg:col-span-1 h-full bg-white">
          <CardContent>
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-brand-500"></span>
                </span>
                Live Feed
              </h3>
            </div>
            <div className="space-y-4">
              {recentActivities.map((item, i) => (
                <div key={i} className="flex gap-4 group cursor-default p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="mt-1 p-2 bg-white rounded-xl border border-slate-100 shadow-soft-sm">
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <p className="text-sm font-semibold text-slate-900 truncate pr-2 group-hover:text-brand-600 transition-colors">{item.title}</p>
                      <span className="text-xs text-slate-400 whitespace-nowrap">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Delivery Trend + Wood Species + Barge Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Delivery Trend */}
        <Card className="lg:col-span-2 bg-white">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight">Delivery Trend</h3>
              <span className="text-xs text-slate-400 font-medium">Last 10 Days</span>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={MOCK_DELIVERY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="elegantActual" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D97757" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#D97757" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#948f87' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#948f87' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '12px', border: '1px solid #e8e5e1',
                      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', backgroundColor: '#fff',
                      fontSize: '12px', fontFamily: 'Albert Sans',
                    }}
                  />
                  <Area type="monotone" dataKey="target" stroke="#b5b0a8" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target" />
                  <Area type="monotone" dataKey="actual" stroke="#D97757" strokeWidth={2.5} fill="url(#elegantActual)" name="Actual" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Wood Species Mix */}
        <Card className="bg-white">
          <CardContent className="h-full flex flex-col">
            <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight mb-2 flex items-center gap-2">
              <TreePine className="w-5 h-5 text-brand-500" /> Wood Species Mix
            </h3>
            <div className="flex-1 min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={MOCK_WOOD_SPECIES.map(w => ({ name: w.code, value: w.tonnage }))} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="#fff" strokeWidth={2}>
                    {MOCK_WOOD_SPECIES.map((_, i) => <Cell key={i} fill={woodColors[i % woodColors.length]} />)}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: '8px', border: '1px solid #e8e5e1', fontSize: '12px', fontFamily: 'Albert Sans' }}
                    formatter={(value: number) => [`${value.toLocaleString()}t`, 'Tonnage']}
                  />
                  <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-slate-600 text-xs font-medium ml-1">{value}</span>} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Barge Operations */}
      {liveBarge.length > 0 && (
        <Card className="bg-white">
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
                <Ship className="w-5 h-5 text-brand-500" /> Active Barge Operations
              </h3>
              <button onClick={() => onNavigate('vessels')} className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1">
                View All <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {liveBarge.map((barge, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100">
                  <div className="p-2 bg-white rounded-lg border border-brand-100">
                    <Anchor className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{barge.name}</p>
                    <p className="text-xs text-slate-500">{barge.loadingPoint} · Budget: {barge.budgetDuration}</p>
                  </div>
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
