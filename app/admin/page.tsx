import { getOrders, getProducts, getUsers, getNotifications } from '@/lib/actions';
import { Package, Users, Tag, AlertCircle } from 'lucide-react';

export default async function AdminDashboard() {
  const orders = await getOrders();
  const products = await getProducts();
  const users = await getUsers();
  const notifications = await getNotifications('admin');

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">Store Overview</h1>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
           <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Total Revenue</div>
           <div className="text-4xl font-extrabold text-gray-900">₹{totalRevenue.toLocaleString('en-IN')}</div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
           <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Total Orders</div>
           <div className="text-4xl font-extrabold text-blue-600">{orders.length}</div>
        </div>
         <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
           <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Products</div>
           <div className="text-4xl font-extrabold text-gray-900">{products.length}</div>
        </div>
        <div className="p-6 bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
           <div className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-3">Registered Users</div>
           <div className="text-4xl font-extrabold text-gray-900">{users.length}</div>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2"><AlertCircle className="w-6 h-6 text-rose-500" /> Recent Alerts</h2>
      <div className="space-y-4">
         {notifications.length === 0 && <div className="text-gray-500 bg-white p-6 rounded-2xl border border-gray-100 text-center">No active alerts. Everything is running smoothly.</div>}
         {notifications.map(n => (
           <div key={n.id} className="flex gap-4 p-5 border border-rose-100 bg-rose-50 rounded-2xl items-center shadow-sm">
             <AlertCircle className="text-rose-600 w-6 h-6 shrink-0" />
             <div className="text-rose-900 font-medium">{n.message}</div>
           </div>
         ))}
      </div>
    </div>
  );
}
