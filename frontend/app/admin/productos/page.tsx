'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/services/api';
import { Product, Category } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input, Select } from '@/components/ui/Input';

export default function AdminProductsPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nombre: '', descripcion: '', precio: '', imagen: '', categoryId: '', stock: '0' });

  useEffect(() => {
    if (!authLoading && !isAdmin) router.push('/');
  }, [isAdmin, authLoading, router]);

  const loadData = async () => {
    const [prodRes, cats] = await Promise.all([
      api.getProducts({ limit: 100 }),
      api.getCategories(),
    ]);
    setProducts(prodRes.products);
    setCategories(cats);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadData();
  }, [isAdmin]);

  const resetForm = () => {
    setForm({ nombre: '', descripcion: '', precio: '', imagen: '', categoryId: '', stock: '0' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      nombre: form.nombre,
      descripcion: form.descripcion || undefined,
      precio: parseFloat(form.precio),
      imagen: form.imagen || undefined,
      categoryId: parseInt(form.categoryId),
      stock: parseInt(form.stock),
    };

    try {
      if (editingId) {
        await api.updateProduct(editingId, data);
      } else {
        await api.createProduct(data);
      }
      resetForm();
      loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Error');
    }
  };

  const handleEdit = (product: Product) => {
    setForm({
      nombre: product.nombre,
      descripcion: product.descripcion || '',
      precio: String(product.precio),
      imagen: product.imagen || '',
      categoryId: String(product.categoryId),
      stock: String(product.stock),
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    await api.deleteProduct(id);
    loadData();
  };

  if (loading) return <div className="p-16 text-center text-gray-500">Cargando...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Link href="/admin" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-primary-600 mb-6">
        <ArrowLeft className="h-4 w-4" /> Dashboard
      </Link>

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestión de Productos</h1>
        <Button onClick={() => { resetForm(); setShowForm(true); }}>
          <Plus className="h-4 w-4 mr-1" /> Nuevo Producto
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border p-6 mb-6 grid md:grid-cols-2 gap-4">
          <Input label="Nombre" value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
          <Input label="Precio" type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
          <Input label="Descripción" value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} />
          <Input label="URL Imagen" value={form.imagen} onChange={(e) => setForm({ ...form, imagen: e.target.value })} />
          <Select
            label="Categoría"
            options={[{ value: '', label: 'Seleccionar...' }, ...categories.map((c) => ({ value: c.id, label: c.nombre }))]}
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
            required
          />
          <Input label="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <div className="md:col-span-2 flex gap-2">
            <Button type="submit">{editingId ? 'Actualizar' : 'Crear'}</Button>
            <Button type="button" variant="outline" onClick={resetForm}>Cancelar</Button>
          </div>
        </form>
      )}

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-3">Producto</th>
              <th className="text-left p-3">Precio</th>
              <th className="text-left p-3">Stock</th>
              <th className="text-left p-3">Categoría</th>
              <th className="text-right p-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-3 font-medium">{p.nombre}</td>
                <td className="p-3">S/ {p.precio.toFixed(2)}</td>
                <td className="p-3">{p.stock}</td>
                <td className="p-3">{p.category?.nombre}</td>
                <td className="p-3 text-right">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 mr-2">
                    <Pencil className="h-4 w-4 inline" />
                  </button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-4 w-4 inline" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
