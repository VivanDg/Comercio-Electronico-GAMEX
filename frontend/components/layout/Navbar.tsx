import Link from 'next/link';
import { ShoppingCart, User, Menu, X, Package } from 'lucide-react';
import { useState } from 'react';
import { useAuth, useCart } from '@/hooks/useAuth';

export function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Package className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">
                Gamex <span className="text-primary-600">Import</span>
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link href="/catalogo" className="text-gray-600 hover:text-primary-600 transition-colors">
                Catálogo
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-gray-600 hover:text-primary-600 transition-colors">
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link href="/carrito" className="relative p-2 text-gray-600 hover:text-primary-600">
                  <ShoppingCart className="h-6 w-6" />
                  {cart && cart.itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-primary-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cart.itemCount}
                    </span>
                  )}
                </Link>
                <Link href="/pedidos" className="text-gray-600 hover:text-primary-600 text-sm">
                  Mis Pedidos
                </Link>
                <Link href="/perfil" className="flex items-center gap-1 text-gray-600 hover:text-primary-600 text-sm">
                  <User className="h-4 w-4" />
                  {user.nombre}
                </Link>
                <button onClick={() => logout()} className="text-sm text-gray-500 hover:text-red-600">
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-600 hover:text-primary-600 text-sm">
                  Iniciar Sesión
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-700 transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t bg-white px-4 py-4 space-y-3">
          <Link href="/catalogo" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
            Catálogo
          </Link>
          {user ? (
            <>
              <Link href="/carrito" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
                Carrito ({cart?.itemCount || 0})
              </Link>
              <Link href="/pedidos" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
                Mis Pedidos
              </Link>
              <Link href="/perfil" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
                Perfil
              </Link>
              {isAdmin && (
                <Link href="/admin" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
                  Admin
                </Link>
              )}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-red-600">
                Salir
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="block text-gray-600" onClick={() => setMobileOpen(false)}>
                Iniciar Sesión
              </Link>
              <Link href="/register" className="block text-primary-600" onClick={() => setMobileOpen(false)}>
                Registrarse
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
