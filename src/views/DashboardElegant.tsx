import React from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel, SparePart } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
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
import { cn } from '@/lib/utils';

interface DashboardElegantProps {
  trucks: TruckType[];
  drivers: Driver[];
  requests: DispatchRequest[];
  vessels: Vessel[];
  onNavigate: (view: string) => void;
}

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
      {/* 1. KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Trucks', value: activeTrucks, sub: `/ ${trucks.length} Total`, color: 'text-brand-600' },
          { label: 'Active Drivers', value: availableDrivers, sub: 'Ready for Dispatch', color: 'text-slate-900' },
          { label: 'Daily Throughput', value: DAILY_ACTUAL.toLocaleString(), sub: 'Tonnes Today', color: 'text-slate-900' },
          { label: 'Fleet Health', value: avgHealth, sub: 'Avg Score', color: 'text-slate-900' },
        ].map((stat, i) => (
          <Card key={i} className="bg-white border-slate-200 transition-all hover:shadow-soft-md shadow-sm">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className={cn("text-4xl font-display font-semibold tracking-tight", stat.color)}>{stat.value}</span>
              </div>
              <span className="text-xs text-slate-400 mt-3 block">{stat.sub}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 2. Hero CTA + Health Chart + Live Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 flex flex-col gap-6">
          
          {/* Dispatch CTA */}
          <Card 
            className="bg-brand-50 border-brand-200 shadow-soft-sm overflow-hidden relative group cursor-pointer hover:-translate-y-1 transition-all duration-300" 
            onClick={() => onNavigate('dispatch')}
          >
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between relative z-10 gap-6">
              <div className="flex items-center gap-5">
                <div className="p-3 bg-white rounded-2xl border border-brand-100 shadow-soft-sm group-hover:scale-110 transition-transform duration-300 shrink-0">
                  <Truck className="w-6 h-6 text-brand-600" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-semibold mb-1 tracking-tight text-slate-900">Optimization Ready</h2>
                  <p className="text-slate-700 leading-relaxed text-sm max-w-sm">
                    {pendingRequests} pending dispatch requests can be optimized using AI.
                  </p>
                </div>
              </div>
              <button className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-95 flex items-center gap-2 shrink-0">
                Go to Dispatch <ArrowRight className="w-4 h-4" />
              </button>
            </CardContent>
          </Card>

          {/* Health Distribution */}
          <div className="flex-1 min-h-[300px]">
            <HealthDistributionChart trucks={trucks} />
          </div>
        </div>

        {/* Live Feed */}
        <Card className="lg:col-span-1 border-slate-200 shadow-soft-sm">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Live Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 max-h-[400px] overflow-y-auto w-full">
            {recentActivities.map((item, i) => (
              <div key={i} className="flex gap-3 group cursor-default p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <div className="mt-0.5 p-1.5 bg-white rounded-lg border border-slate-100 shadow-sm shrink-0">
                  <item.icon className={cn("w-4 h-4", item.color)} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-sm font-semibold text-slate-900 truncate pr-2 group-hover:text-brand-600 transition-colors">{item.title}</p>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">{item.time}</span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 3. Delivery Trend + Wood Species + Barge Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Delivery Trend */}
        <Card className="lg:col-span-2 border-slate-200 shadow-soft-sm">
          <CardHeader className="flex flex-row flex-wrap items-center justify-between pb-4">
             <CardTitle className="font-display font-semibold text-lg text-slate-900 tracking-tight">Delivery Trend</CardTitle>
             <span className="text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">Last 10 Days</span>
          </CardHeader>
          <CardContent className="h-64">
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
                <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e8e5e1', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)', backgroundColor: '#fff', fontSize: '12px', fontFamily: 'Albert Sans' }} />
                <Area type="monotone" dataKey="target" stroke="#b5b0a8" strokeWidth={2} strokeDasharray="5 5" fill="none" name="Target" />
                <Area type="monotone" dataKey="actual" stroke="#D97757" strokeWidth={2.5} fill="url(#elegantActual)" name="Actual" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Wood Species Mix */}
        <Card className="border-slate-200 shadow-soft-sm">
          <CardHeader className="pb-2">
             <CardTitle className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <TreePine className="w-5 h-5 text-brand-500" /> Wood Species Mix
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64 flex flex-col justify-center">
             <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={MOCK_WOOD_SPECIES.map(w => ({ name: w.code, value: w.tonnage }))} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={2} dataKey="value" stroke="#fff" strokeWidth={2}>
                  {MOCK_WOOD_SPECIES.map((_, i) => <Cell key={i} fill={woodColors[i % woodColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e8e5e1', fontSize: '12px', fontFamily: 'Albert Sans' }} formatter={(value: number) => [`${value.toLocaleString()}t`, 'Tonnage']} />
                <Legend verticalAlign="bottom" iconType="circle" formatter={(value) => <span className="text-slate-600 text-xs font-medium ml-1">{value}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* 4. Active Barge Operations */}
      {liveBarge.length > 0 && (
        <Card className="border-slate-200 shadow-soft-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
             <CardTitle className="font-display font-semibold text-lg text-slate-900 tracking-tight flex items-center gap-2">
              <Ship className="w-5 h-5 text-brand-500" /> Active Barge Operations
            </CardTitle>
            <button onClick={() => onNavigate('vessels')} className="text-xs font-medium text-brand-600 hover:text-brand-700 transition-colors flex items-center gap-1">
              View All <ArrowRight className="w-3 h-3" />
            </button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {liveBarge.map((barge, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-100 relative group overflow-hidden">
                  <div className="absolute inset-y-0 left-0 w-1 bg-brand-400 group-hover:w-1.5 transition-all"></div>
                  <div className="p-2 bg-white rounded-lg border border-brand-100 shadow-sm">
                    <Anchor className="w-5 h-5 text-brand-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-900">{barge.name}</p>
                    <p className="text-xs text-slate-500">{barge.loadingPoint} &middot; Budget: {barge.budgetDuration}</p>
                  </div>
                  <span className="relative flex h-3 w-3 mr-2">
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
