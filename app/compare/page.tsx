'use client';
import { useStore } from '@/lib/state';
import Link from 'next/link';
import Image from 'next/image';
import { X, Check } from 'lucide-react';

export default function ComparePage() {
  const { compareList, toggleCompare, addToCart } = useStore();

  if (compareList.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center bg-white min-h-[70vh] flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Nothing to compare</h2>
        <p className="text-gray-500 mb-10 text-lg font-light">Add products to your comparison list from the product cards.</p>
        <Link href="/products" className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition tracking-wide shadow-lg">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white min-h-[70vh]">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-gray-900">Compare Products</h1>
      
      <div className="overflow-x-auto pb-8">
        <table className="w-full min-w-[800px] border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 w-1/4 text-left font-medium text-gray-400 uppercase tracking-widest text-xs">Product Info</th>
              {compareList.map(p => (
                <th key={p.id} className="p-6 border-b border-gray-200 w-1/4 text-center relative bg-gray-50/50 rounded-t-3xl">
                  <button onClick={() => toggleCompare(p)} className="absolute top-4 right-4 text-gray-300 hover:text-red-500 p-1 bg-white rounded-full shadow-sm">
                    <X className="w-5 h-5"/>
                  </button>
                  <div className="relative w-32 h-32 mx-auto bg-white rounded-2xl mb-4 border border-gray-100 shadow-sm overflow-hidden">
                     <Image src={p.imageUrl} alt={p.name} fill className="object-cover" referrerPolicy="no-referrer"/>
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900 leading-tight">{p.name}</h3>
                  <div className="text-2xl font-extrabold text-blue-600 mb-6">₹{p.price.toLocaleString('en-IN')}</div>
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-black transition-colors"
                  >
                    Add to Cart
                  </button>
                </th>
              ))}
              {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                 <th key={i} className="p-4 border-b border-gray-200 w-1/4 bg-gray-50/30 rounded-t-3xl border-dashed border-x border-t mx-2"></th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-6 border-b border-gray-100 text-gray-500 font-medium">Category</td>
              {compareList.map(p => <td key={p.id} className="p-6 border-b border-gray-100 border-x border-x-gray-50 text-center font-medium text-gray-900">{p.category}</td>)}
            </tr>
            <tr>
              <td className="p-6 border-b border-gray-100 text-gray-500 font-medium">Availability</td>
              {compareList.map(p => (
                <td key={p.id} className="p-6 border-b border-gray-100 border-x border-x-gray-50 text-center">
                  {p.stock > 0 ? <span className="text-green-600 flex items-center justify-center gap-1 font-medium"><Check className="w-4 h-4"/> In Stock</span> : <span className="text-red-500 font-medium">Out of Stock</span>}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-6 border-b border-gray-100 text-gray-500 font-medium rounded-bl-3xl">Description</td>
              {compareList.map(p => <td key={p.id} className="p-6 border-b border-gray-100 border-x border-x-gray-50 text-center text-gray-600 text-sm leading-relaxed">{p.description}</td>)}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
