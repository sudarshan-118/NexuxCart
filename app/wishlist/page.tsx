'use client';
import { useStore } from '@/lib/state';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/actions'; 

export default function WishlistPage() {
  const { wishlist } = useStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts().then(allProducts => {
      setProducts(allProducts.filter(p => wishlist.includes(p.id)));
      setLoading(false);
    });
  }, [wishlist]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-[70vh]">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-gray-900">Your Wishlist</h1>
      
      {loading ? (
         <div className="animate-pulse flex gap-6">
            <div className="h-80 bg-gray-100 rounded-3xl w-full max-w-[280px]"></div>
            <div className="h-80 bg-gray-100 rounded-3xl w-full max-w-[280px]"></div>
         </div>
      ) : products.length === 0 ? (
         <div className="text-gray-500 text-lg bg-gray-50 p-12 rounded-3xl text-center border border-dashed border-gray-200">Your wishlist is empty. Discover items you love and save them here!</div>
      ) : (
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
         </div>
      )}
    </div>
  );
}
