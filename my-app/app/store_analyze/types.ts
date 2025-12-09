export interface SaleItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unitPrice: number;
  category: string;
  date: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface CreateSaleItemInput {
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  category?: string;
  date?: string;
}

export interface UpdateSaleItemInput {
  name?: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  category?: string;
  date?: string;
}

export interface SalesStore {
  items: SaleItem[];
  lastUpdated: string;
}

export type SortField = "name" | "date" | "quantity" | "unitPrice" | "category";
export type SortOrder = "asc" | "desc";

export interface SalesFilter {
  category?: string;
  startDate?: string;
  endDate?: string;
  searchQuery?: string;
}

