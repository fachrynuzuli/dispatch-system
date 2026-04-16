import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Truck, ClipboardCheck, Map as MapIcon, Menu, X, Bell, AlertTriangle, Clock, CheckCircle, ChevronDown, LogOut, Settings, Users, Globe, Package, Ship } from 'lucide-react';
import { ViewState, Truck as TruckType, Inspection, DispatchRequest, SparePart, InventoryStatus, InspectionDecision, Vessel, VesselStatus } from './types';
import { MOCK_TRUCKS, MOCK_INSPECTIONS, MOCK_REQUESTS, MOCK_DRIVERS, MOCK_INVENTORY, MOCK_VESSELS } from './services/mockData';
import { AssetsView } from './views/AssetsView';
import { InspectionsView } from './views/InspectionsView';
import { DispatchView } from './views/DispatchView';
import { DriversView } from './views/DriversView';
import { LiveMapView } from './views/LiveMapView';
import { InventoryView } from './views/InventoryView';
import { VesselsView } from './views/VesselsView';
import { GeminiAssistant } from './components/GeminiAssistant';
import { HealthDistributionChart } from './components/HealthDistributionChart';
import { Card, CardContent } from './components/ui/Card';

const App = () => {
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeTrucks, setActiveTrucks] = useState<TruckType[]>(MOCK_TRUCKS);
  const [activeDrivers, setActiveDrivers] = useState(MOCK_DRIVERS);
  const [inspections, setInspections] = useState<Inspection[]>(MOCK_INSPECTIONS);
  const [requests, setRequests] = useState<DispatchRequest[]>(MOCK_REQUESTS);
  const [inventory, setInventory] = useState<SparePart[]>(MOCK_INVENTORY);
  const [vessels, setVessels] = useState<Vessel[]>(MOCK_VESSELS);
  const [scrolled, setScrolled] = useState(false);
  const [toast, setToast] = useState<{message: string, type: 'success' | 'info' | 'error'} | null>(null);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('elegant');

  useEffect(() => {
    document.body.className = theme === 'elegant' ? '' : `theme-${theme}`;
  }, [theme]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };
  
  // Simulated context string for the AI Assistant based on current data
  const aiContext = `
    Current Fleet Status (December 2025):
    - Total Trucks: ${activeTrucks.length}
    - Total Drivers: ${activeDrivers.length}
    - Available Trucks: ${activeTrucks.filter(t => t.status === 'Available').length}
    - Available Drivers: ${activeDrivers.filter(d => d.status === 'Available').length}
    - Maintenance: ${activeTrucks.filter(t => t.status === 'Maintenance').length}
    - Critical Heavy Haulers (130t+): ${activeTrucks.filter(t => t.model.includes('FH-16') || t.model.includes('R620')).length} units
    
    Pending Inspections: ${inspections.length}
    Pending Requests: ${requests.filter(r => r.status === 'Pending').length}
  `;

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    setScrolled(e.currentTarget.scrollTop > 20);
  };

  const handleUpdateTruck = (updatedTruck: TruckType) => {
    setActiveTrucks(prev => prev.map(t => t.id === updatedTruck.id ? updatedTruck : t));
    showToast(`Truck ${updatedTruck.plate} updated successfully.`, 'success');
  };

  const handleUpdateInspection = (id: string, decision: InspectionDecision) => {
    setInspections(prev => prev.map(i => i.id === id ? { ...i, decision } : i));
    showToast(`Inspection ${id} marked as ${decision}.`, 'success');
  };

  const handleGeneratePO = () => {
    setInventory(prev => prev.map(item => {
      if (item.status === InventoryStatus.LOW_STOCK || item.status === InventoryStatus.OUT_OF_STOCK) {
        return { ...item, stockLevel: item.minimumStock + 10, status: InventoryStatus.IN_STOCK };
      }
      return item;
    }));
    showToast('Purchase Orders generated and stock simulated as replenished.', 'success');
  };

  const handleManualAssign = (requestId: string, truckId: string, driverId: string) => {
    setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'Assigned', assignedTruckId: truckId, assignedDriverId: driverId } : r));
    showToast(`Request ${requestId} assigned to Truck ${truckId}.`, 'success');
  };

  const handleGenerateVesselDispatch = (vessel: Vessel) => {
    // Generate a new dispatch request for the vessel's cargo
    const newRequest: DispatchRequest = {
      id: `REQ-VSL-${Math.floor(Math.random() * 10000)}`,
      customerName: `Port Operations (${vessel.name})`,
      destination: vessel.destinationTerminal,
      cargoWeight: vessel.cargoWeight,
      requiredDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };
    
    setRequests(prev => [newRequest, ...prev]);
    setVessels(prev => prev.map(v => v.id === vessel.id ? { ...v, status: VesselStatus.UNLOADING } : v));
    showToast(`Dispatch request generated for ${vessel.name} cargo.`, 'success');
  };

  const NavItem = ({ view, icon: Icon, label }: { view: ViewState, icon: any, label: string }) => (
    <button
      onClick={() => { setCurrentView(view); setMobileMenuOpen(false); }}
      className={`relative w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group overflow-hidden ${
        currentView === view 
          ? 'text-brand-800 font-semibold bg-brand-100/50' 
          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium'
      }`}
    >
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
        <div className="p-6 hidden md:flex items-center gap-3 mb-6 border-b border-slate-200">
          <div className="relative group cursor-pointer">
            <div className="w-12 h-12 bg-slate-900 rounded-xl shadow-soft-sm flex items-center justify-center text-brand-50 font-display font-bold text-xl transition-transform duration-300 group-hover:scale-105">
              FDS
            </div>
          </div>
          <div>
            <span className="font-display font-semibold text-xl tracking-tight block text-slate-900">Fleet Dispatch</span>
            <span className="text-[10px] text-slate-500 font-medium uppercase tracking-widest leading-tight block mt-1 max-w-[140px]">Enterprise System</span>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
          <NavItem view="map" icon={Globe} label="Live Map" />
          <NavItem view="assets" icon={Truck} label="Fleet Assets" />
          <NavItem view="inventory" icon={Package} label="Spare Parts" />
          <NavItem view="drivers" icon={Users} label="Drivers" />
          <NavItem view="inspections" icon={ClipboardCheck} label="Inspections" />
          <NavItem view="dispatch" icon={MapIcon} label="Dispatch" />
          <NavItem view="vessels" icon={Ship} label="Port Operations" />
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="bg-white border border-slate-100 rounded-2xl p-4 group hover:shadow-soft-md transition-all cursor-pointer">
             <div className="flex items-center justify-between mb-2">
               <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">System Status</p>
               <Settings className="w-4 h-4 text-slate-400 group-hover:rotate-90 transition-transform duration-500" />
             </div>
             <div className="flex items-center gap-2 text-sm text-slate-700 font-medium">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               Online
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
        <header className={`hidden md:flex justify-between items-center px-8 py-6 sticky top-0 z-10 transition-all duration-300 ${
          scrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-soft-sm' : 'bg-transparent border-b border-transparent'
        }`}>
          <div>
            <h1 className="text-2xl font-display font-semibold text-slate-900 tracking-tight">{currentView === 'map' ? 'Live Operations Map' : currentView.charAt(0).toUpperCase() + currentView.slice(1)}</h1>
            <p className="text-sm text-slate-500 mt-1">Reimagining AI-first Fleet Dispatch System</p>
          </div>
          
          <div className="flex items-center gap-6">
            {/* Notification Bell */}
            <button 
              onClick={() => showToast('No new notifications at this time.', 'info')}
              className="group relative p-3 bg-white border border-slate-100 rounded-full hover:shadow-soft-md hover:-translate-y-0.5 transition-all"
            >
              <Bell className="w-5 h-5 text-slate-600 group-hover:animate-bell-shake origin-top" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-brand-500 rounded-full group-hover:scale-110 transition-transform duration-200"></span>
            </button>

            {/* Profile Placeholder */}
            <div className="relative">
              <div 
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="group flex items-center gap-4 cursor-pointer pl-6 border-l border-slate-200"
              >
                 <div className="text-right hidden lg:block">
                   <p className="text-sm font-semibold text-slate-900 group-hover:text-brand-600 transition-colors">Admin User</p>
                   <p className="text-xs text-slate-500">Logistics Manager</p>
                 </div>
                 <div className="relative">
                    <div className="w-10 h-10 bg-slate-900 rounded-full border border-slate-200 shadow-soft-sm group-hover:shadow-soft-md transition-all duration-300 group-hover:-translate-y-0.5 flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                 </div>
              </div>
              
              {profileMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-soft-xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 border-b border-slate-100 mb-2">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Theme</p>
                  </div>
                  <button 
                    onClick={() => { setTheme('elegant'); setProfileMenuOpen(false); showToast('Theme set to Elegant Claude AI', 'success'); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'elegant' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className="w-3 h-3 rounded-full bg-[#D97757]"></div>
                    Elegant Claude
                  </button>
                  <button 
                    onClick={() => { setTheme('midnight'); setProfileMenuOpen(false); showToast('Theme set to Midnight', 'success'); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'midnight' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className="w-3 h-3 rounded-full bg-slate-900"></div>
                    Midnight
                  </button>
                  <button 
                    onClick={() => { setTheme('ocean'); setProfileMenuOpen(false); showToast('Theme set to Ocean', 'success'); }}
                    className={`w-full text-left px-4 py-2 text-sm flex items-center gap-2 ${theme === 'ocean' ? 'bg-brand-50 text-brand-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                  >
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    Ocean
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto pb-24 h-full">
          {currentView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: 'Active Trucks', value: activeTrucks.filter(t => t.status === 'Available' || t.status === 'On Trip').length, sub: `/ ${activeTrucks.length} Total`, color: 'text-brand-600' },
                  { label: 'Active Drivers', value: activeDrivers.filter(d => d.status === 'Available').length, sub: 'Ready for Dispatch', color: 'text-slate-900' },
                  { label: 'Trips Completed', value: '1,284', sub: 'Dec 2025', color: 'text-slate-900' },
                  { label: 'Fleet Health', value: '94.2', sub: 'Avg Score', color: 'text-slate-900' }
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
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="bg-brand-50 border border-brand-200 shadow-soft-sm lg:col-span-1 overflow-hidden relative group cursor-pointer hover:-translate-y-1 transition-all duration-300">
                  <CardContent className="h-full flex flex-col justify-center items-start p-8 relative z-10">
                    <div className="mb-6 p-4 bg-white rounded-2xl border border-brand-100 shadow-soft-sm group-hover:scale-110 transition-transform duration-300">
                      <Truck className="w-8 h-8 text-brand-600" />
                    </div>
                    <h2 className="text-2xl font-display font-semibold mb-3 tracking-tight text-slate-900">Optimization Ready</h2>
                    <p className="text-slate-700 mb-8 max-w-xs leading-relaxed text-sm">
                      {requests.filter(r => r.status === 'Pending').length} pending dispatch requests can be optimized with available assets using Gemini AI.
                    </p>
                    <button 
                      onClick={() => setCurrentView('dispatch')}
                      className="px-6 py-2.5 bg-slate-900 text-white rounded-xl font-semibold text-sm hover:bg-slate-800 transition-all active:scale-95 shadow-soft-sm"
                    >
                      Go to Dispatch
                    </button>
                  </CardContent>
                </Card>

                {/* Health Chart Widget */}
                <div className="lg:col-span-1">
                   <HealthDistributionChart trucks={activeTrucks} />
                </div>

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
                      <button onClick={() => showToast('Activity log expanded view coming soon.', 'info')} className="text-xs font-medium text-slate-500 hover:text-brand-600 transition-colors">View All</button>
                    </div>
                    <div className="space-y-4">
                      {getRecentActivities().map((item, i) => (
                        <div key={i} className="flex gap-4 group cursor-default p-2 rounded-xl hover:bg-slate-50 transition-colors">
                          <div className={`mt-1 p-2 bg-white rounded-xl border border-slate-100 shadow-soft-sm`}>
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
            </div>
          )}

          {currentView === 'map' && <LiveMapView trucks={activeTrucks} />}
          {currentView === 'assets' && <AssetsView trucks={activeTrucks} onUpdateTruck={handleUpdateTruck} />}
          {currentView === 'inventory' && <InventoryView inventory={inventory} trucks={activeTrucks} onGeneratePO={handleGeneratePO} onShowToast={showToast} />}
          {currentView === 'drivers' && <DriversView drivers={activeDrivers} />}
          {currentView === 'inspections' && <InspectionsView inspections={inspections} trucks={activeTrucks} onUpdateInspection={handleUpdateInspection} />}
          {currentView === 'dispatch' && <DispatchView requests={requests} trucks={activeTrucks} drivers={activeDrivers} onManualAssign={handleManualAssign} />}
          {currentView === 'vessels' && <VesselsView vessels={vessels} trucks={activeTrucks} onGenerateDispatch={handleGenerateVesselDispatch} onShowToast={showToast} />}
        </div>
      </main>

      <GeminiAssistant contextData={aiContext} />

      {/* Global Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className={`px-6 py-4 rounded-xl shadow-lg border flex items-center gap-3 ${
            toast.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-rose-50 border-rose-200 text-rose-800' :
            'bg-brand-50 border-brand-200 text-brand-800'
          }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
            {toast.type === 'error' && <AlertTriangle className="w-5 h-5 text-rose-600" />}
            {toast.type === 'info' && <Bell className="w-5 h-5 text-brand-600" />}
            <span className="font-medium text-sm">{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;