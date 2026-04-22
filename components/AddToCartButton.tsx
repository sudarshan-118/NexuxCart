'use client';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/state';

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useStore();
  
  return (
    <button 
      suppressHydrationWarning
      disabled={product.stock === 0}
      onClick={() => addToCart(product)}
      className="w-full bg-[#ffd814] border border-[#fcd200] shadow-sm text-gray-900 font-bold py-2.5 px-4 rounded-full hover:bg-[#f7ca00] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm"
    >
      Add to Cart
    </button>
  );
}
