import { getProducts } from '@/lib/actions';
import ProductCard from '@/components/ProductCard';
import { Category } from '@/lib/types';
import Link from 'next/link';

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string, q?: string, min?: string, max?: string }>
}) {
  const sp = await searchParams;
  let products = await getProducts();
  
  if (sp.category) {
    products = products.filter(p => p.category === sp.category);
  }
  if (sp.q) {
    products = products.filter(p => p.name.toLowerCase().includes(sp.q!.toLowerCase()));
  }
  if (sp.min) {
    products = products.filter(p => p.price >= Number(sp.min));
  }
  if (sp.max) {
    products = products.filter(p => p.price <= Number(sp.max));
  }

  return (
    <div className="flex flex-col md:flex-row flex-1">
      {/* Sidebar Filters */}
      <aside className="w-full md:w-60 bg-white border-r border-gray-200 p-6 flex flex-col space-y-8 shrink-0">
        <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Categories</h3>
          <ul className="space-y-3 text-sm font-medium">
             <li><Link href="/products" className={!sp.category ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>All Products</Link></li>
             <li><Link href="/products?category=Electronics" className={sp.category=== 'Electronics' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>Electronics</Link></li>
             <li><Link href="/products?category=Clothing" className={sp.category=== 'Clothing' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>Clothing</Link></li>
             <li><Link href="/products?category=Books" className={sp.category=== 'Books' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>Books</Link></li>
             <li><Link href="/products?category=Sports" className={sp.category=== 'Sports' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>Sports</Link></li>
             <li><Link href="/products?category=Home & Garden" className={sp.category=== 'Home & Garden' ? "text-blue-600" : "text-gray-600 hover:text-blue-600"}>Home & Garden</Link></li>
          </ul>
        </section>
        
         <section>
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Price Range</h3>
          <div className="flex gap-2 items-center">
            <form action="/products" className="flex items-center gap-2">
              <input type="hidden" name="category" value={sp.category || ''} />
              <input type="hidden" name="q" value={sp.q || ''} />
              <input name="min" type="number" placeholder="Min" defaultValue={sp.min} className="w-16 p-2 bg-gray-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <span className="text-gray-400">-</span>
              <input name="max" type="number" placeholder="Max" defaultValue={sp.max} className="w-16 p-2 bg-gray-100 border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500" />
              <button type="submit" className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 text-sm font-bold">Go</button>
            </form>
          </div>
        </section>
      </aside>

      <main className="flex-1 p-6">
        {sp.q && <h1 className="text-2xl font-bold mb-6">Search results for &quot;{sp.q}&quot; <span className="text-gray-400 font-normal ml-1">({products.length})</span></h1>}
        {!sp.q && sp.category && <h1 className="text-2xl font-bold mb-6">{sp.category} <span className="text-gray-400 font-normal ml-1">({products.length})</span></h1>}
        
        {products.length === 0 ? (
          <div className="text-center py-32 bg-white rounded-2xl border border-gray-100 shadow-sm">
             <div className="text-gray-400 text-lg">No products found matching your criteria.</div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </main>
    </div>
  );
}
