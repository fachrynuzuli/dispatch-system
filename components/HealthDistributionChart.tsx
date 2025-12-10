import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Truck } from '../types';
import { Card, CardContent } from './ui/Card';

interface HealthDistributionChartProps {
  trucks: Truck[];
}

export const HealthDistributionChart: React.FC<HealthDistributionChartProps> = ({ trucks }) => {
  const data = [
    { name: 'Good (90+)', value: 0, color: '#10b981' }, // emerald-500
    { name: 'Fair (75-89)', value: 0, color: '#f59e0b' }, // amber-500
    { name: 'Poor (<75)', value: 0, color: '#f43f5e' }, // rose-500
  ];

  trucks.forEach(t => {
    if (t.healthScore >= 90) data[0].value++;
    else if (t.healthScore >= 75) data[1].value++;
    else data[2].value++;
  });

  const activeData = data.filter(d => d.value > 0);

  return (
    <Card className="h-full min-h-[300px]">
      <CardContent className="h-full flex flex-col">
        <h3 className="font-semibold text-slate-900 mb-2">Fleet Health Status</h3>
        <div className="flex-1 w-full relative">
            {activeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <Pie
                    data={activeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {activeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                        borderRadius: '12px', 
                        border: 'none', 
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        fontSize: '12px'
                    }} 
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value, entry: any) => <span className="text-slate-600 text-xs font-medium ml-1">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
                <div className="flex h-full items-center justify-center text-slate-400 text-sm">No data available</div>
            )}
            
            {/* Center Summary Label */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none pb-8">
                <div className="text-center">
                    <span className="block text-2xl font-bold text-slate-900">{trucks.length}</span>
                    <span className="block text-xs text-slate-400 uppercase tracking-wide">Total</span>
                </div>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};