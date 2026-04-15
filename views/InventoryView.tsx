import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { SparePart, InventoryStatus, Truck } from '../types';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { SearchFilter } from '../components/ui/SearchFilter';
import { analyzeInventoryNeeds } from '../services/geminiService';
import { Package, AlertCircle, TrendingDown, Sparkles, BrainCircuit, Plus, DollarSign } from 'lucide-react';
import { AILoadingSparkle } from '../components/ui/AILoadingSparkle';

interface InventoryViewProps {
  inventory: SparePart[];
  trucks: Truck[];
  onGeneratePO?: () => void;
  onShowToast?: (msg: string, type: 'success'|'info'|'error') => void;
}

export const InventoryView: React.FC<InventoryViewProps> = ({ inventory, trucks, onGeneratePO, onShowToast }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    const result = await analyzeInventoryNeeds(inventory, trucks);
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const filteredInventory = inventory.filter(part => {
    const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) || part.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || part.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalParts = inventory.length;
  const lowStockCount = inventory.filter(p => p.status === InventoryStatus.LOW_STOCK || p.status === InventoryStatus.OUT_OF_STOCK).length;
  const totalValue = inventory.reduce((sum, part) => sum + (part.stockLevel * part.unitCost), 0);

  return (
    <div className="animate-in fade-in duration-500 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h2 className="text-xl font-bold text-slate-900">Spare Parts Inventory</h2>
           <p className="text-slate-500 text-sm">Manage stock levels and predictive ordering.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SearchFilter
             searchTerm={searchTerm}
             onSearchChange={setSearchTerm}
             activeFilter={statusFilter}
             onFilterChange={setStatusFilter}
             placeholder="Search parts..."
             filterOptions={[
                { label: 'In Stock', value: InventoryStatus.IN_STOCK },
                { label: 'Low Stock', value: InventoryStatus.LOW_STOCK },
                { label: 'Out of Stock', value: InventoryStatus.OUT_OF_STOCK }
             ]}
          />
          <Button 
            variant="primary" 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => onShowToast?.('Add Part modal coming soon.', 'info')}
          >
            Add Part
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white border-slate-200 shadow-soft-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-brand-50 text-brand-600 rounded-xl">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total SKUs</p>
              <p className="text-2xl font-bold text-slate-900">{totalParts}</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white border-slate-200 shadow-soft-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Low/Out of Stock</p>
              <p className="text-2xl font-bold text-slate-900">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border-slate-200 shadow-soft-sm rounded-2xl">
          <CardContent className="p-5 flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Est. Inventory Value</p>
              <p className="text-2xl font-bold text-slate-900">${totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        
        {/* Left Column: Inventory List */}
        <div className="lg:col-span-2 space-y-4">
           <div className="bg-white rounded-2xl shadow-soft-sm border border-slate-200 overflow-hidden">
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500">
                     <th className="p-4 font-medium">Part Details</th>
                     <th className="p-4 font-medium">Category</th>
                     <th className="p-4 font-medium text-right">Stock Level</th>
                     <th className="p-4 font-medium">Status</th>
                     <th className="p-4 font-medium text-right">Unit Cost</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                   {filteredInventory.map(part => (
                     <tr key={part.id} className="hover:bg-slate-50/50 transition-colors">
                       <td className="p-4">
                         <div className="font-medium text-slate-900">{part.name}</div>
                         <div className="text-xs text-slate-500">{part.id} • {part.supplier}</div>
                       </td>
                       <td className="p-4 text-sm text-slate-600">{part.category}</td>
                       <td className="p-4 text-right">
                         <div className="font-medium text-slate-900">{part.stockLevel}</div>
                         <div className="text-xs text-slate-500">Min: {part.minimumStock}</div>
                       </td>
                       <td className="p-4">
                         <Badge variant={
                           part.status === InventoryStatus.IN_STOCK ? 'success' : 
                           part.status === InventoryStatus.LOW_STOCK ? 'warning' : 'danger'
                         }>
                           {part.status}
                         </Badge>
                       </td>
                       <td className="p-4 text-right text-sm font-medium text-slate-700">
                         ${part.unitCost.toLocaleString()}
                       </td>
                     </tr>
                   ))}
                   {filteredInventory.length === 0 && (
                     <tr>
                       <td colSpan={5} className="p-8 text-center text-slate-400">No parts found matching criteria.</td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
           </div>
        </div>

        {/* Right Column: AI Predictive Ordering */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="bg-white border-slate-200 shadow-soft-sm rounded-2xl sticky top-6">
            <CardHeader 
              title="Predictive Ordering"
              subtitle="AI-driven inventory intelligence"
              action={
                <div className="p-2 bg-brand-50 rounded-lg text-brand-600">
                  <BrainCircuit className="w-5 h-5" />
                </div>
              }
            />
            <CardContent className="p-5 space-y-4">
              <p className="text-sm text-slate-600">
                Analyze current fleet health and maintenance schedules to predict upcoming spare part requirements.
              </p>
              
              <div className="relative">
                <Button 
                  onClick={handleAnalyze} 
                  isLoading={isAnalyzing}
                  icon={<Sparkles className="w-4 h-4" />}
                  className="bg-brand-500 hover:bg-brand-600 text-white border-none shadow-soft-sm w-full"
                >
                  {isAnalyzing ? 'Analyzing Fleet Needs...' : 'Run Predictive Analysis'}
                </Button>
                {isAnalyzing && <AILoadingSparkle />}
              </div>

              {analysisResult && (
                <div className="mt-4 bg-brand-50 border border-brand-200 rounded-xl p-4 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2 mb-3 text-brand-700 font-medium">
                    <Sparkles className="w-4 h-4" />
                    AI Procurement Strategy
                  </div>
                  <div className="text-sm text-slate-700 markdown-body prose prose-sm max-w-none">
                    <Markdown>{analysisResult}</Markdown>
                  </div>
                  <div className="mt-4 pt-4 border-t border-brand-200/50">
                    <Button 
                      size="sm" 
                      variant="secondary" 
                      className="w-full bg-white text-brand-700 border-brand-200 hover:bg-brand-50"
                      onClick={() => {
                        onGeneratePO?.();
                        setAnalysisResult(null); // Clear analysis after ordering
                      }}
                    >
                      Generate Purchase Orders
                    </Button>
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
