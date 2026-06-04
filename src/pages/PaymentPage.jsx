import { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import Spinner from '../components/ui/Spinner';

export default function PaymentPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [paymentStatus, setPaymentStatus] = useState('pending'); // 'pending', 'processing', 'success'

  // We can pass the total amount via state from Checkout.jsx
  const totalAmount = state?.totalAmount || 1000;

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentStatus('success');
    }, 2000);
  };

  if (paymentStatus === 'success') {
    return (
      <div className="min-h-screen bg-stage-black bg-spotlight px-4 py-12 flex flex-col items-center justify-center text-center">
        <div className="w-full max-w-md bg-[#0a0a0c] border border-emerald-500/30 rounded-3xl p-8 md:p-10 shadow-[0_0_80px_rgba(16,185,129,0.15)] animate-in zoom-in-95 duration-500 relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-emerald-500/20 blur-[100px] rounded-full pointer-events-none" />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Animated Checkmark */}
            <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/30 mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
              <svg className="w-12 h-12 text-emerald-400 animate-[bounce_1s_ease-in-out_infinite]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" className="animate-[dash_1s_ease-in-out_forwards]" strokeDasharray="50" strokeDashoffset="50" />
              </svg>
            </div>

            <h2 className="font-display text-3xl font-bold text-white mb-2 tracking-wide">
              Payment <span className="text-emerald-400">Successful!</span>
            </h2>
            <p className="text-zinc-400 text-sm mb-8 font-mono">
              Ref: {orderId?.toUpperCase() || 'TXN-SUCCESS'}
            </p>

            <div className="w-full p-4 rounded-xl bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-zinc-500">Amount Paid</span>
                <span className="text-white font-mono font-bold">${(totalAmount / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Payment Method</span>
                <span className="text-white">PromptPay QR</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/orders', { replace: true })}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-stage-black bg-emerald-400 hover:bg-emerald-300 transition-all duration-200 shadow-[0_4px_24px_rgba(52,211,153,0.3)] hover:shadow-[0_8px_32px_rgba(52,211,153,0.4)] hover:-translate-y-1"
            >
              View My E-Ticket
            </button>
          </div>
        </div>
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stage-black bg-spotlight px-4 py-12 flex flex-col items-center justify-center text-center">
      <div className="w-full max-w-md bg-zinc-900/80 backdrop-blur-xl border border-zinc-800/80 rounded-2xl p-8 shadow-2xl">
        <h2 className="font-display text-3xl font-bold text-white uppercase tracking-wider mb-2">
          Scan to <span className="text-amber-400">Pay</span>
        </h2>
        <p className="text-sm text-zinc-400 mb-8">
          Order #{orderId?.slice(-8).toUpperCase() || 'UNKNOWN'}
        </p>

        <div className="bg-white p-6 rounded-2xl mx-auto w-fit mb-6 shadow-[0_0_40px_rgba(251,191,36,0.15)]">
          <QRCodeCanvas 
            value={`PAYMENT_FOR_ORDER_${orderId}`}
            size={200}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
            level={"Q"}
          />
        </div>

        <div className="text-2xl font-mono text-amber-400 font-bold mb-8">
          ${(totalAmount / 100).toFixed(2)}
        </div>

        <p className="text-xs text-zinc-500 mb-8">
          Please scan this QR code with your mobile banking app to complete the purchase.
        </p>

        <button
          onClick={handleSimulatePayment}
          disabled={paymentStatus === 'processing'}
          className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-bold text-sm tracking-widest uppercase text-black bg-amber-400 hover:bg-amber-300 transition-all duration-200 shadow-[0_4px_24px_rgba(251,191,36,0.25)] disabled:opacity-70 disabled:cursor-not-allowed hover:-translate-y-1"
        >
          {paymentStatus === 'processing' ? (
            <>
              <Spinner size="sm" />
              Processing...
            </>
          ) : (
            "Simulate Payment Success"
          )}
        </button>
      </div>
    </div>
  );
}
