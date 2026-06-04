/**
 * Checkout.jsx
 * ---------------------------------------------------------------------------
 * Handles the complete ticket purchase flow:
 *
 *   1. Accepts an event + pre-selected seat IDs (via React Router state or props)
 *   2. Collects (simulated) payment details
 *   3. POSTs to POST /api/orders via the Axios instance
 *   4. Handles all loading / error / success states
 *
 * Order payload shape (matches Order Service DTO from the spec):
 * {
 *   eventId:      string,
 *   seatIds:      string[],
 *   paymentToken: string,    // tokenised card — replace with Stripe/etc in prod
 * }
 * ---------------------------------------------------------------------------
 */

import { useCallback, useEffect, useReducer, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { createOrder, fetchEventById } from '../../api/api';
import { useAuth } from '../../hooks/useAuth';
import ErrorBanner from '../ui/ErrorBanner';
import Spinner from '../ui/Spinner';
import Toast from '../ui/Toast';

// ─── Form reducer ────────────────────────────────────────────────────────────
const initialForm = {
  cardName:  '',
  cardNum:   '',
  cardExp:   '',
  cardCvv:   '',
};

function formReducer(state, action) {
  switch (action.type) {
    case 'SET':   return { ...state, [action.field]: action.value };
    case 'RESET': return initialForm;
    default:      return state;
  }
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatCardNum(raw) {
  return raw.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExp(raw) {
  const digits = raw.replace(/\D/g, '').slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
}

function validate(form, seats) {
  const errors = {};
  if (!form.cardName.trim())  errors.cardName = 'Cardholder name is required.';
  if (!form.cardNum.trim())   errors.cardNum  = 'Card number is required.';
  if (!form.cardExp.trim())   errors.cardExp  = 'Expiry is required.';
  if (!form.cardCvv.trim())   errors.cardCvv  = 'CVV is required.';
  
  // Temporarily bypass seat validation until Phase 2 (Seat Map) is implemented
  // if (!seats || seats.length === 0)                 errors.seats    = 'No seats selected.';
  return errors;
}

/** Simulate card tokenisation — replace with Stripe.js or similar in production */
async function tokeniseCard(form) {
  await new Promise((r) => setTimeout(r, 1500)); // mock latency for dramatic effect
  return `tok_${Date.now()}`;
}

function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(iso));
}

function formatPrice(cents) {
  if (cents == null) return 'TBA';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100);
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Checkout() {
  const { eventId } = useParams();
  const { state }   = useLocation();
  const navigate    = useNavigate();
  const { isAuthenticated, user } = useAuth();

  // Event data — prefer router state (avoids extra fetch), fall back to API call
  const [event,     setEvent]     = useState(state?.event ?? null);
  const [seats,     setSeats]     = useState(state?.selectedSeats ?? []);
  const [eventLoad, setEventLoad] = useState(!state?.event);
  const [eventErr,  setEventErr]  = useState(null);

  // Form
  const [form,       dispatch]   = useReducer(formReducer, initialForm);
  const [fieldErr,   setFieldErr] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError,   setApiError]   = useState(null);
  const [orderId,    setOrderId]    = useState(null);
  const [toast,      setToast]      = useState({ message: '', type: 'success' });
  const [paymentMethod, setPaymentMethod] = useState("credit_card");

  // Promo Code
  const [promoCode, setPromoCode] = useState('');
  const [promoData, setPromoData] = useState(null);
  const [promoErr, setPromoErr] = useState('');
  const [validatingPromo, setValidatingPromo] = useState(false);

  // Countdown Timer (10 minutes)
  const [timeLeft, setTimeLeft] = useState(600);

  useEffect(() => {
    if (timeLeft <= 0) {
      setToast({ message: 'Session expired. Seats have been released.', type: 'error' });
      setTimeout(() => navigate(`/events/${eventId || ''}`), 2000);
      return;
    }
    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, navigate, eventId]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // ── Fetch event if not passed via router state ──────────────────────────
  useEffect(() => {
    if (!eventLoad || !eventId) return;
    (async () => {
      try {
        const { data } = await fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        setEventErr(err.message ?? 'Failed to load event details.');
      } finally {
        setEventLoad(false);
      }
    })();
  }, [eventId, eventLoad]);

  // ── Redirect unauthenticated users ──────────────────────────────────────
  useEffect(() => {
    if (!isAuthenticated) navigate('/login', { replace: true });
  }, [isAuthenticated, navigate]);

  // ── Promo Handler ────────────────────────────────────────────────────────
  const handleValidatePromo = async () => {
    if (!promoCode.trim()) return;
    setValidatingPromo(true);
    setPromoErr('');
    try {
      const { data } = await api.get(`/orders/promo/validate?code=${promoCode.trim()}`);
      setPromoData(data);
      setToast({ message: 'Promo code applied!', type: 'success' });
    } catch (err) {
      setPromoErr(err.response?.data?.error || 'Invalid promo code');
      setPromoData(null);
    } finally {
      setValidatingPromo(false);
    }
  };

  // ── Input handler ────────────────────────────────────────────────────────
  const handleInput = (field) => (e) => {
    let value = e.target.value;
    if (field === 'cardNum') value = formatCardNum(value);
    if (field === 'cardExp') value = formatExp(value);
    if (field === 'cardCvv') value = value.replace(/\D/g, '').slice(0, 4);
    dispatch({ type: 'SET', field, value });
    if (fieldErr[field]) setFieldErr((prev) => ({ ...prev, [field]: undefined }));
  };

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setApiError(null);

    const errors = validate(form, seats);
    if (Object.keys(errors).length > 0) {
      setFieldErr(errors);
      return;
    }

    setSubmitting(true);
    try {
      const paymentToken = await tokeniseCard(form);

      // Create proper payload matching the CreateOrderRequest DTO in order-service
      const activeSeats = seats.length > 0 ? seats : ['GA-1']; // Fallback for Phase 1 demo
      
      const payload = {
        userId: user?.id,
        userEmail: user?.email,
        promoCode: promoData?.code,
        items: activeSeats.map((seat) => {
           let seatPrice = (event?.minPrice && event.minPrice > 0 ? event.minPrice : 1000) / 100;
           if (promoData) seatPrice = seatPrice * (1 - (promoData.discountPercentage / 100));
           return {
             concertEventId: String(event?.id ?? eventId),
             concertName: event?.name ?? "Event Ticket",
             seatNumber: typeof seat === 'object' ? (seat.seatNumber ?? seat.id) : String(seat),
             price: seatPrice
           };
        })
      };

      const { data } = await createOrder(payload);
      const newOrderId = data?.orderId ?? data?.id ?? 'confirmed';
      setToast({ message: '🎟 Order created! Redirecting to payment...', type: 'success' });
      dispatch({ type: 'RESET' });
      
      // Navigate based on payment method
      setTimeout(() => {
        if (paymentMethod === "promptpay") {
          navigate(`/payment/${newOrderId}`, { state: { totalAmount: total, event } });
        } else {
          // If credit card, redirect to success page
          navigate(`/success/${newOrderId}`, { state: { event } });
        }
      }, 1000);
    } catch (err) {
      const msg = err.message ?? 'Payment failed. Please check your details and try again.';
      setApiError(msg);
      setToast({ message: msg, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  }, [form, seats, event, eventId, paymentMethod]);

  // ── Derived values ───────────────────────────────────────────────────────
  const ticketCount = seats.length || 1; // fallback to 1 for demo
  const subtotal    = (event?.minPrice ?? 0) * ticketCount;
  const discount    = promoData ? (subtotal * (promoData.discountPercentage / 100)) : 0;
  const fees        = Math.round((subtotal - discount) * 0.12);
  const total       = (subtotal - discount) + fees;

  // ─── Render: loading event ────────────────────────────────────────────────
  if (eventLoad) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stage-black">
        <Spinner size="lg" label="Loading event details…" />
      </div>
    );
  }

  // ─── Render: event not found ──────────────────────────────────────────────
  if (eventErr) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-stage-black px-4">
        <ErrorBanner message={eventErr} />
        <button onClick={() => navigate('/events')} className="text-sm text-stage-amber hover:underline">
          ← Back to Events
        </button>
      </div>
    );
  }

  // ─── Render: order created (redirecting) ───────────────────
  if (orderId) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-stage-black bg-spotlight px-4 text-center">
        <Spinner size="lg" label="Processing your order..." />
      </div>
    );
  }

  // ─── Render: main checkout ────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-stage-black bg-spotlight px-4 py-12 md:px-8">
      <Toast message={toast.message} type={toast.type} onClose={() => setToast({ message: '' })} />

      <div className="mx-auto max-w-5xl">

        {/* Back link */}
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-sm text-stage-muted hover:text-stage-amber transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          Back to events
        </button>

        {/* Page title and Countdown */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 className="font-display text-3xl font-bold text-stage-light md:text-4xl">
            Complete your <span className="text-amber-gradient">Order</span>
          </h1>
          
          <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg">
            <svg className="w-5 h-5 text-red-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-400 font-mono font-medium">Time left: {formatTime(timeLeft)}</span>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">

          {/* ── Left: payment form ── */}
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* API error */}
            <ErrorBanner message={apiError} onDismiss={() => setApiError(null)} />

            {/* Section: Payment Details */}
            <fieldset className="rounded-2xl border border-stage-border bg-stage-card p-6 space-y-5">
              <legend className="px-1 font-mono text-xs uppercase tracking-widest text-stage-amber">
                Payment Details
              </legend>

              <div className="flex gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("credit_card");
                    setFieldErr({});
                  }}
                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-200 ${
                    paymentMethod === "credit_card"
                      ? "bg-amber-500/10 border-stage-amber text-stage-amber shadow-[0_0_15px_rgba(245,158,11,0.15)]"
                      : "bg-stage-dark border-stage-border text-stage-muted hover:border-stage-muted"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <span className="text-xs font-semibold tracking-wide">Credit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setPaymentMethod("promptpay");
                    setFieldErr({});
                  }}
                  className={`flex-1 py-3 rounded-xl border flex flex-col items-center gap-1 transition-all duration-200 ${
                    paymentMethod === "promptpay"
                      ? "bg-blue-500/10 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
                      : "bg-stage-dark border-stage-border text-stage-muted hover:border-stage-muted"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                  <span className="text-xs font-semibold tracking-wide">PromptPay QR</span>
                </button>
              </div>

              {paymentMethod === "credit_card" ? (
                <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <FormField
                    label="Cardholder Name"
                    id="cardName"
                    type="text"
                    placeholder="Jane Smith"
                    value={form.cardName}
                    onChange={handleInput('cardName')}
                    error={fieldErr.cardName}
                    autoComplete="cc-name"
                  />

                  <FormField
                    label="Card Number"
                    id="cardNum"
                    type="text"
                    inputMode="numeric"
                    placeholder="1234 5678 9012 3456"
                    value={form.cardNum}
                    onChange={handleInput('cardNum')}
                    error={fieldErr.cardNum}
                    autoComplete="cc-number"
                    maxLength={19}
                    icon={
                      <svg className="h-4 w-4 text-stage-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                          d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                      </svg>
                    }
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      label="Expiry"
                      id="cardExp"
                      type="text"
                      inputMode="numeric"
                      placeholder="MM/YY"
                      value={form.cardExp}
                      onChange={handleInput('cardExp')}
                      error={fieldErr.cardExp}
                      autoComplete="cc-exp"
                      maxLength={5}
                    />
                    <FormField
                      label="CVV"
                      id="cardCvv"
                      type="password"
                      inputMode="numeric"
                      placeholder="•••"
                      value={form.cardCvv}
                      onChange={handleInput('cardCvv')}
                      error={fieldErr.cardCvv}
                      autoComplete="cc-csc"
                      maxLength={4}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300 flex flex-col items-center justify-center py-6 text-center bg-[#0a0a0c] border border-blue-500/20 rounded-xl">
                  <div className="w-14 h-14 bg-blue-500/10 border border-blue-500/20 rounded-full flex items-center justify-center mb-2 text-blue-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                    </svg>
                  </div>
                  <h4 className="text-stage-light font-medium text-sm">Pay with PromptPay</h4>
                  <p className="text-xs text-stage-muted max-w-[200px]">
                    You will be redirected to the QR Code page after confirming your order.
                  </p>
                </div>
              )}
            </fieldset>

            {/* Seat error */}
            {fieldErr.seats && (
              <ErrorBanner message={fieldErr.seats} />
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="
                w-full rounded-xl
                bg-stage-amber py-4
                text-base font-bold text-stage-black
                shadow-amber-md
                transition-all duration-200
                hover:bg-stage-gold hover:shadow-amber-lg
                active:scale-[0.98]
                disabled:cursor-not-allowed disabled:opacity-60
                flex items-center justify-center gap-3
              "
            >
              {submitting ? (
                <>
                  <Spinner size="sm" />
                  Processing…
                </>
              ) : (
                <>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
                  </svg>
                  Confirm & Pay {formatPrice(total)}
                </>
              )}
            </button>

            <p className="text-center text-xs text-stage-muted">
              Your payment is encrypted and processed securely. We never store card details.
            </p>
          </form>

          {/* ── Right: order summary ── */}
          <aside>
            <div className="sticky top-8 rounded-2xl border border-stage-border bg-stage-card bg-card-glow p-6 space-y-5">
              <h2 className="font-mono text-xs uppercase tracking-widest text-stage-amber">Order Summary</h2>

              {/* Event info */}
              {event ? (
                <div className="space-y-1">
                  <p className="font-display text-lg font-semibold text-stage-light leading-snug">{event.name}</p>
                  <p className="text-sm text-stage-muted font-mono">{event.artist}</p>
                  <p className="text-xs text-stage-muted">{formatDate(event.eventDate)}</p>
                  {event.venue?.name && (
                    <p className="text-xs text-stage-muted">{event.venue.name}{event.venue.city ? `, ${event.venue.city}` : ''}</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="h-5 skeleton rounded" />
                  <div className="h-4 w-2/3 skeleton rounded" />
                </div>
              )}

              <hr className="border-stage-border" />

              {/* Seats */}
              {seats.length > 0 ? (
                <ul className="space-y-1.5 text-sm">
                  {seats.map((seat, i) => (
                    <li key={typeof seat === 'object' ? seat.id : i}
                        className="flex items-center justify-between text-stage-light">
                      <span className="font-mono text-xs text-stage-muted">
                        {typeof seat === 'object' ? `${seat.section ?? 'Sec'} · Row ${seat.row ?? '?'} · ${seat.seatNumber ?? seat.id}` : `Seat ${seat}`}
                      </span>
                      <span>{formatPrice(event?.minPrice)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-stage-muted italic">
                  1 × General Admission (demo)
                </p>
              )}

              <hr className="border-stage-border" />

              {/* Promo Code Input */}
              <div className="space-y-2">
                <label className="text-xs font-mono text-stage-muted uppercase tracking-widest">Promo Code</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value); setPromoErr(''); }}
                    placeholder="ENTER CODE"
                    className="flex-1 bg-stage-dark border border-stage-border rounded-lg px-3 py-2 text-sm text-white focus:border-stage-amber outline-none uppercase"
                    disabled={promoData}
                  />
                  {!promoData ? (
                    <button 
                      type="button"
                      onClick={handleValidatePromo}
                      disabled={validatingPromo || !promoCode.trim()}
                      className="bg-stage-border hover:bg-stage-muted text-white px-4 rounded-lg text-sm transition-colors disabled:opacity-50"
                    >
                      {validatingPromo ? '...' : 'Apply'}
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={() => { setPromoData(null); setPromoCode(''); }}
                      className="bg-red-500/20 text-red-400 px-4 rounded-lg text-sm transition-colors"
                    >
                      Remove
                    </button>
                  )}
                </div>
                {promoErr && <p className="text-xs text-red-400">{promoErr}</p>}
                {promoData && <p className="text-xs text-emerald-400">Promo '{promoData.code}' applied (-{promoData.discountPercentage}%)</p>}
              </div>

              <hr className="border-stage-border" />

              {/* Price breakdown */}
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-stage-muted">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {promoData && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({promoData.discountPercentage}%)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-stage-muted">
                  <span>Service fees (12%)</span>
                  <span>{formatPrice(fees)}</span>
                </div>
                <div className="flex justify-between font-semibold text-stage-light text-base pt-1 border-t border-stage-border">
                  <span>Total</span>
                  <span className="text-amber-gradient font-bold">{formatPrice(total)}</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─── FormField sub-component ──────────────────────────────────────────────────
function FormField({ label, id, error, icon, ...inputProps }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-medium text-stage-muted">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2">
            {icon}
          </span>
        )}
        <input
          id={id}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={!!error}
          className={`
            w-full rounded-xl border bg-stage-dark
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            text-sm text-stage-light placeholder-stage-muted/60
            outline-none transition-colors
            ${error
              ? 'border-red-700 focus:border-red-500 focus:ring-1 focus:ring-red-500/20'
              : 'border-stage-border focus:border-stage-amber/50 focus:ring-1 focus:ring-stage-amber/15'}
          `}
          {...inputProps}
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
