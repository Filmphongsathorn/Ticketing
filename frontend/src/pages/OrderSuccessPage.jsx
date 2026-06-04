import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchOrderById } from '../api/api';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function OrderSuccessPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const event = location.state?.event; // passed from checkout
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadOrder() {
      try {
        setLoading(true);
        const { data } = await fetchOrderById(orderId);
        setOrder(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch order details.');
      } finally {
        setLoading(false);
      }
    }
    loadOrder();
  }, [orderId]);

  return (
    <div className="flex min-h-[calc(100vh-80px)] pt-20 flex-col items-center justify-center bg-stage-black bg-spotlight px-4 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border-2 border-emerald-500/40 bg-emerald-500/10 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
        <svg className="h-12 w-12 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </div>
      
      <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
        Payment <span className="text-emerald-400">Successful!</span>
      </h1>
      
      {loading ? (
        <p className="text-stage-muted animate-pulse">Loading order details...</p>
      ) : error ? (
        <ErrorBanner message={error} />
      ) : (
        <div className="bg-stage-card border border-stage-border rounded-2xl p-8 max-w-md w-full mt-4">
          <p className="text-zinc-300 text-lg mb-2">
            Order <span className="font-mono text-amber-400">#{order?.orderId || orderId}</span>
          </p>
          <p className="text-white font-medium text-xl mb-6">
            {order?.items?.[0]?.concertName || event?.name || "Concert Ticket"}
          </p>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 mb-8">
            <p className="text-amber-300 text-sm flex items-center gap-2 justify-center">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              ระบบได้จัดส่ง E-Ticket ไปยังอีเมลของท่านแล้ว
            </p>
          </div>
          
          <button
            onClick={() => navigate('/orders')}
            className="w-full rounded-xl bg-amber-500 py-3.5 text-base font-bold text-black transition-all hover:bg-amber-400 hover:-translate-y-0.5 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
          >
            View My Tickets
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full mt-3 rounded-xl border border-stage-border bg-transparent py-3 text-sm font-medium text-stage-muted transition-all hover:text-white hover:bg-white/5"
          >
            Back to Home
          </button>
        </div>
      )}
    </div>
  );
}
