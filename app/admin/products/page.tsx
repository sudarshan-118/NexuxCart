import { getProducts } from '@/lib/actions';
import Image from 'next/image';

export default async function AdminProducts() {
  const products = await getProducts();
  
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold tracking-tight">Manage Products</h1>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition shadow-sm">Add Product</button>
      </div>

      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
         <table className="w-full text-left">
           <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
             <tr>
               <th className="p-6">Product</th>
               <th className="p-6">Price</th>
               <th className="p-6">Stock</th>
               <th className="p-6">Category</th>
             </tr>
           </thead>
           <tbody>
             {products.map(p => (
               <tr key={p.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="p-6 flex items-center gap-4">
                     <div className="w-12 h-12 relative bg-white rounded-lg overflow-hidden border border-gray-100 shadow-sm shrink-0">
                       <Image src={p.imageUrl} alt={p.name} fill className="object-cover" referrerPolicy="no-referrer" />
                     </div>
                     <span className="font-bold text-gray-900">{p.name}</span>
                  </td>
                  <td className="p-6 font-extrabold text-gray-900">₹{p.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td className="p-6">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-yellow-50 text-yellow-700' : 'bg-red-50 text-red-700'}`}>
                        {p.stock} in stock
                     </span>
                  </td>
                  <td className="p-6 text-gray-500 font-medium">{p.category}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
