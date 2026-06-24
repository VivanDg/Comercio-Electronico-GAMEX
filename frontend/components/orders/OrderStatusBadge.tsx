import { OrderStatus } from '@/types';
import clsx from 'clsx';

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  PENDIENTE: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  PAGADO: { label: 'Pagado', color: 'bg-green-100 text-green-800' },
  ENVIADO: { label: 'Enviado', color: 'bg-blue-100 text-blue-800' },
  ENTREGADO: { label: 'Entregado', color: 'bg-emerald-100 text-emerald-800' },
  CANCELADO: { label: 'Cancelado', color: 'bg-red-100 text-red-800' },
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const config = statusConfig[status] || { label: status, color: 'bg-gray-100 text-gray-800' };
  return (
    <span className={clsx('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.color)}>
      {config.label}
    </span>
  );
}
