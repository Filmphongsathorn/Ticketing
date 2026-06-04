/**
 * Toast.jsx
 * Floating toast notification — amber for success, red for error.
 * Usage: <Toast message="Order placed!" type="success" onClose={fn} />
 */
import { useEffect } from 'react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      role="status"
      aria-live="polite"
      className={`
        fixed bottom-6 right-6 z-50
        flex items-center gap-3
        rounded-xl border px-5 py-4
        shadow-amber-md backdrop-blur-md
        animate-fadeUp
        max-w-sm
        ${isSuccess
          ? 'border-stage-amber/40 bg-stage-card text-stage-light'
          : 'border-red-800/50 bg-red-950/80 text-red-200'}
      `}
    >
      {isSuccess ? (
        <svg className="h-5 w-5 text-stage-amber flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ) : (
        <svg className="h-5 w-5 text-red-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0Zm-9 3.75h.008v.008H12v-.008Z" />
        </svg>
      )}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        aria-label="Close notification"
        className="ml-2 opacity-50 hover:opacity-100 transition-opacity"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
