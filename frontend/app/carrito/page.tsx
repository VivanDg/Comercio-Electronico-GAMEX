'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag } from 'lucide-react';
import { useAuth, useCart } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function CarritoPage() {
  const { user, loading: authLoading } = useAuth();
  const { cart, loading, updateQuantity, removeItem } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [user, authLoading, router]);

  if (authLoading || loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <p className="text-gray-500">Cargando carrito...</p>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-gray-900">Tu carrito está vacío</h1>
        <p className="text-gray-500 mt-2">Agrega productos desde el catálogo</p>
        <Link href="/catalogo">
          <Button className="mt-6">Ver Catálogo</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <div className="space-y-4">
        {cart.items.map((item) => (
          <div key={item.id} className="bg-white rounded-xl border p-4 flex gap-4">
            <div className="w-20 h-20 relative bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.imagen && (
                <Image src={item.product.imagen} alt={item.product.nombre} fill className="object-cover" />
              )}
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{item.product.nombre}</h3>
              <p className="text-primary-600 font-medium">S/ {item.product.precio.toFixed(2)}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center border rounded-lg text-sm">
                  <button
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item.productId, Math.max(1, item.cantidad - 1))}
                  >
                    -
                  </button>
                  <span className="px-3 py-1 border-x">{item.cantidad}</span>
                  <button
                    className="px-2 py-1 hover:bg-gray-100"
                    onClick={() => updateQuantity(item.productId, Math.min(item.product.stock, item.cantidad + 1))}
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.productId)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold">S/ {item.subtotal.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-xl border p-6">
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold">Total</span>
          <span className="text-2xl font-bold text-primary-600">S/ {cart.total.toFixed(2)}</span>
        </div>
        <Link href="/checkout">
          <Button size="lg" className="w-full mt-4">
            Proceder al Pago
          </Button>
        </Link>
      </div>
    </div>
  );
}
