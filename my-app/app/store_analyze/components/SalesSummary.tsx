"use client";

import { Package, DollarSign, TrendingUp, Layers } from "lucide-react";
import { SaleItem } from "../types";

interface SalesSummaryProps {
  items: SaleItem[];
}

export function SalesSummary({ items }: SalesSummaryProps) {
  const totalItems = items.length;
  const totalQuantity = items.reduce((sum, item) => sum + (item.quantity ?? 0), 0);
  const totalValue = items.reduce(
    (sum, item) => sum + (item.quantity ?? 0) * (item.unitPrice ?? 0),
    0
  );
  const uniqueCategories = new Set(items.map((item) => item.category)).size;

  const stats = [
    {
      label: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      color: "bg-blue-100 text-blue-600",
    },
    {
      label: "Total Quantity",
      value: totalQuantity.toString(),
      icon: Layers,
      color: "bg-purple-100 text-purple-600",
    },
    {
      label: "Total Value",
      value: `$${totalValue.toFixed(2)}`,
      icon: DollarSign,
      color: "bg-emerald-100 text-emerald-600",
    },
    {
      label: "Categories",
      value: uniqueCategories.toString(),
      icon: TrendingUp,
      color: "bg-orange-100 text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{stat.label}</p>
              <p className="text-xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

