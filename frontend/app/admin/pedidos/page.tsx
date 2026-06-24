'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Order, OrderStatus } from '@/types';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Select } from '@/components/ui/Input';

const STATUS_OPTIONS: OrderStatus[] = ['PENDIENTE', 'PAGADO', 'ENVIADO', 'ENTREGADO', 'CANCELADO'];

export default function AdminOrdersPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/');
  }, [isAdmin, authLoading, router]);

  const loadOrders = () => {
    api.getAllOrders(1, undefined)
      .then(({ orders }) => setOrders(orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) loadOrders();
  }, [isAdmin]);

  const handleStatusChange = async (orderId: number, estado: string) => {
    try {
      await api.updateOrderStatus(orderId, estado);
      loadOrders();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al actualizar estado');
    }
  };

  if (loading) return <div className="p-16 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">Gestión de Pedidos</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">#</th>
              <th className="text-left p-3">Cliente</th>
              <th className="text-left p-3">Total</th>
              <th className="text-left p-3">Estado</th>
              <th className="text-left p-3">Fecha</th>
              <th className="text-left p-3">Cambiar Estado</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-t">
                <td className="p-3 font-medium">#{order.id}</td>
                <td className="p-3">{order.user?.nombre || 'N/A'}</td>
                <td className="p-3">S/ {order.total.toFixed(2)}</td>
                <td className="p-3"><OrderStatusBadge status={order.estado} /></td>
                <td className="p-3">{new Date(order.fecha).toLocaleDateString('es-PE')}</td>
                <td className="p-3">
                  <select
                    value={order.estado}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border rounded px-2 py-1 text-xs"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
