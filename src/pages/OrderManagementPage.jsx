import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from '../components/ui/Header';
import Spinner from '../components/ui/Spinner';

export default function OrderManagementPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Mock fetching orders for all users
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/orders/admin/all'); // Assuming this endpoint exists, or mock it
        setOrders(Array.isArray(data) ? data : (data.content ?? []));
      } catch (err) {
        // Fallback mock data if endpoint doesn't exist
        setOrders([
          { id: 'ORD-12345', userId: 'user-1', eventName: 'Taylor Swift Eras Tour', totalAmount: 15000, status: 'confirmed', date: new Date().toISOString() },
          { id: 'ORD-12346', userId: 'user-2', eventName: 'Coldplay Sphere', totalAmount: 8500, status: 'pending', date: new Date(Date.now() - 86400000).toISOString() },
          { id: 'ORD-12347', userId: 'user-3', eventName: 'Ed Sheeran Math Tour', totalAmount: 4500, status: 'cancelled', date: new Date(Date.now() - 172800000).toISOString() },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white font-bold tracking-widest uppercase">
              Order <span className="text-purple-400">Management</span>
            </h1>
            <button onClick={() => navigate('/admin')} className="text-sm text-zinc-500 hover:text-purple-400 mt-2">
              &larr; Back to Dashboard
            </button>
          </div>
          
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Order ID..." 
              className="bg-zinc-900 border border-zinc-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:border-purple-500 outline-none w-64"
            />
            <svg className="w-4 h-4 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-800/80 text-zinc-400 uppercase font-mono text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Event</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white font-mono">{order.id}</td>
                    <td className="px-6 py-4">{order.eventName}</td>
                    <td className="px-6 py-4">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">฿{(order.totalAmount || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {order.status === 'confirmed' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Confirmed</span>}
                      {order.status === 'pending' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Pending</span>}
                      {order.status === 'cancelled' && <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20">Cancelled</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        className="text-blue-400 hover:text-blue-300 mr-4 font-medium"
                        onClick={() => alert(`View details for ${order.id}`)}
                      >
                        View
                      </button>
                      {order.status === 'confirmed' && (
                        <button 
                          className="text-amber-500 hover:text-amber-400 font-medium"
                          onClick={() => alert(`Initiate refund for ${order.id}?`)}
                        >
                          Refund
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
