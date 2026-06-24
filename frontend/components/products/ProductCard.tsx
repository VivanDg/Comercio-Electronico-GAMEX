import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/catalogo/${product.id}`} className="group">
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="aspect-square relative bg-gray-100">
          {product.imagen ? (
            <Image
              src={product.imagen}
              alt={product.nombre}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, 25vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Sin imagen
            </div>
          )}
          {!product.disponible && (
            <span className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
              Agotado
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <span className="text-xs text-primary-600 font-medium">{product.category.nombre}</span>
          )}
          <h3 className="font-semibold text-gray-900 mt-1 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {product.nombre}
          </h3>
          <p className="text-lg font-bold text-primary-600 mt-2">
            S/ {product.precio.toFixed(2)}
          </p>
          {product.stock > 0 && product.stock <= 5 && (
            <p className="text-xs text-orange-600 mt-1">¡Solo {product.stock} disponibles!</p>
          )}
        </div>
      </div>
    </Link>
  );
}
