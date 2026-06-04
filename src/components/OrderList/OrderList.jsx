import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/api";

/* ── Status helpers ── */
const STATUS_MAP = {
  confirmed: { label: "Confirmed", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/25" },
  pending:   { label: "Pending",   color: "text-amber-400 bg-amber-400/10 border-amber-400/25" },
  cancelled: { label: "Cancelled", color: "text-red-400 bg-red-400/10 border-red-400/25" },
  completed: { label: "Attended",  color: "text-zinc-400 bg-zinc-400/10 border-zinc-500/25" },
};

function statusStyle(s = "") {
  return STATUS_MAP[s.toLowerCase()] || STATUS_MAP.pending;
}

/* ── Date formatter ── */
function fmtDate(dateStr) {
  if (!dateStr) return "—";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short", month: "short", day: "numeric",
      year: "numeric", hour: "2-digit", minute: "2-digit",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
}

/* ── Currency formatter ── */
function fmtCurrency(amount, currency = "USD") {
  if (amount == null) return "—";
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

/* ── Icons ── */
const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const TicketSeatIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
    <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
  </svg>
);

const RefreshIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
  </svg>
);

/* ── Skeleton card ── */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-zinc-800 bg-zinc-900/50 overflow-hidden">
      <div className="h-1.5 bg-zinc-700 w-full" />
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <div className="h-5 bg-zinc-700 rounded-lg w-3/4" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
          <div className="h-6 w-20 bg-zinc-700 rounded-full" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="h-8 bg-zinc-800 rounded-lg" />
          <div className="h-8 bg-zinc-800 rounded-lg" />
        </div>
        <div className="flex justify-between items-center pt-2 border-t border-zinc-800">
          <div className="h-3 w-32 bg-zinc-800 rounded" />
          <div className="h-5 w-16 bg-zinc-700 rounded" />
        </div>
      </div>
    </div>
  );
}

/* ── Ticket Card ── */
function TicketCard({ order, item, onShowQR }) {
  const status = statusStyle(item?.status || order.status);
  const eventName = item?.concertName || order.eventName || "Concert Event";
  const venue = order.venue || null;
  const eventDate = order.eventDate || null;
  const seat = item?.seatNumber || "TBA";
  const price = item?.price || null;
  const currency = order.currency || "USD";
  const orderId = order.id || order.orderId;
  const ticketId = item?.id || orderId;

  return (
    <div className="group relative rounded-2xl border border-zinc-800 bg-zinc-900/60 backdrop-blur-sm overflow-hidden hover:border-amber-500/30 transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
      {/* Top accent bar */}
      <div
        className={`h-1 w-full transition-all duration-300 ${
          order.status?.toLowerCase() === "confirmed"
            ? "bg-gradient-to-r from-emerald-500 to-emerald-400"
            : order.status?.toLowerCase() === "cancelled"
            ? "bg-gradient-to-r from-red-600 to-red-500"
            : "bg-gradient-to-r from-amber-500 to-amber-400"
        }`}
      />

      <div className="p-6">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-bold text-white truncate group-hover:text-amber-50 transition-colors">
              {eventName}
            </h3>
            {orderId && (
              <p className="text-xs text-zinc-600 mt-0.5 font-mono">
                #{String(orderId).slice(-8).toUpperCase()}
              </p>
            )}
          </div>
          <span className={`flex-shrink-0 text-xs font-semibold px-3 py-1 rounded-full border ${status.color}`}>
            {status.label}
          </span>
        </div>

        {/* Details grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
          {eventDate && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 text-xs">
              <CalendarIcon />
              <span className="truncate">{fmtDate(eventDate)}</span>
            </div>
          )}
          {venue && (
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 text-xs">
              <LocationIcon />
              <span className="truncate">{venue}</span>
            </div>
          )}
          <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-zinc-800/60 text-zinc-400 text-xs">
            <TicketSeatIcon />
            <span>Seat {seat}</span>
          </div>
        </div>

        {/* Footer row with QR Code */}
        <div className="flex items-center justify-between pt-4 border-t border-zinc-800/80 mt-2">
          <div className="text-xs text-zinc-500 flex flex-col justify-between">
            {order.createdAt && <div>Ordered {fmtDate(order.createdAt)}</div>}
            {price != null && (
              <div className="text-base font-bold text-amber-400 mt-2">
                {fmtCurrency(price, currency)}
              </div>
            )}
          </div>
          
          {/* QR Code */}
          <div 
            className="bg-white p-1 rounded-lg cursor-pointer hover:ring-2 hover:ring-amber-500 transition-all"
            onClick={() => onShowQR(ticketId, eventName, seat)}
          >
            <QRCodeCanvas 
              value={ticketId ? String(ticketId) : "dummy-qr"}
              size={64}
              bgColor={"#ffffff"}
              fgColor={"#000000"}
              level={"L"}
            />
          </div>
        </div>
      </div>

      {/* Decorative ticket stub perforation */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-[#07070d] border border-zinc-800/60" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-5 h-5 rounded-full bg-[#07070d] border border-zinc-800/60" />
    </div>
  );
}

/* ── Empty State ── */
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="relative mb-6">
        <div className="w-20 h-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-10 h-10 text-zinc-700" stroke="currentColor" strokeWidth={1.2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
        </div>
        <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
          <span className="text-amber-400 text-xs font-bold">0</span>
        </div>
      </div>
      <h3 className="text-xl font-bold text-white mb-2">No tickets yet</h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-8">
        You haven't purchased any tickets yet. Browse upcoming events and grab yours before they sell out.
      </p>
      <Link
        to="/"
        className="group px-6 py-3 rounded-full bg-amber-400 hover:bg-amber-300 text-black text-sm font-bold tracking-wide transition-all duration-200 shadow-[0_4px_16px_rgba(251,191,36,0.2)] hover:shadow-[0_4px_24px_rgba(251,191,36,0.35)]"
      >
        Browse Events →
      </Link>
    </div>
  );
}

/* ── Error State ── */
function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
        <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-red-400" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-1">Failed to load tickets</h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-6">{message || "Something went wrong. Please try again."}</p>
      <button
        onClick={onRetry}
        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-zinc-600 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
      >
        <RefreshIcon /> Try again
      </button>
    </div>
  );
}

/* ── Main Component ── */
export default function OrderList() {
  const { user, token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // QR Modal State
  const [qrModal, setQrModal] = useState({ isOpen: false, ticketId: null, eventName: '', seat: '' });

  const handleShowQR = (ticketId, eventName, seat) => {
    setQrModal({ isOpen: true, ticketId, eventName, seat });
  };

  useEffect(() => {
    if (!token || !user?.id) return;
    let cancelled = false;

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await api.get(`/orders/user/${user.id}`);
        if (!cancelled) {
          // Normalise: accept array or { orders: [] } or { data: [] }
          const list = Array.isArray(data)
            ? data
            : Array.isArray(data?.orders)
            ? data.orders
            : Array.isArray(data?.data)
            ? data.data
            : [];
          setOrders(list);
        }
      } catch (err) {
        if (!cancelled) {
          const msg =
            err.response?.data?.message ||
            err.response?.data?.error ||
            err.message ||
            "Unable to fetch orders.";
          setError(msg);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchOrders();
    return () => { cancelled = true; };
  }, [token, user?.id, retryCount]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={() => setRetryCount((c) => c + 1)} />;
  }

  if (!orders.length) {
    return <EmptyState />;
  }

  return (
    <div>
      {/* Summary bar */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-zinc-500">
          Showing{" "}
          <span className="font-semibold text-zinc-300">{orders.length}</span>{" "}
          {orders.length === 1 ? "ticket" : "tickets"}
        </p>
        <button
          onClick={() => setRetryCount((c) => c + 1)}
          className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
          title="Refresh"
        >
          <RefreshIcon />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {orders.flatMap((order) => 
          order.items && order.items.length > 0 
            ? order.items.map(item => <TicketCard key={item.id} order={order} item={item} onShowQR={handleShowQR} />)
            : [<TicketCard key={order.id || Math.random()} order={order} item={null} onShowQR={handleShowQR} />]
        )}
      </div>

      {/* QR Code Modal */}
      {qrModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setQrModal({ isOpen: false })}>
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100" onClick={e => e.stopPropagation()}>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{qrModal.eventName}</h3>
            <p className="text-gray-500 font-mono mb-6">Seat: {qrModal.seat}</p>
            
            <div className="bg-gray-100 p-4 rounded-2xl flex justify-center mb-6">
              <QRCodeCanvas 
                value={qrModal.ticketId ? String(qrModal.ticketId) : "dummy"}
                size={200}
                bgColor={"#f3f4f6"}
                fgColor={"#000000"}
                level={"H"}
              />
            </div>
            
            <p className="text-xs text-gray-400 mb-6">Scan this code at the venue entrance</p>
            
            <button 
              onClick={() => setQrModal({ isOpen: false })}
              className="w-full py-3 rounded-xl bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
