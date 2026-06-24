'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Package, ShoppingCart, DollarSign, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { DashboardStats } from '@/types';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderStatus } from '@/types';

export default function AdminDashboardPage() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [dashboard, setDashboard] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) router.push('/');
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (isAdmin) {
      api.getDashboard()
        .then(setDashboard)
        .catch(console.error)
        .finally(() => setLoading(false));
    }
  }, [isAdmin]);

  if (authLoading || loading) {
    return <div className="max-w-7xl mx-auto px-4 py-16 text-center text-gray-500">Cargando dashboard...</div>;
  }

  if (!dashboard) return null;

  const { stats } = dashboard;

  const statCards = [
    { label: 'Usuarios', value: stats.totalUsers, icon: Users, color: 'bg-blue-500' },
    { label: 'Productos', value: stats.totalProducts, icon: Package, color: 'bg-green-500' },
    { label: 'Pedidos', value: stats.totalOrders, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Ingresos', value: `S/ ${stats.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'bg-yellow-500' },
    { label: 'Pendientes', value: stats.pendingOrders, icon: AlertTriangle, color: 'bg-orange-500' },
    { label: 'Stock Bajo', value: stats.lowStockProducts, icon: TrendingUp, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Panel de Administración</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border p-6 flex items-center gap-4">
            <div className={`${card.color} p-3 rounded-lg text-white`}>
              <card.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">{card.label}</p>
              <p className="text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Pedidos Recientes</h2>
          <div className="space-y-3">
            {dashboard.recentOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center text-sm border-b pb-2">
                <div>
                  <p className="font-medium">#{order.id} - {order.user.nombre}</p>
                  <p className="text-gray-500">{order.itemCount} items</p>
                </div>
                <div className="text-right">
                  <OrderStatusBadge status={order.estado as OrderStatus} />
                  <p className="font-medium mt-1">S/ {order.total.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-semibold text-lg mb-4">Productos Más Vendidos</h2>
          <div className="space-y-3">
            {dashboard.topProducts.map((product) => (
              <div key={product.id} className="flex justify-between items-center text-sm border-b pb-2">
                <p className="font-medium">{product.nombre}</p>
                <span className="text-gray-500">{product.totalSold} vendidos</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap gap-4">
        <a href="/admin/productos" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
          Gestionar Productos
        </a>
        <a href="/admin/pedidos" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
          Gestionar Pedidos
        </a>
        <a href="/admin/inventario" className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700">
          Gestionar Inventario
        </a>
      </div>
    </div>
  );
}
