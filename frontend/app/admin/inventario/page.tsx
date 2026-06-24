'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface InventoryItem {
  id: number;
  stock: number;
  product: { id: number; nombre: string; precio: number };
}

export default function AdminInventoryPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingStock, setEditingStock] = useState<Record<number, string>>({});

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/');
  }, [isAdmin, authLoading, router]);

  const loadInventory = () => {
    api.getInventory(1)
      .then(({ items }) => setItems(items))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (isAdmin) loadInventory();
  }, [isAdmin]);

  const handleUpdateStock = async (productId: number) => {
    const stock = parseInt(editingStock[productId]);
    if (isNaN(stock) || stock < 0) return;
    try {
      await api.updateStock(productId, stock);
      loadInventory();
      setEditingStock((prev) => {
        const next = { ...prev };
        delete next[productId];
        return next;
      });
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  if (loading) return <div className="p-16 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <h1 className="text-2xl font-bold mb-6">Gestión de Inventario</h1>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Stock Actual</th>
              <th className="text-left p-3">Nuevo Stock</th>
              <th className="text-right p-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-3 font-medium">{item.product.nombre}</td>
                <td className="p-3">S/ {item.product.precio.toFixed(2)}</td>
                <td className="p-3">
                  <span className={item.stock <= 5 ? 'text-red-600 font-medium' : ''}>
                    {item.stock}
                  </span>
                </td>
                <td className="p-3">
                  <Input
                    type="number"
                    min={0}
                    value={editingStock[item.product.id] ?? ''}
                    onChange={(e) => setEditingStock({ ...editingStock, [item.product.id]: e.target.value })}
                    className="w-24"
                  />
                </td>
                <td className="p-3 text-right">
                  <Button size="sm" onClick={() => handleUpdateStock(item.product.id)}>
                    Actualizar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
