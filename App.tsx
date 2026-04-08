import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Truck, ClipboardCheck, Map as MapIcon, Menu, X, Bell, AlertTriangle, Clock, CheckCircle, ChevronDown, LogOut, Settings, Users, Globe } from 'lucide-react';
import { ViewState, Truck as TruckType } from './types';
import { MOCK_TRUCKS, MOCK_INSPECTIONS, MOCK_REQUESTS, MOCK_DRIVERS } from './services/mockData';
import { AssetsView } from './views/AssetsView';
import { InspectionsView } from './views/InspectionsView';
import { DispatchView } from './views/DispatchView';
import { DriversView } from './views/DriversView';
import { LiveMapView } from './views/LiveMapView';
import { GeminiAssistant } from './components/GeminiAssistant';
import { HealthDistributionChart } from './components/HealthDistributionChart';
import { Card, CardContent } from './components/ui/Card';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTrucks, setActiveTrucks] = useState<TruckType[]>(MOCK_TRUCKS);
  const [activeDrivers, setActiveDrivers] = useState(MOCK_DRIVERS);
  const [scrolled, setScrolled] = useState(false);
  
  // Simulated context string for the AI Assistant based on current data
  const aiContext = `
    Current Fleet Status (December 2025):
    - Total Trucks: ${activeTrucks.length}
    - Total Drivers: ${activeDrivers.length}
    - Available Trucks: ${activeTrucks.filter(t => t.status === 'Available').length}
    - Available Drivers: ${activeDrivers.filter(d => d.status === 'Available').length}
    - Maintenance: ${activeTrucks.filter(t => t.status === 'Maintenance').length}
    - Critical Heavy Haulers (130t+): ${activeTrucks.filter(t => t.model.includes('FH-16') || t.model.includes('R620')).length} units
    
    Pending Inspections: ${MOCK_INSPECTIONS.length}
    Pending Requests: ${MOCK_REQUESTS.filter(r => r.status === 'Pending').length}
  `;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrolled(e.currentTarget.scrollTop > 20);
  };

  const handleUpdateTruck = (updatedTruck: TruckType) => {
    setActiveTrucks(prev => prev.map(t => t.id === updatedTruck.id ? updatedTruck : t));
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setMobileMenuOpen(false); }}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
        currentView === view 
          ? 'text-brand-600 font-medium bg-brand-50 shadow-sm shadow-brand-100' 
          : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      {/* Active Indicator Line */}
      {currentView === view && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-brand-500 rounded-r-full" />
      )}
      
      <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${currentView === view ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
      <span className="relative z-10">{label}</span>
    </button>
  );

  const getRecentActivities = () => [
    { 
      title: "Trip Finished: RTP0231", 
      desc: "Delivered 140t Wood to Alpha Port", 
      time: "10 mins ago",
      icon: CheckCircle,
      color: "text-emerald-500"
    },
    { 
      title: "Delay Alert: BDP1102", 
      desc: "Stuck at South District access road (Traffic)", 
      time: "45 mins ago",
      icon: Clock,
      color: "text-amber-500"
    },
    { 
      title: "Accident Report: RMP4005", 
      desc: "Minor scrape at Workshop Yard B", 
      time: "2 hours ago",
      icon: AlertTriangle,
      color: "text-rose-500"
    },
    { 
      title: "Inspection Passed: RTP0550", 
      desc: "Ready for dispatch (Heavy Haul)", 
      time: "3 hours ago",
      icon: ClipboardCheck,
      color: "text-brand-500"
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col md:flex-row font-sans text-slate-900">
      
      {/* Mobile Header */}
      <div className={`md:hidden flex items-center justify-between p-4 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-30 transition-shadow duration-300 ${scrolled ? 'shadow-soft-md' : ''}`}>
        <div className="font-bold text-lg text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-brand-500/20">FDS</div>
          FDS Mobile
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
          className="p-2 text-slate-600 hover:bg-slate-50 rounded-lg active:scale-95 transition-all"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar / Navigation */}
      <aside className={`
        fixed inset-0 z-20 bg-white/95 backdrop-blur-2xl md:static md:w-64 md:bg-white md:border-r md:border-slate-100 md:h-screen transition-transform duration-300
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:flex items-center gap-3 mb-6">
          <div className="relative group cursor-pointer">
            <div className="w-9 h-9 bg-brand-600 rounded-xl shadow-lg shadow-brand-500/30 flex items-center justify-center text-white font-bold transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
              <span className="text-sm">FDS</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight block text-slate-900">Fleet Dispatch</span>
            <span className="text-[10px] text-slate-500 font-medium tracking-wide leading-tight block mt-0.5 max-w-[140px]">Reimagining AI-first Fleet Dispatch System</span>
          </div>
        </div>

        <nav className="p-4 space-y-1.5">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="map" icon={Globe} label="Live Map" />
          <NavItem view="assets" icon={Truck} label="Fleet Assets" />
          <NavItem view="drivers" icon={Users} label="Drivers" />
          <NavItem view="inspections" icon={ClipboardCheck} label="Inspections" />
          <NavItem view="dispatch" icon={MapIcon} label="Dispatch" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 group hover:border-brand-200 transition-colors cursor-pointer">
             <div className="flex items-center justify-between mb-2">
               <p className="text-xs font-bold text-slate-500 uppercase tracking-wide group-hover:text-brand-600 transition-colors">System Status</p>
               <Settings className="w-3.5 h-3.5 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
             </div>
             <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
               <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                </span>
               Online • Dec 2025
             </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto h-[calc(100vh-64px)] md:h-screen relative scroll-smooth"
      >
        {/* Top Bar (Desktop) */}
        <header className={`hidden md:flex justify-between items-center px-8 py-4 sticky top-0 z-10 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/50 shadow-sm' : 'bg-transparent border-transparent'
        }`}>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 capitalize tracking-tight">{currentView === 'map' ? 'Live Operations Map' : currentView}</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">Reimagining AI-first Fleet Dispatch System</p>
          </div>
          
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <button className="group relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5 group-hover:animate-bell-shake origin-top" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white group-hover:scale-125 transition-transform duration-300"></span>
            </button>

            {/* Profile Placeholder */}
            <div className="group flex items-center gap-3 cursor-pointer pl-4 border-l border-slate-200">
               <div className="text-right hidden lg:block">
                 <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">Admin User</p>
                 <p className="text-xs text-slate-500">Logistics Manager</p>
               </div>
               <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-500 to-indigo-600 shadow-lg group-hover:shadow-brand-500/30 transition-all duration-300 group-hover:scale-105 ring-2 ring-white ring-offset-2 ring-offset-transparent group-hover:ring-offset-brand-50"></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full group-hover:scale-110 transition-transform"></div>
               </div>
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 h-full">
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Active Trucks', value: activeTrucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length, sub: `/ ${activeTrucks.length} Total`, color: 'text-brand-600' },
                  { label: 'Active Drivers', value: activeDrivers.filter(d => d.status === 'Available').length, sub: 'Ready for Dispatch', color: 'text-indigo-600' },
                  { label: 'Trips Completed', value: '1,284', sub: 'Dec 2025', color: 'text-emerald-600' },
                  { label: 'Fleet Health', value: '94.2', sub: 'Avg Score', color: 'text-sky-600' }
                ].map((stat, i) => (
                  <Card key={i} glass interactive>
                    <CardContent className="p-5">
                      <p className="text-sm text-slate-500 font-medium uppercase tracking-wide text-[11px]">{stat.label}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className={`text-3xl font-bold tracking-tight ${stat.color}`}>{stat.value}</span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium mt-1 block">{stat.sub}</span>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-slate-900 to-slate-800 text-white border-none shadow-soft-xl lg:col-span-1 overflow-hidden relative group cursor-pointer hover:-translate-y-1 transition-transform duration-300">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-white/10 transition-colors duration-500"></div>
                  
                  <CardContent className="h-full flex flex-col justify-center items-start p-8 relative z-10">
                    <div className="mb-6 p-3 bg-white/10 rounded-2xl backdrop-blur-md shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-brand-200" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2 tracking-tight">Optimization Ready</h2>
                    <p className="text-slate-300 mb-8 max-w-xs leading-relaxed text-sm">
                      {MOCK_REQUESTS.filter(r => r.status === 'Pending').length} pending dispatch requests can be optimized with available assets using Gemini AI.
                    </p>
                    <button 
                      onClick={() => setCurrentView('dispatch')}
                      className="px-5 py-2.5 bg-white text-slate-900 rounded-xl font-semibold text-sm hover:bg-brand-50 transition-all active:scale-95 shadow-lg shadow-black/20"
                    >
                      Go to Dispatch
                    </button>
                  </CardContent>
                </Card>

                {/* Health Chart Widget */}
                <div className="lg:col-span-1">
                   <HealthDistributionChart trucks={activeTrucks} />
                </div>

                <Card className="lg:col-span-1 h-full">
                  <CardContent>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="font-semibold text-slate-900 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                        Live Feed
                      </h3>
                      <button className="text-xs font-medium text-brand-600 hover:text-brand-700">View All</button>
                    </div>
                    <div className="space-y-5">
                      {getRecentActivities().map((item, i) => (
                        <div key={i} className="flex gap-4 group cursor-default">
                          <div className={`mt-1 p-2 rounded-xl bg-slate-50 border border-slate-100 group-hover:border-brand-100 group-hover:bg-brand-50 transition-colors ${item.color}`}>
                            <item.icon className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                              <p className="text-sm font-semibold text-slate-800 truncate pr-2 group-hover:text-brand-700 transition-colors">{item.title}</p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{item.time}</span>
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {currentView === 'map' && <LiveMapView trucks={activeTrucks} />}
          {currentView === 'assets' && <AssetsView trucks={activeTrucks} onUpdateTruck={handleUpdateTruck} />}
          {currentView === 'drivers' && <DriversView drivers={activeDrivers} />}
          {currentView === 'inspections' && <InspectionsView inspections={MOCK_INSPECTIONS} trucks={activeTrucks} />}
          {currentView === 'dispatch' && <DispatchView requests={MOCK_REQUESTS} trucks={activeTrucks} drivers={activeDrivers} />}
        </div>
      </main>

      <GeminiAssistant contextData={aiContext} />
    </div>
  );
};

export default App;