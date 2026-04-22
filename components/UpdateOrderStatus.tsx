'use client';
import { updateOrderStatus } from '@/lib/actions';
import { useState } from 'react';

export default function UpdateOrderStatus({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(currentStatus);
  
  const update = async (newStatus: any) => {
    setStatus(newStatus);
    setLoading(true);
    await updateOrderStatus(orderId, newStatus);
    setLoading(false);
  };

  return (
    <div className="relative inline-block w-32">
      <select 
        value={status}
        onChange={e => update(e.target.value)}
        disabled={loading}
        className="block w-full appearance-none bg-white border border-gray-200 text-gray-700 py-2 px-4 pr-8 rounded-xl leading-tight focus:outline-none focus:bg-white focus:border-blue-500 disabled:opacity-50 text-sm font-medium cursor-pointer"
      >
        <option value="pending">Pending</option>
        <option value="shipped">Shipped</option>
        <option value="delivered">Delivered</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  );
}
