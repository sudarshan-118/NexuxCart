'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/state';
import { ShoppingCart, Heart, User, Search, Settings, X, Loader2 } from 'lucide-react';
import { getProducts } from '@/lib/actions';
import { Product } from '@/lib/types';
import Fuse from 'fuse.js';

export default function Navbar() {
  const { cart, wishlist, currentUser } = useStore();
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const router = useRouter();
  
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [results, setResults] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const searchRef = useRef<HTMLDivElement>(null);

  // Load products for fuzzy search
  useEffect(() => {
    let active = true;
    async function fetchProducts() {
      try {
        const data = await getProducts();
        if (active) setProducts(data);
      } catch (err) {
        console.error("Failed to load products for search", err);
      }
    }
    fetchProducts();
    return () => { active = false; };
  }, []);

  // Perform fuzzy search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    const fuse = new Fuse(products, {
      keys: ['name', 'category', 'description'],
      threshold: 0.4, // lower threshold means stricter match
      distance: 100,
    });
    
    const searchResults = fuse.search(query).slice(0, 5).map(result => result.item);
    setResults(searchResults);
    setIsLoading(false);
  }, [query, products]);

  // Click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setIsFocused(false);
      router.push(`/products?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="flex items-center space-x-8">
        <Link href="/" className="text-2xl font-semibold text-blue-600 tracking-tight">Nexus<span className="text-gray-500">Cart</span></Link>
        <div className="hidden md:block relative w-96" ref={searchRef}>
          <form onSubmit={handleSearchSubmit} className="w-full">
            <input 
              suppressHydrationWarning 
              name="q" 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setIsFocused(true)}
              placeholder="Search for products, brands and more" 
              className="w-full py-2 pl-10 pr-10 bg-gray-100 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent rounded-full text-sm outline-none transition-all" 
              autoComplete="off"
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            {query && (
              <button 
                type="button" 
                onClick={() => setQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Autocomplete Dropdown */}
          {isFocused && query.trim() !== '' && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 shadow-xl rounded-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-1">
              {isLoading ? (
                 <div className="p-4 flex items-center justify-center text-blue-600">
                   <Loader2 className="w-5 h-5 animate-spin" />
                 </div>
              ) : results.length > 0 ? (
                <div>
                  <h3 className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider bg-gray-50 border-b border-gray-50">Suggestions</h3>
                  <ul className="py-1 max-h-80 overflow-y-auto">
                    {results.map((product) => (
                      <li key={product.id}>
                        <Link 
                          href={`/product/${product.id}`}
                          onClick={() => {
                            setIsFocused(false);
                            setQuery('');
                          }}
                          className="flex items-center px-4 py-3 hover:bg-gray-50 transition-colors gap-3 group"
                        >
                          <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={product.imageUrl} alt={product.name} fill className="object-cover group-hover:scale-105 transition-transform mix-blend-multiply" referrerPolicy="no-referrer" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">{product.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{product.category}</p>
                          </div>
                          <div className="text-sm font-bold text-gray-900 flex-shrink-0">
                            ₹{product.price.toLocaleString('en-IN')}
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="p-2 border-t border-gray-100">
                    <button 
                      onClick={handleSearchSubmit}
                      className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-blue-600 text-sm font-semibold rounded-xl transition-colors"
                    >
                      See all results for "{query}"
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-6 text-center text-gray-500">
                  <span className="block text-sm mb-1 text-gray-400">No matches found for</span>
                  <span className="font-semibold text-gray-700">"{query}"</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <nav className="flex items-center space-x-6">
        <Link href="/wishlist" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <Heart className="w-5 h-5 text-[#202124]" />
          {wishlist.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white flex justify-center items-center text-[0px]">{wishlist.length}</span>}
        </Link>
        
        <Link href="/cart" className="relative p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ShoppingCart className="w-5 h-5 text-[#202124]" />
          {cartCount > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white flex justify-center items-center text-[0px]">{cartCount}</span>}
        </Link>

        {currentUser?.role === 'admin' && (
          <Link href="/admin" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Settings className="w-5 h-5 text-[#202124]" />
          </Link>
        )}

        <div className="flex items-center space-x-2 pl-4 border-l border-gray-200">
          <Link href="/profile" className="flex items-center space-x-2 w-full hover:opacity-80">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs uppercase">
              {currentUser?.name?.slice(0,2) || 'US'}
            </div>
            <span className="text-sm font-medium hidden md:block">{currentUser?.name || 'Guest'}</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
