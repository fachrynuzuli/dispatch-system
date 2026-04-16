import React, { useState } from 'react';
import { Truck as TruckType, Driver, DispatchRequest, Vessel } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { MetricTile } from '../components/ui/MetricTile';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { TrendingUp, Activity, BarChart3, Ship, Fuel, ArrowRight, Layers } from 'lucide-react';
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
  MOCK_FUEL_BY_UNIT,
  MOCK_FUEL_BY_OPERATOR,
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

export const DashboardOcean: React.FC<DashboardOceanProps> = ({
  trucks, drivers, requests, vessels, onNavigate,
}) => {
  const activeTrucks = trucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length;
  const availableDrivers = drivers.filter(d => d.status === 'Available').length;
  const avgHealth = trucks.length > 0 ? (trucks.reduce((sum, t) => sum + t.healthScore, 0) / trucks.length).toFixed(1) : '0';

  // Radar data
  const radarData = MOCK_EQUIPMENT_UTILIZATION.map(e => ({
    subject: e.unit,
    utilization: e.utilization,
    availability: (e.workingHours / e.availableHours) * 100,
  }));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* 1. Metric Row - Professional Primitives */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricTile label="Active Fleet" value={activeTrucks} subValue={`of ${trucks.length} total units`} icon={Activity} variant="blue" trend="+2 today" trendUp={true} />
        <MetricTile label="Drivers Ready" value={availableDrivers} subValue="Available for Dispatch" icon={TrendingUp} variant="cyan" trend="Stable" trendUp={true} />
        <MetricTile label="Daily Output" value={`${(DAILY_ACTUAL / 1000).toFixed(1)}k`} subValue="Tonnes processed" icon={BarChart3} variant="indigo" trend={`MTD: ${(MTD_ACTUAL_BASE / 1000).toFixed(0)}k`} trendUp={true} />
        <MetricTile label="Fleet Health" value={avgHealth} subValue="Average Score /100" icon={Fuel} variant="emerald" trend="Optimal" trendUp={true} />
      </div>

      {/* 2. Primary Trend - No Nested Cards */}
      <Card className="border-slate-200 shadow-soft-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-display font-semibold text-slate-900 tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-sky-500" /> Delivery Trend
          </CardTitle>
          <span className="text-[10px] font-bold uppercase tracking-widest text-sky-600 bg-sky-50 px-2 py-0.5 rounded border border-sky-100">Last 10 Days</span>
        </CardHeader>
        <CardContent className="h-72 px-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={MOCK_DELIVERY_TREND} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
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
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(14,165,233,0.1)', backgroundColor: '#fff', fontSize: '12px', fontFamily: 'Albert Sans' }}
                formatter={(value: number) => [`${value.toLocaleString()} t`, '']}
              />
              <Area type="monotone" dataKey="target" stroke="#94a3b8" strokeWidth={2} strokeDasharray="6 3" fill="url(#oceanTarget)" name="Target" />
              <Area type="monotone" dataKey="actual" stroke="#0ea5e9" strokeWidth={2.5} fill="url(#oceanActual)" name="Actual" dot={{ r: 4, fill: '#0ea5e9', stroke: '#fff', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 3. Analytics Grid - Tabs Primitives */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loading Rates */}
        <Card className="border-slate-200">
          <Tabs defaultValue="unit" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-sky-500" /> Loading Rate
              </CardTitle>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="unit" className="text-xs">Unit</TabsTrigger>
                <TabsTrigger value="operator" className="text-xs">Operator</TabsTrigger>
                <TabsTrigger value="wood" className="text-xs">Wood</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="h-64 pt-0">
              <TabsContent value="unit" className="h-full m-0"><LoadingChart data={MOCK_LOADING_RATES_BY_UNIT} /></TabsContent>
              <TabsContent value="operator" className="h-full m-0"><LoadingChart data={MOCK_LOADING_RATES_BY_OPERATOR.slice(0, 8)} /></TabsContent>
              <TabsContent value="wood" className="h-full m-0"><LoadingChart data={MOCK_LOADING_RATES_BY_WOOD} /></TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        {/* Fuel Efficiency */}
        <Card className="border-slate-200">
          <Tabs defaultValue="unit" className="w-full">
            <CardHeader className="flex flex-row items-center justify-between py-4">
              <CardTitle className="text-lg font-display font-semibold text-slate-900 flex items-center gap-2">
                <Fuel className="w-5 h-5 text-emerald-500" /> Fuel Efficiency
              </CardTitle>
              <TabsList className="bg-slate-100">
                <TabsTrigger value="unit" className="text-xs">Unit</TabsTrigger>
                <TabsTrigger value="operator" className="text-xs">Operator</TabsTrigger>
              </TabsList>
            </CardHeader>
            <CardContent className="h-64 pt-0">
              <TabsContent value="unit" className="h-full m-0"><FuelChart data={MOCK_FUEL_BY_UNIT} /></TabsContent>
              <TabsContent value="operator" className="h-full m-0"><FuelChart data={MOCK_FUEL_BY_OPERATOR.slice(0, 8)} /></TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* 4. Equipment & Operations Rows */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Map */}
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2"><Layers className="w-4 h-4 text-indigo-500" /> Equipment Profile</CardTitle></CardHeader>
          <CardContent className="h-64 flex flex-col justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#e2e8f0" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#64748b' }} />
                <PolarRadiusAxis tick={{ fontSize: 9, fill: '#94a3b8' }} domain={[0, 100]} />
                <Radar name="Utilization" dataKey="utilization" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} strokeWidth={2} />
                <Radar name="Work Ratio" dataKey="availability" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.15} strokeWidth={2} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '10px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Stack Loading - Improved List Pattern */}
        <Card className="border-slate-200">
          <CardHeader><CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500" /> Stack Output</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {MOCK_STACK_LOADING.map((stack, i) => (
              <div key={i} className="group">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-700">{stack.stackType}</span>
                  <span className="text-[11px] font-mono font-bold text-slate-900">{stack.avgTime}</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${(parseInt(stack.avgTime.split(':')[1]) / 35) * 100}%`, backgroundColor: CHART_COLORS[i % CHART_COLORS.length] }}></div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Port Operations - Professional Action CTA */}
        <Card className="border-slate-200 bg-slate-50/50">
          <CardHeader><CardTitle className="text-sm font-semibold text-slate-900 uppercase tracking-wider flex items-center gap-2"><Ship className="w-4 h-4 text-teal-600" /> Port Status</CardTitle></CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="space-y-3">
              {MOCK_WOOD_SPECIES.slice(0, 3).map((species, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-[10px] font-bold">{species.code}</div>
                    <div><p className="text-xs font-bold text-slate-900 leading-tight">{species.fullName}</p><p className="text-[10px] text-slate-500">{species.percentage}% of mix</p></div>
                  </div>
                  <p className="text-xs font-bold text-slate-900">{species.tonnage.toLocaleString()} t</p>
                </div>
              ))}
            </div>
            <button onClick={() => onNavigate('vessels')} className="mt-5 w-full py-2.5 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm">
              Live Port Operations <ArrowRight className="w-4 h-4" />
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Sub-components to clean up the main Dashboard file
const LoadingChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -20 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '11px', fontFamily: 'Albert Sans' }} />
      <Bar dataKey="rate" radius={[4, 4, 0, 0]} maxBarSize={30}>
        {data.map((entry, i) => <Cell key={i} fill={entry.rate >= entry.target ? '#0ea5e9' : '#f97316'} fillOpacity={0.8} />)}
      </Bar>
      <Line type="monotone" dataKey="target" stroke="#f59e0b" strokeWidth={2} strokeDasharray="5 5" dot={false} />
    </ComposedChart>
  </ResponsiveContainer>
);

const FuelChart = ({ data }: { data: any[] }) => (
  <ResponsiveContainer width="100%" height="100%">
    <ComposedChart data={data} margin={{ top: 5, right: 10, bottom: 0, left: -10 }}>
      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
      <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} domain={[0.10, 0.20]} />
      <Tooltip contentStyle={{ borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '11px', fontFamily: 'Albert Sans' }} />
      <Bar dataKey="efficiency" radius={[4, 4, 0, 0]} maxBarSize={30}>
        {data.map((entry, i) => <Cell key={i} fill={entry.efficiency <= entry.target ? '#10b981' : '#f97316'} fillOpacity={0.8} />)}
      </Bar>
      <Line type="monotone" dataKey="target" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={false} />
    </ComposedChart>
  </ResponsiveContainer>
);
;
