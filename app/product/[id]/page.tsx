import { getProduct, getReviews } from '@/lib/actions';
import ReviewSection from '@/components/ReviewSection';
import AddToCartButton from '@/components/AddToCartButton';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Star, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await getProduct(id);
  
  if (!product) notFound();
  const reviews = await getReviews(id);

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.5';
    
  return (
    <div className="bg-white min-h-[70vh] flex-1">
      {/* Breadcrumb pseudo */}
      <div className="bg-gray-100 py-2 px-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto text-xs text-gray-600 font-medium opacity-80">
           Home &gt; {product.category} &gt; {product.name}
        </div>
      </div>
      
      <div className="max-w-[1500px] mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left: Image Gallery (simulated) */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="relative aspect-square bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center p-8 group">
               <Image src={product.imageUrl} alt={product.name} fill className="object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
            </div>
            <div className="flex gap-2 justify-center pb-4">
               {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-16 h-16 border rounded-lg bg-gray-50 flex items-center justify-center relative overflow-hidden cursor-pointer hover:border-blue-500 opacity-70 hover:opacity-100">
                    <Image src={product.imageUrl} alt={product.name} fill className="object-cover opacity-80" referrerPolicy="no-referrer" />
                  </div>
               ))}
            </div>
          </div>
          
          {/* Middle: Product Info */}
          <div className="lg:col-span-4 flex flex-col pt-2">
            <div className="text-sm text-blue-600 font-bold tracking-tight mb-2 hover:underline cursor-pointer">{product.category} NexusBrand</div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-[#202124] mb-2 leading-tight">{product.name}</h1>
            
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-200">
               <div className="flex items-center text-[#f0c14b]">
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current" />
                 <Star className="w-4 h-4 fill-current opacity-50" />
               </div>
               <span className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">{reviews.length} ratings</span>
               <span className="text-sm font-medium text-gray-500">| {averageRating} avg rating</span>
            </div>

            <div className="mb-6">
              <span className="text-red-600 font-medium text-xl mr-2">-15%</span> 
              <span className="text-3xl font-bold text-[#202124]">
                <span className="text-sm align-top font-medium mr-1">₹</span>
                {product.price.toLocaleString('en-IN')}
              </span>
              <p className="text-xs text-gray-500 mt-1">M.R.P.: <span className="line-through">₹{(product.price * 1.15).toLocaleString('en-IN')}</span></p>
            </div>

            <div className="mb-8">
               <h3 className="font-bold text-[#202124] mb-2 text-sm">About this item</h3>
               <ul className="list-disc pl-5 text-sm text-gray-800 space-y-2 leading-relaxed font-medium">
                  <li>{product.description}</li>
                  <li>Engineered for daily use with premium quality materials.</li>
                  <li>1 Year Nexus Warranty included locally.</li>
                  <li>Eco-friendly packaging and carbon-neutral delivery process.</li>
               </ul>
            </div>
          </div>

          {/* Right: Checkout / Add to Cart Card */}
          <div className="lg:col-span-3">
             <div className="border border-gray-300 rounded-xl p-6 bg-white shadow-sm flex flex-col sticky top-24">
                <div className="text-2xl font-bold text-[#202124] mb-2">₹{product.price.toLocaleString('en-IN')}</div>
                <div className="text-sm text-blue-600 font-bold mb-4">FREE delivery <span className="text-[#202124] font-medium font-sans">Thursday, Oct 25</span> on first order.</div>
                
                <h3 className="text-green-700 font-semibold mb-4 text-sm flex gap-1 items-center">
                  {product.stock > 0 ? (
                    `In Stock (${product.stock})`
                  ) : (
                    <span className="text-red-600">Currently unavailable.</span>
                  )}
                </h3>

                <div className="w-full mb-3">
                  <AddToCartButton product={product} />
                </div>
                
                <button disabled={product.stock === 0} className="w-full bg-[#f0c14b] border border-[#a88734] shadow-sm text-gray-900 font-bold py-2.5 px-4 rounded-full hover:bg-[#ddb347] transition disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                  Buy Now
                </button>
                
                <div className="mt-4 flex flex-col gap-3 text-xs text-gray-500 pt-4 border-t border-gray-200">
                  <div className="flex justify-between"><span>Ships from</span> <span className="font-semibold text-gray-700">Nexus Fulfillment</span></div>
                  <div className="flex justify-between"><span>Sold by</span> <span className="font-semibold text-gray-700 text-blue-600">Nexus Retail India</span></div>
                  <div className="flex justify-between"><span>Returns</span> <span className="font-semibold text-gray-700 text-blue-600">10 days Replacement</span></div>
                </div>

                <div className="mt-6 flex flex-col gap-2">
                   <div className="flex gap-2 items-center text-xs font-semibold text-blue-600"><ShieldCheck className="w-4 h-4 text-gray-400" /> Secure transaction</div>
                   <div className="flex gap-2 items-center text-xs font-semibold text-blue-600"><Truck className="w-4 h-4 text-gray-400" /> Nexus Delivered</div>
                   <div className="flex gap-2 items-center text-xs font-semibold text-blue-600"><RotateCcw className="w-4 h-4 text-gray-400" /> Free Returns</div>
                </div>
             </div>
          </div>

        </div>
        
        <div className="mt-16 pt-12 border-t border-gray-300">
           <ReviewSection productId={product.id} initialReviews={reviews} />
        </div>
      </div>
    </div>
  );
}
