import { getOrders } from '@/lib/actions';
import UpdateOrderStatus from '@/components/UpdateOrderStatus';

export default async function AdminOrders() {
  const orders = await getOrders();
  
  return (
    <div>
      <h1 className="text-4xl font-extrabold mb-10 tracking-tight">Manage Orders</h1>
      <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
         <table className="w-full text-left col-span-full">
           <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest font-bold border-b border-gray-100">
             <tr>
               <th className="p-6">Order ID</th>
               <th className="p-6">Date</th>
               <th className="p-6">Amount</th>
               <th className="p-6">Status</th>
             </tr>
           </thead>
           <tbody>
             {orders.length === 0 && (
                <tr>
                   <td colSpan={4} className="p-12 text-center text-gray-500">No orders placed yet.</td>
                </tr>
             )}
             {orders.map(o => (
               <tr key={o.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors">
                  <td className="p-6 font-mono text-sm text-gray-600">{o.id}</td>
                  <td className="p-6 font-medium text-gray-900">{(new Date(o.createdAt)).toLocaleDateString()}</td>
                  <td className="p-6 font-extrabold text-gray-900">₹{o.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</td>
                  <td className="p-6">
                     <UpdateOrderStatus orderId={o.id} currentStatus={o.status} />
                  </td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
}
