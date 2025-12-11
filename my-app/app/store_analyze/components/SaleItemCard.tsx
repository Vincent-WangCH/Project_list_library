"use client";

import { Pencil, Trash2, Package } from "lucide-react";
import { SaleItem } from "../types";

interface SaleItemCardProps {
  item: SaleItem;
  onEdit: (item: SaleItem) => void;
  onDelete: (id: string) => void;
}

export function SaleItemCard({ item, onEdit, onDelete }: SaleItemCardProps) {
  const quantity = item.quantity ?? 0;
  const unitPrice = item.unitPrice ?? 0;
  const totalValue = quantity * unitPrice;

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <Package className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{item.name}</h3>
            {item.description && (
              <p className="text-sm text-gray-500 mt-1">{item.description}</p>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(item)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit item"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500">Quantity:</span>
          <span className="ml-2 font-medium text-gray-900">{item.quantity}</span>
        </div>
        <div>
          <span className="text-gray-500">Unit Price:</span>
          <span className="ml-2 font-medium text-gray-900">
            ${unitPrice.toFixed(2)}
          </span>
        </div>
        <div>
          <span className="text-gray-500">Category:</span>
          <span className="ml-2 font-medium text-gray-900">{item.category}</span>
        </div>
        <div>
          <span className="text-gray-500">Date:</span>
          <span className="ml-2 font-medium text-gray-900">{item.date}</span>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
        <span className="text-sm text-gray-500">Total Value</span>
        <span className="text-lg font-bold text-emerald-600">
          ${totalValue.toFixed(2)}
        </span>
      </div>
    </div>
  );
}

