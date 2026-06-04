import { useState } from 'react';
import api from '../api/api';
import Header from '../components/ui/Header';
import Spinner from '../components/ui/Spinner';

export default function ScanTicketPage() {
  const [ticketId, setTicketId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleScan = async (e) => {
    e.preventDefault();
    if (!ticketId.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const { data } = await api.post(`/orders/tickets/${ticketId.trim()}/scan`);
      setResult({
        success: true,
        message: 'Ticket successfully scanned! Valid for Entry.',
        data
      });
    } catch (err) {
      setResult({
        success: false,
        message: err.response?.data?.error || err.message || 'Validation failed'
      });
    } finally {
      setLoading(false);
      setTicketId('');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />
      <div className="pt-32 px-4 max-w-xl mx-auto flex flex-col items-center">
        <h1 className="font-display text-4xl text-white font-bold mb-2">Staff Scanner</h1>
        <p className="text-zinc-400 mb-8">Scan a ticket QR code (or enter UUID manually)</p>

        <form onSubmit={handleScan} className="w-full relative">
          <input
            type="text"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            placeholder="Enter Ticket UUID..."
            className="w-full px-6 py-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white font-mono focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400"
          />
          <button
            type="submit"
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 px-6 bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase tracking-wider rounded-lg text-sm transition-colors disabled:opacity-50"
          >
            {loading ? <Spinner size="sm" /> : 'Scan'}
          </button>
        </form>

        {result && (
          <div className={`mt-8 w-full p-6 rounded-2xl border ${
            result.success 
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' 
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center ${
                result.success ? 'bg-emerald-500/20' : 'bg-red-500/20'
              }`}>
                {result.success ? (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold mb-1">{result.success ? 'VALID TICKET' : 'INVALID TICKET'}</h3>
                <p className="text-sm opacity-80">{result.message}</p>
                {result.data && (
                  <div className="mt-4 pt-4 border-t border-current/20 text-xs font-mono space-y-1">
                    <p>Event: {result.data.concertName}</p>
                    <p>Seat: {result.data.seatNumber}</p>
                    <p>ID: {result.data.id}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
