'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';

export default function PerfilPage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  if (loading || !user) {
    return <div className="max-w-md mx-auto px-4 py-16 text-center text-gray-500">Cargando...</div>;
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-xl border p-8">
        <h1 className="text-2xl font-bold text-gray-900">Mi Perfil</h1>

        <div className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-gray-500">Nombre</label>
            <p className="font-medium text-gray-900">{user.nombre}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Email</label>
            <p className="font-medium text-gray-900">{user.email}</p>
          </div>
          <div>
            <label className="text-sm text-gray-500">Rol</label>
            <p className="font-medium text-gray-900">{user.rol === 'ADMIN' ? 'Administrador' : 'Cliente'}</p>
          </div>
        </div>

        <Button variant="danger" className="w-full mt-8" onClick={() => { logout(); router.push('/'); }}>
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
