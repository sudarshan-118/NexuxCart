import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col md:flex-row gap-12">
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h2 className="text-xs font-extrabold text-blue-600 uppercase tracking-widest mb-6 px-4">Admin Dashboard</h2>
        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 font-medium text-gray-700 transition-colors"><LayoutDashboard className="w-5 h-5"/> Overview</Link>
        <Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 font-medium text-gray-700 transition-colors"><Package className="w-5 h-5"/> Products</Link>
        <Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-blue-50 font-medium text-gray-700 transition-colors"><ShoppingCart className="w-5 h-5"/> Orders</Link>
      </div>
      <div className="flex-1 bg-gray-50/50 rounded-3xl md:p-8">
        {children}
      </div>
    </div>
  );
}
