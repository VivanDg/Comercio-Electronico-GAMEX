'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, useCart } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Button } from '@/components/ui/Button';

export default function CheckoutPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, refreshCart } = useCart();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  if (authLoading) {
    return <div className="max-w-2xl mx-auto px-4 py-16 text-center text-gray-500">Cargando...</div>;
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  if (!cart || cart.items.length === 0) {
    router.push('/carrito');
    return null;
  }

  const handleCheckout = async () => {
    setProcessing(true);
    setError('');
    try {
      const order = await api.createOrder();
      const payment = await api.createPaymentPreference(order.id);
      const paymentUrl = payment.initPoint || payment.sandboxInitPoint;
      if (paymentUrl) {
        window.location.href = paymentUrl;
      } else {
        setError('No se pudo generar el enlace de pago');
      }
      await refreshCart();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pedido');
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="bg-white rounded-xl border p-6 space-y-4">
        <h2 className="font-semibold text-lg">Resumen del Pedido</h2>

        {cart.items.map((item) => (
          <div key={item.id} className="flex justify-between text-sm">
            <span>{item.product.nombre} x {item.cantidad}</span>
            <span className="font-medium">S/ {item.subtotal.toFixed(2)}</span>
          </div>
        ))}

        <div className="border-t pt-4 flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary-600">S/ {cart.total.toFixed(2)}</span>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          Serás redirigido a Mercado Pago para completar el pago de forma segura.
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <Button onClick={handleCheckout} loading={processing} size="lg" className="w-full">
          Pagar con Mercado Pago
        </Button>
      </div>
    </div>
  );
}
