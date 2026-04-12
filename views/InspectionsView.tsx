import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Inspection, Truck, InspectionDecision } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchFilter } from '../components/ui/SearchFilter';
import { analyzeInspection } from '../services/geminiService';
import { AlertCircle, CheckCircle, Sparkles, Wrench, Calendar, Gauge } from 'lucide-react';
import { AILoadingSparkle } from '../components/ui/AILoadingSparkle';

interface InspectionsViewProps {
  inspections: Inspection[];
  trucks: Truck[];
}

export const InspectionsView: React.FC<InspectionsViewProps> = ({ inspections, trucks }) => {
  const [selectedInspection, setSelectedInspection] = useState<Inspection | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const selectedTruck = selectedInspection ? trucks.find(t => t.id === selectedInspection.truckId) : null;

  const handleAnalyze = async (inspection: Inspection) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    
    const truck = trucks.find(t => t.id === inspection.truckId);
    if (truck) {
      const result = await analyzeInspection(inspection, truck);
      setAnalysisResult(result);
    }
    
    setIsAnalyzing(false);
  };

  const filteredInspections = inspections.filter(ins => {
    const truck = trucks.find(t => t.id === ins.truckId);
    const searchString = `${ins.id} ${truck?.plate || ''} ${ins.inspectorName}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in duration-500 items-start">
      {/* List */}
      <div className="lg:col-span-1 lg:h-[calc(100vh-9rem)] flex flex-col">
        <div className="sticky top-0 bg-[#f8fafc]/95 backdrop-blur-sm z-10 py-2 mb-2 border-b border-slate-100/50 space-y-3">
           <h2 className="text-lg font-semibold text-slate-900">Pending Review</h2>
           <SearchFilter 
             searchTerm={searchTerm} 
             onSearchChange={setSearchTerm} 
             placeholder="Search inspection ID or plate..." 
           />
        </div>
        <div className="overflow-y-auto custom-scrollbar pb-12 pr-1 space-y-4 flex-1">
          {filteredInspections.map(ins => (
            <Card 
              key={ins.id} 
              className={`cursor-pointer transition-all ${selectedInspection?.id === ins.id ? 'ring-2 ring-brand-500 border-transparent shadow-soft-sm scale-[1.02]' : 'hover:border-brand-200'}`}
              onClick={() => { setSelectedInspection(ins); setAnalysisResult(null); }}
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-slate-900">Truck {trucks.find(t => t.id === ins.truckId)?.plate}</h4>
                    <p className="text-xs text-slate-500 mt-1">Inspected by {ins.inspectorName}</p>
                  </div>
                  <Badge variant={ins.decision === InspectionDecision.PENDING ? 'warning' : 'neutral'}>
                    {ins.decision}
                  </Badge>
                </div>
                <div className="mt-3 flex gap-2">
                  <div className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-md">{ins.date}</div>
                  {ins.items.some(i => i.status === 'Fail') && (
                    <div className="text-xs bg-rose-100 text-rose-700 px-2 py-1 rounded-md flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" /> Critical Issues
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {filteredInspections.length === 0 && (
             <p className="text-slate-400 text-sm text-center py-8">No inspections match.</p>
          )}
        </div>
      </div>

      {/* Detail & AI Analysis */}
      <div className="lg:col-span-2 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto custom-scrollbar pb-12">
        {selectedInspection ? (
          <div className="space-y-6">
            <Card glass>
              <CardHeader 
                title={`Inspection Report: ${selectedInspection.id}`}
                subtitle={selectedTruck ? `${selectedTruck.model} • ${selectedTruck.plate}` : selectedInspection.date}
                action={
                  <div className="relative inline-block">
                    <Button 
                      variant="primary" 
                      size="sm" 
                      icon={<Sparkles className="w-4 h-4" />}
                      onClick={() => handleAnalyze(selectedInspection)}
                      isLoading={isAnalyzing}
                      disabled={!!analysisResult}
                    >
                      AI Analyze
                    </Button>
                    {isAnalyzing && <AILoadingSparkle />}
                  </div>
                }
              />
              <CardContent className="space-y-6">
                
                {/* Truck Details Context */}
                {selectedTruck && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50/80 rounded-xl border border-slate-100">
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                        <Gauge className="w-3 h-3" /> Mileage
                      </div>
                      <p className="font-semibold text-slate-700">{(selectedTruck.mileage / 1000).toFixed(1)}k km</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                        <Calendar className="w-3 h-3" /> Purchase Date
                      </div>
                      <p className="font-semibold text-slate-700">{selectedTruck.purchaseDate}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                        <Calendar className="w-3 h-3" /> Inspection Date
                      </div>
                      <p className="font-semibold text-slate-700">{selectedInspection.date}</p>
                    </div>
                    <div>
                       <div className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">
                        Inspector
                      </div>
                      <p className="font-semibold text-slate-700">{selectedInspection.inspectorName}</p>
                    </div>
                  </div>
                )}

                {/* AI Result Section */}
                {analysisResult && (
                  <div className="bg-brand-50 border border-brand-200 rounded-xl p-4 animate-in slide-in-from-top-2">
                    <div className="flex items-center gap-2 mb-2 text-brand-700 font-medium">
                      <div className="relative">
                        <Sparkles className="w-4 h-4" />
                        <svg className="absolute -top-1 -right-1 w-2.5 h-2.5 text-emerald-500 animate-ping" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      Gemini Recommendation
                    </div>
                    <div className="text-sm text-slate-700 markdown-body prose prose-sm max-w-none">
                      <Markdown>{analysisResult}</Markdown>
                    </div>
                    <div className="mt-4 flex gap-3">
                      <Button size="sm" variant="secondary" className="bg-white" icon={<CheckCircle className="w-4 h-4" />}>Approve for Dispatch</Button>
                      <Button size="sm" variant="danger" className="bg-white" icon={<Wrench className="w-4 h-4" />}>Send to Workshop</Button>
                    </div>
                  </div>
                )}

                {/* Checklist */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-3 uppercase tracking-wider">Checklist Items</h4>
                  <div className="space-y-3">
                    {selectedInspection.items.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-4 p-3 bg-slate-50 rounded-lg">
                        <div className={`mt-0.5 w-2 h-2 rounded-full ${
                          item.status === 'Pass' ? 'bg-emerald-500' : 
                          item.status === 'Fail' ? 'bg-rose-500' : 'bg-amber-500'
                        }`} />
                        <div className="flex-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium text-slate-700">{item.category}</span>
                            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
                              item.status === 'Pass' ? 'text-emerald-700 bg-emerald-50' : 
                              item.status === 'Fail' ? 'text-rose-700 bg-rose-50' : 'text-amber-700 bg-amber-50'
                            }`}>{item.status}</span>
                          </div>
                          <p className="text-sm text-slate-500 mt-1">{item.notes}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Overall Notes */}
                <div>
                  <h4 className="text-sm font-medium text-slate-900 mb-2 uppercase tracking-wider">Inspector Notes</h4>
                  <div className="p-4 bg-yellow-50/50 border border-yellow-100 rounded-xl text-slate-700 text-sm italic">
                    "{selectedInspection.overallNotes}"
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center p-12 text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
            Select an inspection report to review
          </div>
        )}
      </div>
    </div>
  );
};