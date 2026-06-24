import Link from 'next/link';
import { Package } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-6 w-6 text-primary-400" />
              <span className="text-lg font-bold text-white">Gamex Import</span>
            </div>
            <p className="text-sm">
              Empresa dedicada a la venta de productos tecnológicos de calidad.
              E.I.R.L. - Perú
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/catalogo" className="hover:text-white transition-colors">Catálogo</Link></li>
              <li><Link href="/login" className="hover:text-white transition-colors">Mi Cuenta</Link></li>
              <li><Link href="/pedidos" className="hover:text-white transition-colors">Mis Pedidos</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>Email: ventas@gameximport.com</li>
              <li>Tel: +51 999 888 777</li>
              <li>Lima, Perú</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Gamex Import E.I.R.L. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
