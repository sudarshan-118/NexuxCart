import { getOrders, getNotifications } from '@/lib/actions';
import { Package, Bell, User, Clock } from 'lucide-react';
import Link from 'next/link';

export default async function ProfilePage() {
  const userId = 'u2'; // Mock logged-in user
  
  const orders = await getOrders(userId);
  const notifications = await getNotifications(userId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-4xl font-extrabold mb-12 tracking-tight">Your Account</h1>
      
      <div className="grid lg:grid-cols-4 gap-12">
        <div className="space-y-4">
           <div className="bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8 text-center shadow-sm">
              <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full mx-auto flex items-center justify-center mb-4">
                 <User className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl mb-1 text-gray-900">Jane Doe</h3>
              <p className="text-gray-500 text-sm">jane@store.com</p>
           </div>
           
           <nav className="space-y-2">
             <Link href="#orders" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 font-medium text-gray-900"><Package className="w-5 h-5"/> Orders</Link>
             <Link href="#notifications" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 font-medium text-gray-600 transition-colors"><Bell className="w-5 h-5"/> Notifications 
                {notifications.some(n => !n.read) && <span className="ml-auto w-2 h-2 bg-red-500 rounded-full"></span>}
             </Link>
           </nav>
        </div>
        
        <div className="lg:col-span-3 space-y-16">
           <section id="orders">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Package className="w-6 h-6 text-gray-400"/> Order History</h2>
             {orders.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500 border border-gray-100">No orders yet. Start shopping!</div>
             ) : (
                <div className="space-y-6">
                  {orders.map(order => (
                    <div key={order.id} className="border border-gray-100 rounded-3xl p-6 bg-white hover:shadow-md transition-shadow">
                       <div className="flex justify-between items-start mb-6 border-b border-gray-50 pb-6">
                          <div>
                            <div className="text-xs tracking-wider uppercase font-bold text-gray-400 mb-1">Order #{order.id}</div>
                            <div className="font-semibold text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</div>
                          </div>
                          <div className="text-right">
                             <div className="font-bold text-xl mb-2 text-gray-900">₹{order.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</div>
                             <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-50 text-blue-700">{order.status}</span>
                          </div>
                       </div>
                       <div className="space-y-3">
                         {order.items.map(i => (
                            <div key={i.productId} className="flex justify-between text-sm">
                               <span className="text-gray-600 font-medium">Product ID: {i.productId} <span className="text-gray-400 mx-2">x</span> {i.quantity}</span>
                               <span className="font-semibold text-gray-900">₹{(i.price * i.quantity).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                            </div>
                         ))}
                       </div>
                    </div>
                  ))}
                </div>
             )}
           </section>
           
           <section id="notifications">
             <h2 className="text-2xl font-bold mb-6 flex items-center gap-3"><Bell className="w-6 h-6 text-gray-400"/> Notifications</h2>
             {notifications.length === 0 ? (
                <div className="bg-gray-50 rounded-3xl p-12 text-center text-gray-500 border border-gray-100">No new notifications.</div>
             ) : (
                <div className="space-y-4">
                  {notifications.map(n => (
                    <div key={n.id} className="flex items-start gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                       <div className="p-2 bg-blue-50 text-blue-600 rounded-full shrink-0">
                          {n.type === 'order_update' ? <Package className="w-5 h-5"/> : <Bell className="w-5 h-5" />}
                       </div>
                       <div>
                         <p className="text-gray-900 font-medium mb-1 leading-snug">{n.message}</p>
                         <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                           <Clock className="w-3 h-3" /> {new Date(n.createdAt).toLocaleString()}
                         </div>
                       </div>
                       {!n.read && <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full mt-2 shrink-0"></div>}
                    </div>
                  ))}
                </div>
             )}
           </section>
        </div>
      </div>
    </div>
  );
}
