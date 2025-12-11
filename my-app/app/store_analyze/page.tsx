"use client";

import { useState, useEffect, useCallback } from "react";
import { ShoppingCart, Plus, Search, RefreshCw, Server } from "lucide-react";
import { SaleItem, CreateSaleItemInput } from "./types";
import { SaleItemCard } from "./components/SaleItemCard";
import { SaleItemForm } from "./components/SaleItemForm";
import { SalesSummary } from "./components/SalesSummary";

export default function StoreAnalyzePage() {
  const [items, setItems] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isBackendWaking, setIsBackendWaking] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SaleItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Health check function to wake up the backend
  const checkBackendHealth = useCallback(async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/health");
      return response.ok;
    } catch {
      return false;
    }
  }, []);

  // Fetch all items with health check
  const fetchItems = useCallback(async () => {
    setIsLoading(true);
    setIsBackendWaking(false);

    try {
      // First, try to make the request
      let response = await fetch("/api/store_analyze");

      // If backend is waking up (503), show the waking state and retry with health check
      if (response.status === 503) {
        const data = await response.json();
        if (data.isBackendWaking) {
          setIsBackendWaking(true);

          // Wait for backend to wake up using health check
          let isHealthy = false;
          let retryCount = 0;
          const maxRetries = 12; // Max 12 retries (about 60 seconds with 5s intervals)

          while (!isHealthy && retryCount < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
            isHealthy = await checkBackendHealth();
            retryCount++;
          }

          if (isHealthy) {
            // Retry the original request
            response = await fetch("/api/store_analyze");
          }
        }
      }

      setIsBackendWaking(false);

      if (response.ok) {
        const data = await response.json();
        setItems(data);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    } finally {
      setIsLoading(false);
      setIsBackendWaking(false);
    }
  }, [checkBackendHealth]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // Create new item
  const handleCreate = async (data: CreateSaleItemInput) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/store_analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchItems();
        setIsFormOpen(false);
      }
    } catch (error) {
      console.error("Error creating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update existing item
  const handleUpdate = async (data: CreateSaleItemInput) => {
    if (!editingItem) return;
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/store_analyze/${editingItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchItems();
        setEditingItem(null);
      }
    } catch (error) {
      console.error("Error updating item:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete item
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      const response = await fetch(`/api/store_analyze/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        await fetchItems();
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  // Filter items based on search
  const filteredItems = items.filter(
    (item) =>
      (item.name ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category ?? "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Store Analyze
              </h1>
              <p className="text-sm text-gray-500">
                Manage your daily store sales
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsFormOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-6 space-y-6">
        {/* Summary */}
        <SalesSummary items={items} />

        {/* Search & Refresh */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
          </div>
          <button
            onClick={fetchItems}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {/* Items Grid */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            {isBackendWaking ? (
              <>
                <Server className="w-12 h-12 text-amber-500 mb-4 animate-pulse" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Waking up the server...
                </h3>
                <p className="text-gray-500 text-center max-w-md">
                  The backend is hosted on a free tier service that sleeps when inactive.
                  Please wait while we wake it up. This may take up to 30-60 seconds.
                </p>
                <div className="mt-4 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />
                  <span className="text-sm text-amber-600">Connecting to server...</span>
                </div>
              </>
            ) : (
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
            )}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? "No items found" : "No sales items yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery
                ? "Try adjusting your search query"
                : "Get started by adding your first sale item"}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add First Item
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <SaleItemCard
                key={item.id}
                item={item}
                onEdit={setEditingItem}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Form Modal */}
      {(isFormOpen || editingItem) && (
        <SaleItemForm
          item={editingItem}
          onSubmit={editingItem ? handleUpdate : handleCreate}
          onCancel={() => {
            setIsFormOpen(false);
            setEditingItem(null);
          }}
          isLoading={isSubmitting}
        />
      )}
    </main>
  );
}

