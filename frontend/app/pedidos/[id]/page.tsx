'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Order } from '@/types';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { Button } from '@/components/ui/Button';

export default function PedidoDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      api.getOrder(Number(id))
        .then(setOrder)
        .catch(() => router.push('/pedidos'))
        .finally(() => setLoading(false));
    }
  }, [id, user, router]);

  const handlePay = async () => {
    if (!order) return;
    try {
      const payment = await api.createPaymentPreference(order.id);
      const url = payment.initPoint || payment.sandboxInitPoint;
      if (url) window.location.href = url;
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error al crear pago');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-16 text-center text-gray-500">Cargando...</div>;
  }

  if (!order) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/pedidos" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver a pedidos
      </Link>

      <div className="bg-white rounded-xl border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">Pedido #{order.id}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {new Date(order.fecha).toLocaleDateString('es-PE', {
                year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit',
              })}
            </p>
          </div>
          <OrderStatusBadge status={order.estado} />
        </div>

        <div className="border-t pt-4 space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product.nombre} x {item.cantidad}</span>
              <span className="font-medium">S/ {item.subtotal.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t mt-4 pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">S/ {order.total.toFixed(2)}</span>
        </div>

        {order.estado === 'PENDIENTE' && (
          <Button onClick={handlePay} className="w-full mt-6">
            Pagar con Mercado Pago
          </Button>
        )}

        {order.payment && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
            <p><strong>Pago:</strong> {order.payment.estado}</p>
            <p><strong>Método:</strong> {order.payment.metodo}</p>
          </div>
        )}
      </div>
    </div>
  );
}
