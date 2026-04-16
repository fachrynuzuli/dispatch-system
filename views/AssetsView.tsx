import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Truck, TruckStatus } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { SearchFilter } from '../components/ui/SearchFilter';
import { Truck as TruckIcon, Activity, Calendar, FileText, BarChart3, TrendingUp, AlertTriangle, Wrench } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, Tooltip, XAxis } from 'recharts';
import { predictAssetLifespan } from '../services/openRouterService';
import { AILoadingSparkle } from '../components/ui/AILoadingSparkle';
import { MaintenanceCalendar } from '../components/ui/MaintenanceCalendar';

interface AssetsViewProps {
  trucks: Truck[];
  onUpdateTruck: (updatedTruck: Truck) => void;
}

export const AssetsView: React.FC<AssetsViewProps> = ({ trucks, onUpdateTruck }) => {
  const [selectedTruck, setSelectedTruck] = useState<Truck | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [loadingPrediction, setLoadingPrediction] = useState(false);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const getStatusVariant = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.AVAILABLE: return 'success';
      case TruckStatus.MAINTENANCE: return 'error';
      case TruckStatus.ON_TRIP: return 'info';
      default: return 'warning';
    }
  };

  const handleTruckClick = async (truck: Truck) => {
    setSelectedTruck(truck);
    setPrediction(null);
    setLoadingPrediction(true);
    // Fetch AI prediction
    const result = await predictAssetLifespan(truck);
    setPrediction(result);
    setLoadingPrediction(false);
  };

  const handleScheduleMaintenance = () => {
    if (selectedTruck) {
      const updated = { ...selectedTruck, status: TruckStatus.MAINTENANCE };
      onUpdateTruck(updated);
      setSelectedTruck(updated);
    }
  };

  const chartData = trucks.map(t => ({ name: t.plate, health: t.healthScore }));

  // Filter Logic
  const filteredTrucks = trucks.filter(truck => {
    const matchesSearch = truck.plate.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          truck.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = statusFilter === 'All' || truck.status === statusFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Top Bar with Stats & Filter */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-end">
        <div>
           <h2 className="text-2xl font-bold text-slate-900">Fleet Assets</h2>
           <p className="text-slate-500">Manage total {trucks.length} units</p>
        </div>
        <div className="w-full md:w-auto">
          <SearchFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeFilter={statusFilter}
            onFilterChange={setStatusFilter}
            filterOptions={[
              { label: 'Available', value: TruckStatus.AVAILABLE },
              { label: 'On Trip', value: TruckStatus.ON_TRIP },
              { label: 'Maintenance', value: TruckStatus.MAINTENANCE },
              { label: 'Inspection Pending', value: TruckStatus.INSPECTION_PENDING }
            ]}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="md:col-span-2 bg-white border border-slate-200 shadow-soft-sm rounded-2xl">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-900 tracking-tight">Health Overview</h3>
              <p className="text-slate-500 text-sm">Real-time health score distribution</p>
            </div>
            <div className="h-24 w-64 hidden sm:block">
               <ResponsiveContainer width="100%" height="100%">
                 <BarChart data={chartData}>
                   <Bar dataKey="health" fill="#D97757" radius={[4,4,0,0]} />
                   <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: '1px solid #e8e5e1', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.04)' }}/>
                 </BarChart>
               </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredTrucks.map(truck => (
          <Card 
            key={truck.id} 
            className="group hover:border-brand-200 cursor-pointer active:scale-[0.99] transition-all"
            onClick={() => handleTruckClick(truck)}
          >
            <CardContent>
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-brand-50 transition-colors text-slate-500 group-hover:text-brand-600">
                    <TruckIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-900">{truck.plate}</h4>
                    <p className="text-sm text-slate-500">{truck.model}</p>
                  </div>
                </div>
                <Badge variant={getStatusVariant(truck.status)}>{truck.status}</Badge>
              </div>
              
              <div className="grid grid-cols-3 gap-2 text-sm mt-4 pt-4 border-t border-slate-50">
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 flex items-center gap-1"><Activity className="w-3 h-3" /> Health</span>
                  <span className={`font-medium ${truck.healthScore < 70 ? 'text-rose-600' : 'text-slate-700'}`}>
                    {truck.healthScore}%
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 flex items-center gap-1"><FileText className="w-3 h-3" /> Mileage</span>
                  <span className="font-medium text-slate-700">{(truck.mileage / 1000).toFixed(1)}k km</span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-slate-400 flex items-center gap-1"><Calendar className="w-3 h-3" /> Purchase</span>
                  <span className="font-medium text-slate-700">{new Date(truck.purchaseDate).getFullYear()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredTrucks.length === 0 && (
          <div className="col-span-full py-12 text-center text-slate-400">
            No trucks found matching your filters.
          </div>
        )}
      </div>

      {/* Truck Detail Modal */}
      <Modal
        isOpen={!!selectedTruck}
        onClose={() => setSelectedTruck(null)}
        title={selectedTruck ? `${selectedTruck.plate} - ${selectedTruck.model}` : 'Details'}
      >
        {selectedTruck && (
          <div className="space-y-6">
            {/* Header Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Total Mileage</p>
                <p className="text-xl font-bold text-slate-900">{(selectedTruck.mileage / 1000).toFixed(1)}k <span className="text-sm font-normal text-slate-400">km</span></p>
              </div>
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Purchase Year</p>
                <p className="text-xl font-bold text-slate-900">{new Date(selectedTruck.purchaseDate).getFullYear()}</p>
              </div>
               <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <p className="text-slate-500 text-xs uppercase tracking-wide mb-1">Health Score</p>
                <div className="flex items-center gap-2">
                    <p className={`text-xl font-bold ${selectedTruck.healthScore >= 90 ? 'text-emerald-600' : selectedTruck.healthScore >= 75 ? 'text-amber-600' : 'text-rose-600'}`}>
                        {selectedTruck.healthScore}
                    </p>
                    <div className="h-2 flex-1 bg-slate-200 rounded-full min-w-[40px]">
                        <div 
                            className={`h-full rounded-full ${selectedTruck.healthScore >= 90 ? 'bg-emerald-500' : selectedTruck.healthScore >= 75 ? 'bg-amber-500' : 'bg-rose-500'}`} 
                            style={{ width: `${selectedTruck.healthScore}%` }}
                        />
                    </div>
                </div>
              </div>
            </div>

            {/* AI Prediction Section */}
            <div className="relative overflow-hidden rounded-2xl bg-brand-50 border border-brand-200 text-slate-900 p-6 shadow-soft-sm">
               {loadingPrediction && <AILoadingSparkle />}
               
               <div className="flex items-center gap-2 mb-4 relative z-20">
                 <div className="relative">
                   <TrendingUp className="w-5 h-5 text-brand-600" />
                   {!loadingPrediction && prediction && (
                     <svg className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500 animate-ping" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                     </svg>
                   )}
                 </div>
                 <h3 className="font-semibold text-lg text-slate-900">AI Lifecycle Prediction</h3>
               </div>

               {loadingPrediction ? (
                 <div className="space-y-3 animate-pulse relative z-20">
                   <div className="h-4 bg-brand-200/50 rounded w-3/4"></div>
                   <div className="h-4 bg-brand-200/50 rounded w-1/2"></div>
                   <div className="h-4 bg-brand-200/50 rounded w-5/6"></div>
                 </div>
               ) : (
                 <div className="prose prose-sm relative z-20 markdown-body max-w-none text-slate-700">
                   <Markdown>{prediction}</Markdown>
                 </div>
               )}
            </div>

             {/* Bottom Grid: Maintenance History & Calendar */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* Maintenance History Stub */}
                 <div>
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-400" />
                        Recent Issues
                    </h4>
                    <div className="space-y-3">
                        <div className="flex gap-4 p-3 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors">
                            <div className="text-slate-400 text-sm w-24">Dec 2025</div>
                            <div>
                                <p className="text-sm font-medium text-slate-900">Routine Inspection</p>
                                <p className="text-xs text-slate-500">Passed with minor warnings on tire pressure.</p>
                            </div>
                        </div>
                        {selectedTruck.healthScore < 80 && (
                            <div className="flex gap-4 p-3 rounded-xl border border-rose-100 bg-rose-50/30">
                                <div className="text-rose-400 text-sm w-24">Nov 2025</div>
                                <div>
                                    <p className="text-sm font-medium text-rose-900">Brake System Alert</p>
                                    <p className="text-xs text-rose-600">Sensor reported irregular pressure.</p>
                                </div>
                            </div>
                        )}
                    </div>
                 </div>

                 {/* Maintenance Calendar */}
                 <div>
                    <h4 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        Schedule
                    </h4>
                    <MaintenanceCalendar />
                 </div>
             </div>

             <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <Button variant="outline" onClick={() => setSelectedTruck(null)}>Close</Button>
                {selectedTruck.status !== TruckStatus.MAINTENANCE && (
                   <Button 
                    variant="danger" 
                    icon={<Wrench className="w-4 h-4" />}
                    onClick={handleScheduleMaintenance}
                   >
                     Schedule Maintenance
                   </Button>
                )}
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
};