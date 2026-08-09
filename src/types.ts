export interface Product {
  id: string;
  title: string;
  category: string; // e.g. "Residential", "Commercial", "Hospitality", "Bespoke Furniture"
  subtitle: string;
  price: number; // in IDR (Rupiah)
  imageUrl: string;
  description: string;
  features: string[];
  dimensions?: string;
  leadTime?: string;
  isCustomizable?: boolean;
  createdAt: string;
}

export interface OrderItem {
  productId: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export type OrderStatus = 'Pending' | 'In Consultation' | 'In Production' | 'Completed' | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  projectAddress?: string;
  items: OrderItem[];
  totalAmount: number;
  notes?: string;
  status: OrderStatus;
  createdAt: string;
}

export interface CorePrinciple {
  icon: string;
  title: string;
  description: string;
}
