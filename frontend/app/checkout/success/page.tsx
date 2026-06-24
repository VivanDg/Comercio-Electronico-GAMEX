'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">¡Pago Exitoso!</h1>
      <p className="text-gray-600 mt-2">
        Tu pedido {orderId ? `#${orderId}` : ''} ha sido procesado correctamente.
      </p>
      <div className="flex gap-4 justify-center mt-8">
        {orderId && (
          <Link href={`/pedidos/${orderId}`}>
            <Button>Ver Pedido</Button>
          </Link>
        )}
        <Link href="/catalogo">
          <Button variant="outline">Seguir Comprando</Button>
        </Link>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">Cargando...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
