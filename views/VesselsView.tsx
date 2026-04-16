import React, { useState } from 'react';
import { Vessel, VesselStatus, Truck } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Ship, Anchor, Navigation, Sparkles, Clock, Package, MapPin } from 'lucide-react';
import { analyzeVesselArrivals } from '../services/openRouterService';
import Markdown from 'react-markdown';
import { AILoadingSparkle } from '../components/ui/AILoadingSparkle';

interface VesselsViewProps {
  vessels: Vessel[];
  trucks: Truck[];
  onGenerateDispatch: (vessel: Vessel) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'error') => void;
}

export const VesselsView: React.FC<VesselsViewProps> = ({ vessels, trucks, onGenerateDispatch, onShowToast }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    const result = await analyzeVesselArrivals(vessels, trucks);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  const getStatusColor = (status: VesselStatus) => {
    switch (status) {
      case VesselStatus.DOCKED:
      case VesselStatus.UNLOADING:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case VesselStatus.ARRIVING:
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case VesselStatus.IN_TRANSIT:
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getStatusIcon = (status: VesselStatus) => {
    switch (status) {
      case VesselStatus.DOCKED:
      case VesselStatus.UNLOADING:
        return <Anchor className="w-4 h-4" />;
      case VesselStatus.ARRIVING:
      case VesselStatus.IN_TRANSIT:
        return <Navigation className="w-4 h-4" />;
      default:
        return <Ship className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-display italic text-slate-900">Port Operations</h1>
          <p className="text-slate-500 mt-1">Incoming vessels and barge integration</p>
        </div>
        <Button 
          onClick={() => onShowToast("Port schedule sync initiated", "info")}
          className="bg-white border-slate-200 text-slate-700 hover:bg-slate-50 shadow-soft-sm"
          icon={<Ship className="w-4 h-4" />}
        >
          Sync Schedule
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Vessel List */}
        <div className="lg:col-span-2 space-y-4">
          {vessels.map(vessel => (
            <Card key={vessel.id} className="border-none shadow-none bg-slate-50/50 hover:bg-slate-100/50 transition-all">
              <CardContent className="p-5">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${getStatusColor(vessel.status).replace('border-', '').replace('text-', 'bg-opacity-20 text-')}`}>
                      {getStatusIcon(vessel.status)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-900 text-lg">{vessel.name}</h3>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(vessel.status)}`}>
                          {vessel.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-slate-600">
                        <div className="flex items-center gap-1.5">
                          <Ship className="w-4 h-4 text-slate-400" />
                          {vessel.type}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Package className="w-4 h-4 text-slate-400" />
                          {vessel.cargoWeight}t {vessel.cargoType}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-slate-400" />
                          {vessel.destinationTerminal}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-slate-400" />
                          ETA: {new Date(vessel.eta).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-shrink-0 w-full sm:w-auto">
                    {(vessel.status === VesselStatus.DOCKED || vessel.status === VesselStatus.ARRIVING) && (
                      <Button 
                        onClick={() => onGenerateDispatch(vessel)}
                        className="w-full sm:w-auto bg-slate-900 text-white hover:bg-slate-800 shadow-soft-sm"
                      >
                        Generate Dispatch
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Right Column: AI Analysis */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-slate-50/50 border-none shadow-none rounded-2xl sticky top-6">
            <CardHeader 
              title="Port Intelligence"
              subtitle="AI-driven logistics readiness"
            />
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="relative">
                <Button 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="bg-brand-500 hover:bg-brand-600 text-white border-none shadow-soft-sm w-full relative overflow-hidden"
                >
                  {isAnalyzing && <div className="shimmer-overlay"></div>}
                  <span className="relative z-10">{isAnalyzing ? 'Analyzing Port Readiness...' : 'Analyze Port Readiness'}</span>
                </Button>
                {isAnalyzing && <AILoadingSparkle />}
              </div>

              {aiAnalysis && (
                <div className="mt-6 p-5 bg-white rounded-xl border border-brand-100 shadow-soft-sm animate-in fade-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-brand-600" />
                    <h4 className="font-display italic font-semibold text-brand-900 text-lg">AI Assessment</h4>
                  </div>
                  <div className="markdown-body text-sm text-slate-700">
                    <Markdown>{aiAnalysis}</Markdown>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
