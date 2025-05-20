
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
};

export function StatCard({ title, value, icon, trend, className }: StatCardProps) {
  return (
    <div className={cn("bg-white rounded-lg shadow-sm p-6", className)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-2xl font-bold mt-1">{value}</h3>
          {trend && (
            <div className="flex items-center mt-2">
              <span
                className={cn(
                  "text-xs font-medium flex items-center",
                  trend.positive ? "text-green-600" : "text-red-600"
                )}
              >
                {trend.positive ? "+" : "-"}{trend.value}%
              </span>
              <span className="text-xs text-gray-500 ml-1">vs last month</span>
            </div>
          )}
        </div>
        <div className="bg-noorcom-100 p-3 rounded-lg">
          {icon}
        </div>
      </div>
    </div>
  );
}
