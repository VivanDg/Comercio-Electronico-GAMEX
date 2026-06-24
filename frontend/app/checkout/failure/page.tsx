'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function CheckoutFailurePage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold text-gray-900">Pago Rechazado</h1>
      <p className="text-gray-600 mt-2">
        No se pudo procesar tu pago. Intenta nuevamente.
      </p>
      <div className="flex gap-4 justify-center mt-8">
        <Link href="/checkout">
          <Button>Reintentar Pago</Button>
        </Link>
        <Link href="/carrito">
          <Button variant="outline">Volver al Carrito</Button>
        </Link>
      </div>
    </div>
  );
}
