'use client';
import { useState } from 'react';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/state';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Heart, RefreshCw, Eye, X } from 'lucide-react';
import { clsx } from 'clsx';
import { AnimatePresence, motion } from 'motion/react';

export default function ProductCard({ product }: { product: Product }) {
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const { addToCart, toggleWishlist, wishlist, toggleCompare, compareList } = useStore();
  const isWishlisted = wishlist.includes(product.id);
  const isCompared = compareList.find(p => p.id === product.id);

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow relative group flex flex-col w-full h-full">
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-6 left-6 bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded font-bold z-10 pointer-events-none">Low Stock</span>
        )}
        {product.stock === 0 && (
           <span className="absolute top-6 left-6 bg-gray-100 text-gray-600 text-[10px] px-2 py-0.5 rounded font-bold z-10 pointer-events-none">Out of Stock</span>
        )}
        <div className="absolute top-6 right-6 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity z-20">
          <button 
            suppressHydrationWarning
            onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(true); }}
            className="p-2 bg-white rounded-full shadow-md hover:text-emerald-500 transition-colors text-[#202124]"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button 
            suppressHydrationWarning
            onClick={(e) => { e.preventDefault(); toggleCompare(product); }}
            className={clsx("p-2 bg-white rounded-full shadow-md hover:text-blue-600 transition-colors", isCompared ? "text-blue-600" : "text-[#202124]")}
            title="Compare"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button 
            suppressHydrationWarning
            onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
            className={clsx("p-2 bg-white rounded-full shadow-md hover:text-red-500 transition-colors", isWishlisted ? "text-red-500" : "text-[#202124]")}
            title="Wishlist"
          >
            <Heart className={clsx("w-4 h-4", isWishlisted && "fill-current")} />
          </button>
        </div>

        <Link href={`/product/${product.id}`} className="block relative w-full h-40 bg-gray-50 rounded-xl mb-4 flex items-center justify-center overflow-hidden">
          <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" referrerPolicy="no-referrer" />
        </Link>
        
        <div className="flex flex-col flex-1">
          <div className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{product.category}</div>
          <Link href={`/product/${product.id}`} className="font-semibold mb-1 text-[#202124] hover:text-blue-600 line-clamp-1">{product.name}</Link>
          <p className="text-lg font-bold mb-3">₹{product.price.toLocaleString('en-IN')}</p>
          
          <div className="mt-auto z-10 relative">
            <button 
              suppressHydrationWarning
              disabled={product.stock === 0}
              onClick={(e) => { e.preventDefault(); addToCart(product); }}
              className="w-full bg-blue-50 text-blue-600 font-bold text-xs px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" /> Add to Cart
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isQuickViewOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6" style={{ isolation: 'isolate' }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm cursor-pointer z-[-1]" 
              onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(false); }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative flex flex-col md:flex-row border border-gray-100" 
              onClick={e => e.stopPropagation()}
            >
               <button 
                 onClick={(e) => { e.preventDefault(); setIsQuickViewOpen(false); }} 
                 className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors z-20 text-gray-500 hover:text-gray-900"
                 title="Close"
               >
                 <X className="w-5 h-5" />
               </button>
               {/* Left side: Image */}
               <div className="w-full md:w-1/2 bg-gray-50 flex items-center justify-center min-h-[300px] md:min-h-[400px] relative p-8">
                 <Image src={product.imageUrl} alt={product.name} fill className="object-contain p-8 mix-blend-multiply" referrerPolicy="no-referrer" />
               </div>
               {/* Right side: Details */}
               <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-center bg-white">
                 <div className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                   <span>{product.category}</span>
                   {product.stock > 0 && product.stock <= 5 && <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-[10px]">Only {product.stock} left</span>}
                   {product.stock === 0 && <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-[10px]">Out of stock</span>}
                 </div>
                 <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">{product.name}</h2>
                 <p className="text-gray-500 mb-6 text-sm leading-relaxed">{product.description}</p>
                 <div className="text-4xl font-black text-gray-900 mb-8">₹{product.price.toLocaleString('en-IN')}</div>
                 
                 <div className="space-y-3 mt-auto">
                   <button 
                    disabled={product.stock === 0}
                    onClick={(e) => { e.preventDefault(); addToCart(product); setIsQuickViewOpen(false); }}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base shadow-sm hover:shadow"
                   >
                     <ShoppingCart className="w-5 h-5" /> Add to Cart
                   </button>
                   <Link 
                     href={`/product/${product.id}`} 
                     onClick={() => setIsQuickViewOpen(false)}
                     className="w-full bg-gray-50 text-gray-900 font-bold py-4 px-4 rounded-xl hover:bg-gray-100 active:scale-[0.98] transition-all flex items-center justify-center text-base inline-block text-center border border-gray-200"
                   >
                     View Full Details
                   </Link>
                 </div>
               </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
