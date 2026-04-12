import React from 'react';
import { Map, Marker, Overlay } from 'pigeon-maps';
import { Truck, TruckStatus } from '../types';
import { Card } from '../components/ui/Card';
import { Truck as TruckIcon } from 'lucide-react';

interface LiveMapViewProps {
  trucks: Truck[];
}

export const LiveMapView: React.FC<LiveMapViewProps> = ({ trucks }) => {
  // Center roughly on Riau/Sumatera
  const defaultCenter: [number, number] = [0.5071, 101.4478];

  const getStatusColor = (status: TruckStatus) => {
    switch (status) {
      case TruckStatus.ON_TRIP: return '#D97757'; // brand-500
      case TruckStatus.AVAILABLE: return '#10b981'; // emerald-500
      case TruckStatus.MAINTENANCE: return '#e11d48'; // rose-600
      default: return '#94a3b8'; // slate-400
    }
  };

  const activeTrucks = trucks.filter(t => t.status === TruckStatus.ON_TRIP || t.status === TruckStatus.AVAILABLE);

  return (
    <div className="h-full flex flex-col space-y-4 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Live Fleet Map</h2>
          <p className="text-slate-500 text-sm">Real-time positions of {activeTrucks.length} active units</p>
        </div>
      </div>

      <div className="flex-1 rounded-2xl overflow-hidden shadow-soft-sm border border-slate-200 bg-slate-50 relative min-h-[500px]">
        <Map 
          defaultCenter={defaultCenter} 
          defaultZoom={9}
          boxClassname="map-container"
        >
          {activeTrucks.map(truck => (
            <Overlay key={truck.id} anchor={truck.location} offset={[15, 30]}>
               <div className="group relative">
                 <div 
                    className="w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center transform transition-all group-hover:scale-110 cursor-pointer border-2"
                    style={{ borderColor: getStatusColor(truck.status) }}
                 >
                   <TruckIcon className="w-4 h-4" style={{ color: getStatusColor(truck.status) }} />
                 </div>
                 
                 {/* Tooltip */}
                 <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block whitespace-nowrap z-50">
                   <div className="bg-slate-900 text-white text-xs py-1.5 px-3 rounded-lg shadow-xl flex flex-col items-center">
                     <span className="font-semibold">{truck.plate}</span>
                     <span className="opacity-80 text-[10px]">{truck.model}</span>
                     <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 rotate-45"></div>
                   </div>
                 </div>
               </div>
            </Overlay>
          ))}
        </Map>

        {/* Legend */}
        <div className="absolute bottom-6 left-6 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-soft-sm border border-slate-200">
          <h4 className="text-xs font-bold uppercase tracking-wide text-slate-500 mb-3">Status Legend</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500"></span>
              <span className="text-sm text-slate-700">On Trip</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
              <span className="text-sm text-slate-700">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span className="text-sm text-slate-700">Maintenance</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};