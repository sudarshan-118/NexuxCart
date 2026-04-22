'use client';
import { useStore } from '@/lib/state';
import { checkout } from '@/lib/actions';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, ShoppingBag, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart, currentUser } = useStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleCheckout = async () => {
    if (!currentUser) return alert("Please login");
    if (cart.length === 0) return;
    setLoading(true);
    await checkout(currentUser.id, cart);
    clearCart();
    setLoading(false);
    alert("Checkout successful!");
    router.push('/profile');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-32 text-center bg-white min-h-[70vh] flex flex-col justify-center items-center">
        <div className="inline-flex w-24 h-24 bg-gray-50 rounded-full items-center justify-center mb-6 text-gray-400 border border-gray-100">
           <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold mb-4 tracking-tight">Your cart is empty</h2>
        <p className="text-gray-500 mb-10 text-lg font-light">Looks like you haven&apos;t added anything to your cart yet.</p>
        <Link href="/products" className="bg-black text-white px-10 py-4 rounded-full font-bold hover:bg-gray-800 transition tracking-wide shadow-lg">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-white">
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight text-gray-900">Shopping Cart</h1>
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-6">
          {cart.map((item) => (
            <div key={item.product.id} className="flex gap-6 border border-gray-100 rounded-3xl p-4 bg-white shadow-sm items-center hover:border-gray-200 transition-colors">
              <div className="w-28 h-28 bg-gray-50 rounded-2xl relative overflow-hidden shrink-0">
                 <Image src={item.product.imageUrl} alt={item.product.name} fill className="object-cover" referrerPolicy="no-referrer"/>
              </div>
              <div className="flex-1">
                <Link href={`/product/${item.product.id}`} className="font-bold text-xl hover:text-blue-600 block mb-1 text-gray-900">{item.product.name}</Link>
                <div className="text-gray-500 text-sm mb-4">{item.product.category}</div>
                <div className="flex justify-between items-end">
                   <div className="font-extrabold text-xl">₹{(item.product.price).toLocaleString('en-IN')} <span className="text-sm text-gray-400 font-medium">ea</span></div>
                </div>
              </div>
              <div className="flex flex-col items-end justify-between h-full py-2 pr-2 gap-6">
                 <button onClick={() => removeFromCart(item.product.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Remove">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
                    <button onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))} className="w-10 h-10 hover:bg-gray-50 font-bold text-lg">-</button>
                    <span className="w-10 h-10 flex items-center justify-center font-bold text-gray-900">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, Math.min(item.product.stock, item.quantity + 1))} className="w-10 h-10 hover:bg-gray-50 font-bold text-lg">+</button>
                  </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-50 p-8 rounded-3xl h-fit border border-gray-100 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-100 rounded-bl-full opacity-20" />
          <h3 className="text-2xl font-bold mb-8 tracking-tight text-gray-900 relative z-10">Order Summary</h3>
          <div className="space-y-5 text-gray-600 mb-8 border-b border-gray-200 pb-8 relative z-10">
             <div className="flex justify-between"><span>Subtotal ({cart.length} items)</span> <span className="font-semibold text-gray-900">₹{total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
             <div className="flex justify-between"><span>Shipping</span> <span className="font-semibold text-green-600">Free Check</span></div>
             <div className="flex justify-between"><span>Tax (18%)</span> <span className="font-semibold text-gray-900">₹{(total * 0.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span></div>
          </div>
          <div className="flex justify-between font-extrabold text-3xl mb-10 relative z-10 text-gray-900">
            <span>Total</span>
            <span>₹{(total * 1.18).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
          </div>
          <button 
             onClick={handleCheckout} 
             disabled={loading}
             className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-colors shadow-lg disabled:opacity-50 flex justify-center items-center gap-3 text-lg relative z-10"
          >
            {loading ? 'Processing...' : <><ShieldCheck className="w-5 h-5" /> Secure Checkout</>}
          </button>
          
           <div className="mt-8 text-center text-xs text-gray-500 font-medium relative z-10 flex items-center justify-center gap-2">
             <ShieldCheck className="w-4 h-4" /> 256-bit encrypted secure connection
           </div>
        </div>
      </div>
    </div>
  );
}
