'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function PendingContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <Clock className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">Pago Pendiente</h1>
      <p className="text-gray-600 mt-2">
        Tu pago está siendo procesado. Te notificaremos cuando se confirme.
      </p>
      {orderId && (
        <Link href={`/pedidos/${orderId}`} className="inline-block mt-8">
          <Button>Ver Pedido</Button>
        </Link>
      )}
    </div>
  );
}

export default function CheckoutPendingPage() {
  return (
    <Suspense fallback={<div className="text-center py-16 text-gray-500">Cargando...</div>}>
      <PendingContent />
    </Suspense>
  );
}
