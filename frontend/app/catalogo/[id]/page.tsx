'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product } from '@/types';
import { api } from '@/services/api';
import { useAuth, useCart } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function ProductDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    api.getProduct(Number(id))
      .then(setProduct)
      .catch(() => router.push('/catalogo'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setAdding(true);
    setMessage('');
    try {
      await addToCart(product!.id, quantity);
      setMessage('Producto agregado al carrito');
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Error al agregar');
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-square bg-gray-200 rounded-xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-1/2" />
            <div className="h-20 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link href="/catalogo" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Volver al catálogo
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="aspect-square relative bg-gray-100 rounded-xl overflow-hidden">
          {product.imagen ? (
            <Image src={product.imagen} alt={product.nombre} fill className="object-cover" sizes="50vw" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">Sin imagen</div>
          )}
        </div>

        <div>
          {product.category && (
            <span className="text-sm text-primary-600 font-medium">{product.category.nombre}</span>
          )}
          <h1 className="text-3xl font-bold text-gray-900 mt-1">{product.nombre}</h1>
          <p className="text-3xl font-bold text-primary-600 mt-4">S/ {product.precio.toFixed(2)}</p>

          <div className="mt-4">
            {product.disponible ? (
              <span className="text-green-600 text-sm font-medium">
                En stock ({product.stock} disponibles)
              </span>
            ) : (
              <span className="text-red-600 text-sm font-medium">Agotado</span>
            )}
          </div>

          {product.descripcion && (
            <p className="mt-6 text-gray-600 leading-relaxed">{product.descripcion}</p>
          )}

          {product.disponible && (
            <div className="mt-8 space-y-4">
              <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Cantidad:</label>
                <div className="flex items-center border rounded-lg">
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    className="px-3 py-2 hover:bg-gray-100"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  >
                    +
                  </button>
                </div>
              </div>

              <Button onClick={handleAddToCart} loading={adding} size="lg" className="w-full md:w-auto">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Agregar al Carrito
              </Button>

              {message && (
                <p className={`text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                  {message}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
