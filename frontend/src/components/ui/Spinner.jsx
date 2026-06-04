/**
 * Spinner.jsx
 * Amber ring spinner used for loading states.
 */
export default function Spinner({ size = 'md', label = 'Loading…' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  };

  return (
    <span role="status" aria-label={label} className="inline-flex items-center justify-center">
      <span
        className={`
          ${sizes[size]}
          rounded-full
          border-stage-border
          border-t-stage-amber
          animate-spin_slow
          block
        `}
      />
      <span className="sr-only">{label}</span>
    </span>
  );
}
