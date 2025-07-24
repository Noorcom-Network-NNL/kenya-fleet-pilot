
import React from "react";
import { cn } from "@/lib/utils";

type StatCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
  className?: string;
  onClick?: () => void;
};

export function StatCard({ title, value, icon, trend, className, onClick }: StatCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6 transition-all duration-200",
        onClick && "cursor-pointer hover:shadow-md hover:scale-[1.02]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-500 truncate">{title}</p>
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mt-1 truncate">{value}</h3>
          {trend && (
            <div className="flex items-center mt-1 sm:mt-2">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1 hidden sm:inline">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-noorcom-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
          <div className="h-4 w-4 sm:h-5 sm:w-5">{icon}</div>
        </div>
      </div>
    </div>
  );
}
