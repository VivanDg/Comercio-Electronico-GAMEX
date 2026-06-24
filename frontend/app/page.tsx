import Link from 'next/link';
import { ArrowRight, Shield, Truck, HeadphonesIcon } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      <section className="relative bg-gradient-to-br from-primary-900 via-primary-800 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Tecnología de calidad para tu día a día
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100">
              Gamex Import te ofrece los mejores productos tecnológicos con envío a todo el Perú.
              Laptops, smartphones, componentes y más.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 bg-white text-primary-700 px-6 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                Ver Catálogo
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 border-2 border-white/30 px-6 py-3 rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Crear Cuenta
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Compra Segura</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Pagos protegidos con Mercado Pago. Tus datos siempre seguros.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <Truck className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Envío Nacional</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Entregamos a todo el Perú. Seguimiento de pedidos en tiempo real.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 text-primary-600 rounded-lg mb-4">
                <HeadphonesIcon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg">Soporte Técnico</h3>
              <p className="text-gray-600 mt-2 text-sm">
                Asesoría especializada en productos tecnológicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">¿Listo para comprar?</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Explora nuestro catálogo de productos tecnológicos y encuentra lo que necesitas.
          </p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 mt-8 bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Explorar Productos
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>
    </>
  );
}
