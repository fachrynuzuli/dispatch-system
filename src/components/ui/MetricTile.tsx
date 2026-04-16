import React from "react";
import { Card, CardContent } from "./Card";
import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface MetricTileProps {
  label: string;
  value: string | number;
  subValue?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  variant?: "blue" | "cyan" | "indigo" | "emerald" | "slate";
  className?: string;
}

export const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  subValue,
  icon: Icon,
  trend,
  trendUp,
  variant = "slate",
  className,
}) => {
  const variants = {
    blue: "from-sky-500 to-blue-600",
    cyan: "from-cyan-400 to-teal-500",
    indigo: "from-blue-400 to-indigo-500",
    emerald: "from-emerald-400 to-cyan-500",
    slate: "from-slate-700 to-slate-900",
  };

  return (
    <Card className={cn("overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-br opacity-90", variants[variant])} />
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[0.5px]" />
      <CardContent className="relative z-10 p-5 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
            <Icon className="w-5 h-5 text-white" />
          </div>
          {trend && (
            <div className={cn(
              "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white/10 backdrop-blur-md",
              trendUp ? "text-emerald-100" : "text-rose-100"
            )}>
              {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {trend}
            </div>
          )}
        </div>
        <div>
          <p className="text-3xl font-display font-bold tracking-tight">{value}</p>
          <p className="text-[11px] font-medium uppercase tracking-wider text-white/70 mt-1">{label}</p>
          {subValue && <p className="text-[10px] text-white/50 mt-0.5">{subValue}</p>}
        </div>
      </CardContent>
    </Card>
  );
};
