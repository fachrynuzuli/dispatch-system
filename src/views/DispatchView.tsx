import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { DispatchRequest, Truck, DispatchAssignment, Driver } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchFilter } from '../components/ui/SearchFilter';
import { optimizeDispatch } from '../services/openRouterService';
import { MapPin, Package, BrainCircuit, ArrowRight, Check, X, Truck as TruckIcon, User, ShieldCheck } from 'lucide-react';
import { AILoadingSparkle } from '../components/ui/AILoadingSparkle';
import { Modal } from '../components/ui/Modal';

interface DispatchViewProps {
  requests: DispatchRequest[];
  trucks: Truck[];
  drivers: Driver[];
  onManualAssign?: (requestId: string, truckId: string, driverId: string) => void;
}

export const DispatchView: React.FC<DispatchViewProps> = ({ requests, trucks, drivers, onManualAssign }) => {
  // Local state to manage requests so we can simulate "Assigning" them
  const [localRequests, setLocalRequests] = useState(requests);
  const [proposedAssignments, setProposedAssignments] = useState<DispatchAssignment[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Search state
  const [searchTerm, setSearchTerm] = useState('');

  // Manual Assign Modal State
  const [manualAssignRequest, setManualAssignRequest] = useState<DispatchRequest | null>(null);
  const [selectedTruckId, setSelectedTruckId] = useState<string>('');
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');

  const handleOptimize = async () => {
    setLoading(true);
    setProposedAssignments([]); // Clear previous
    const assignments = await optimizeDispatch(localRequests, trucks, drivers);
    setProposedAssignments(assignments);
    setLoading(false);
  };

  const handleApplyAssignment = (assignment: DispatchAssignment) => {
    // 1. Mark request as assigned in local state
    setLocalRequests(prev => prev.map(req => 
      req.id === assignment.requestId 
        ? { ...req, status: 'Assigned', assignedTruckId: assignment.truckId, assignedDriverId: assignment.driverId } 
        : req
    ));
    // 2. Remove this assignment suggestion from the list
    setProposedAssignments(prev => prev.filter(a => a.requestId !== assignment.requestId));
    // 3. Call global handler if provided
    onManualAssign?.(assignment.requestId, assignment.truckId, assignment.driverId);
  };

  const handleConfirmManualAssign = () => {
    if (manualAssignRequest && selectedTruckId && selectedDriverId) {
      setLocalRequests(prev => prev.map(req => 
        req.id === manualAssignRequest.id 
          ? { ...req, status: 'Assigned', assignedTruckId: selectedTruckId, assignedDriverId: selectedDriverId } 
          : req
      ));
      onManualAssign?.(manualAssignRequest.id, selectedTruckId, selectedDriverId);
      setManualAssignRequest(null);
      setSelectedTruckId('');
      setSelectedDriverId('');
    }
  };

  // Filter Logic
  const pendingRequests = localRequests.filter(r => r.status === 'Pending').filter(r => {
    return r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
           r.destination.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const assignedRequests = localRequests.filter(r => r.status === 'Assigned');

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Dispatch Command Center</h2>
          <p className="text-slate-500">Optimize Fleet & Crew Assignments</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <SearchFilter 
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search Pending Requests..."
            />
            <div className="relative inline-block">
              <Button 
              onClick={handleOptimize} 
              isLoading={loading}
              icon={<BrainCircuit className="w-5 h-5" />}
              className="bg-brand-500 hover:bg-brand-600 text-white border-none shadow-soft-sm whitespace-nowrap w-full relative overflow-hidden"
              >
              {loading && <div className="shimmer-overlay"></div>}
              <span className="relative z-10">{loading ? 'Optimizing...' : 'Auto-Assign Fleet'}</span>
              </Button>
              {loading && <AILoadingSparkle />}
            </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Column: Requests List */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Proposals Section */}
          {proposedAssignments.length > 0 && (
            <div className="space-y-4 animate-in slide-in-from-top-4 duration-500">
                <div className="flex items-center gap-2 text-brand-700 font-semibold px-1">
                    <div className="relative">
                      <BrainCircuit className="w-5 h-5" />
                      <svg className="absolute -top-1 -right-1 w-3 h-3 text-emerald-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span>AI Proposed Matches ({proposedAssignments.length})</span>
                </div>
                {proposedAssignments.map((assignment, idx) => {
                    const req = localRequests.find(r => r.id === assignment.requestId);
                    const trk = trucks.find(t => t.id === assignment.truckId);
                    const drv = drivers.find(d => d.id === assignment.driverId);
                    
                    if (!req || !trk || !drv) return null;

                    return (
                        <div key={idx} className="bg-white rounded-2xl p-1 shadow-soft-sm border border-brand-200 overflow-hidden relative group">
                            <div className="absolute top-0 left-0 w-1 h-full bg-brand-500"></div>
                            <div className="p-5 flex flex-col gap-4">
                                <div className="flex justify-between items-start">
                                     <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="info" className="bg-brand-50 text-brand-700 border-brand-100">Match Confidence: {(assignment.confidenceScore * 100).toFixed(0)}%</Badge>
                                    </div>
                                    <div className="flex gap-2 shrink-0">
                                        <button onClick={() => setProposedAssignments(prev => prev.filter(a => a !== assignment))} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                                            <X className="w-5 h-5" />
                                        </button>
                                        <Button size="sm" onClick={() => handleApplyAssignment(assignment)} icon={<Check className="w-4 h-4" />}>
                                            Confirm Assignment
                                        </Button>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center bg-slate-50/50 p-4 rounded-xl border border-slate-100">
                                    {/* Request */}
                                    <div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Load</p>
                                        <p className="font-semibold text-slate-900 truncate">{req.customerName}</p>
                                        <p className="text-xs text-slate-500">{req.cargoWeight}t • {req.destination}</p>
                                    </div>
                                    
                                    {/* Truck */}
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-brand-600">
                                            <TruckIcon className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Vehicle</p>
                                            <p className="font-semibold text-slate-900">{trk.plate}</p>
                                            <p className="text-xs text-slate-500">{trk.model}</p>
                                        </div>
                                    </div>

                                    {/* Driver */}
                                    <div className="flex items-center gap-3">
                                         <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm text-emerald-600">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Driver</p>
                                            <p className="font-semibold text-slate-900">{drv.name}</p>
                                            <p className="text-xs text-emerald-600 font-medium flex items-center gap-1">
                                                <ShieldCheck className="w-3 h-3" /> Score: {drv.safetyScore}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-2 items-start">
                                    <BrainCircuit className="w-4 h-4 text-brand-400 mt-0.5 shrink-0" />
                                    <div className="text-sm text-slate-600 markdown-body prose prose-sm max-w-none">
                                        <Markdown>{assignment.reasoning}</Markdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
          )}

          {/* Regular Pending List */}
          <div>
            <h3 className="text-2xl font-display italic text-slate-900 mb-4 px-1">Pending Requests ({pendingRequests.length})</h3>
            <div className="space-y-3">
                {pendingRequests.map(req => (
                    <Card key={req.id} className="group border-none shadow-none bg-slate-50/50 hover:bg-slate-100/50 transition-all">
                    <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-xs text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded">{req.id}</span>
                            <span className="font-semibold text-slate-900">{req.customerName}</span>
                        </div>
                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                            <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4 text-slate-400" /> {req.destination}</span>
                            <span className="flex items-center gap-1.5"><Package className="w-4 h-4 text-slate-400" /> {req.cargoWeight} tons</span>
                        </div>
                        </div>
                        <Button variant="outline" size="sm" onClick={() => setManualAssignRequest(req)}>Manual Assign</Button>
                    </CardContent>
                    </Card>
                ))}
                {pendingRequests.length === 0 && (
                    <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                        No pending requests. Great job!
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Right Column: Recent Activity / Assigned */}
        <div className="space-y-6">
             <Card className="bg-slate-50/50 border-none shadow-none">
                 <CardContent>
                     <h3 className="font-display italic text-xl text-slate-900 mb-4">Recently Assigned</h3>
                     <div className="space-y-4">
                         {assignedRequests.slice(0, 5).map(req => {
                             const assignedDriver = drivers.find(d => d.id === req.assignedDriverId);
                             const assignedTruck = trucks.find(t => t.id === req.assignedTruckId);
                             return (
                             <div key={req.id} className="flex items-start gap-3 pb-3 border-b border-slate-200/60 last:border-0 last:pb-0">
                                 <div className="mt-0.5 p-1.5 bg-emerald-100 text-emerald-600 rounded-full">
                                     <Check className="w-3 h-3" />
                                 </div>
                                 <div>
                                     <p className="text-sm font-medium text-slate-900">{req.customerName}</p>
                                     <div className="flex flex-col gap-0.5 mt-1">
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <TruckIcon className="w-3 h-3" /> {assignedTruck?.plate || 'Unknown Truck'}
                                        </span>
                                        <span className="text-xs text-slate-500 flex items-center gap-1">
                                            <User className="w-3 h-3" /> {assignedDriver?.name || 'Unknown Driver'}
                                        </span>
                                     </div>
                                 </div>
                             </div>
                         )})}
                         {assignedRequests.length === 0 && <p className="text-sm text-slate-400 italic">No assignments yet.</p>}
                     </div>
                 </CardContent>
             </Card>
        </div>

      </div>

      <Modal 
        isOpen={!!manualAssignRequest} 
        onClose={() => setManualAssignRequest(null)}
        title="Manual Dispatch Assignment"
      >
        {manualAssignRequest && (
          <div className="space-y-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-1">Request Details</p>
              <p className="font-semibold text-slate-900">{manualAssignRequest.customerName}</p>
              <p className="text-sm text-slate-600">{manualAssignRequest.cargoWeight} tons • {manualAssignRequest.destination}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Truck</label>
                <select 
                  className="w-full rounded-lg border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  value={selectedTruckId}
                  onChange={(e) => setSelectedTruckId(e.target.value)}
                >
                  <option value="">-- Choose a Truck --</option>
                  {trucks.filter(t => t.status === 'Available').map(t => (
                    <option key={t.id} value={t.id}>{t.plate} ({t.model}) - Health: {t.healthScore}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Select Driver</label>
                <select 
                  className="w-full rounded-lg border-slate-200 shadow-sm focus:border-brand-500 focus:ring-brand-500"
                  value={selectedDriverId}
                  onChange={(e) => setSelectedDriverId(e.target.value)}
                >
                  <option value="">-- Choose a Driver --</option>
                  {drivers.filter(d => d.status === 'Available').map(d => (
                    <option key={d.id} value={d.id}>{d.name} (Safety: {d.safetyScore})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
              <Button variant="secondary" onClick={() => setManualAssignRequest(null)}>Cancel</Button>
              <Button variant="primary" onClick={handleConfirmManualAssign} disabled={!selectedTruckId || !selectedDriverId}>
                Confirm Assignment
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};