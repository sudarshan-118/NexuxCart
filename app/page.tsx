import { getProducts } from '@/lib/actions';
import { getRecommendations } from '@/lib/ai';
import ProductCard from '@/components/ProductCard';
import Link from 'next/link';

// Component for horizontal scrolling shelves
function ProductShelf({ title, products, link }: { title: string, products: any[], link: string }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="mb-6 relative shadow-sm border border-gray-200 bg-white p-6 pb-2 rounded-xl">
      <div className="flex justify-between items-end mb-4">
         <h2 className="text-xl font-bold tracking-tight text-[#202124]">{title}</h2>
         <Link href={link} className="text-blue-600 font-semibold text-sm hover:text-orange-500 transition-colors">See more</Link>
      </div>
      {/* Hide scrollbar using arbitrary styles but keep scroll functionality */}
      <div className="flex overflow-x-auto gap-4 pb-6 snap-x [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {products.map(p => (
          <div key={p.id} className="min-w-[250px] max-w-[250px] w-[250px] snap-start flex">
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default async function Home() {
  const products = await getProducts();
  const recommended = await getRecommendations('u2');

  const electronics = products.filter(p => p.category === 'Electronics');
  const clothing = products.filter(p => p.category === 'Clothing');
  const homeGarden = products.filter(p => p.category === 'Home & Garden');
  const sports = products.filter(p => p.category === 'Sports');
  const books = products.filter(p => p.category === 'Books');

  return (
    <div className="flex flex-col flex-1 bg-gray-100 pb-16">
      {/* Hero Banner Area */}
      <div className="w-full bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-8 md:p-12 pb-32 text-center relative shadow-inner overflow-hidden">
        <div className="absolute inset-0 bg-blue-900 mix-blend-overlay opacity-20"></div>
        <div className="relative z-10 text-left md:text-center max-w-4xl mx-auto">
           <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
             Everything you need, delivered straight.
           </h1>
           <p className="text-gray-300 md:text-lg mb-8 max-w-2xl mx-auto">Shop millions of curated items with fast, free delivery on eligible items. Browse our expanded categories below.</p>
        </div>
      </div>

      <div className="max-w-[1500px] w-full px-4 md:px-8 -mt-20 relative z-20 space-y-6 mx-auto">
        
        {/* Amazon-style top category blocks */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
           <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-b-blue-600 flex flex-col h-full transform transition-transform hover:-translate-y-1">
             <h2 className="text-lg font-bold mb-4 text-[#202124]">Upgrade your Tech</h2>
             <Link href="/products?category=Electronics" className="flex-1 aspect-square bg-gray-50 flex items-center justify-center p-4 rounded-lg overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80" alt="Tech" className="w-full h-full object-cover mix-blend-multiply rounded-md group-hover:scale-105 transition-transform duration-500" />
             </Link>
             <Link href="/products?category=Electronics" className="text-blue-600 font-bold text-sm mt-4 inline-block hover:underline">Shop Electronics</Link>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-b-emerald-600 flex flex-col h-full transform transition-transform hover:-translate-y-1">
             <h2 className="text-lg font-bold mb-4 text-[#202124]">Fresh Styles for You</h2>
             <Link href="/products?category=Clothing" className="flex-1 aspect-square bg-gray-50 flex items-center justify-center p-4 rounded-lg overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&q=80" alt="Clothing" className="w-full h-full object-cover mix-blend-multiply rounded-md group-hover:scale-105 transition-transform duration-500" />
             </Link>
             <Link href="/products?category=Clothing" className="text-emerald-600 font-bold text-sm mt-4 inline-block hover:underline">Shop Clothing</Link>
           </div>
           
           <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-b-orange-500 flex flex-col h-full transform transition-transform hover:-translate-y-1">
             <h2 className="text-lg font-bold mb-4 text-[#202124]">Refresh your Space</h2>
             <Link href="/products?category=Home%20%26%20Garden" className="flex-1 aspect-square bg-gray-50 flex items-center justify-center p-4 rounded-lg overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&q=80" alt="Home" className="w-full h-full object-cover mix-blend-multiply rounded-md group-hover:scale-105 transition-transform duration-500" />
             </Link>
             <Link href="/products?category=Home%20%26%20Garden" className="text-orange-600 font-bold text-sm mt-4 inline-block hover:underline">Shop Home & Garden</Link>
           </div>

           <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col items-center justify-center text-center">
             <h2 className="text-xl font-bold mb-2 text-[#202124]">Sign in for the best experience</h2>
             <p className="text-xs text-gray-500 mb-6 font-medium">Access your orders, compare items, and view AI recommendations instantly.</p>
             <Link href="/profile" className="w-full bg-[#f0c14b] border border-[#a88734] shadow-sm text-gray-900 font-bold py-2.5 rounded-lg hover:bg-[#ddb347] transition">Sign In Securely</Link>
             <div className="text-xs mt-4 pt-4 border-t w-full">
                <span className="text-gray-500">New to NexusCart? </span><Link href="/profile" className="text-blue-600 cursor-pointer hover:font-semibold">Start here.</Link>
             </div>
           </div>
        </div>

        {/* Dynamic Horizontal Catalogs */}
        <ProductShelf title="Recommended For You (AI-Curated)" products={recommended} link="/products" />
        <ProductShelf title="Electronics & Gadgets" products={electronics} link="/products?category=Electronics" />
        <ProductShelf title="Clothing & Apparel" products={clothing} link="/products?category=Clothing" />
        <ProductShelf title="Home & Garden Essentials" products={homeGarden} link="/products?category=Home%20%26%20Garden" />
        <ProductShelf title="Sports & Outdoors" products={sports} link="/products?category=Sports" />
        <ProductShelf title="Best Sellers in Books" products={books} link="/products?category=Books" />
      </div>

    </div>
  );
}
