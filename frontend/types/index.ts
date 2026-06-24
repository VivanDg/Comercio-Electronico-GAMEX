export type Role = 'CLIENT' | 'ADMIN';

export type OrderStatus = 'PENDIENTE' | 'PAGADO' | 'ENVIADO' | 'ENTREGADO' | 'CANCELADO';

export interface User {
  id: number;
  nombre: string;
  email: string;
  rol: Role;
  createdAt?: string;
}

export interface Category {
  id: number;
  nombre: string;
  descripcion?: string;
  _count?: { products: number };
}

export interface Product {
  id: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  imagen?: string;
  categoryId: number;
  category?: { id: number; nombre: string };
  stock: number;
  disponible: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  cantidad: number;
  product: {
    id: number;
    nombre: string;
    precio: number;
    imagen?: string;
    stock: number;
    category?: { id: number; nombre: string };
  };
  subtotal: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
  itemCount: number;
}

export interface OrderItem {
  id: number;
  productId: number;
  cantidad: number;
  subtotal: number;
  product: { id: number; nombre: string; imagen?: string; precio?: number };
}

export interface Order {
  id: number;
  userId: number;
  fecha: string;
  total: number;
  estado: OrderStatus;
  items: OrderItem[];
  payment?: {
    id: number;
    monto: number;
    estado: string;
    metodo: string;
    preferenceId?: string;
  } | null;
  user?: { id: number; nombre: string; email: string };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface DashboardStats {
  stats: {
    totalUsers: number;
    totalProducts: number;
    totalOrders: number;
    pendingOrders: number;
    paidOrders: number;
    totalRevenue: number;
    lowStockProducts: number;
  };
  ordersByStatus: Array<{ estado: string; count: number }>;
  recentOrders: Array<{
    id: number;
    total: number;
    estado: string;
    fecha: string;
    user: { nombre: string; email: string };
    itemCount: number;
  }>;
  topProducts: Array<{ id: number; nombre: string; imagen?: string; totalSold: number | null }>;
}
