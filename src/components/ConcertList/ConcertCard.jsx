import { Calendar, MapPin, Ticket } from 'lucide-react';

function formatDate(iso) {
  if (!iso) return '—';
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
  }).format(new Date(iso));
}

function formatPrice(cents) {
  if (cents == null) return 'TBA';
  return new Intl.NumberFormat('en-US', { 
    style: 'currency', 
    currency: 'THB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0 
  }).format(cents / 100);
}

export default function ConcertCard({ event, onSelect }) {
  const {
    name = 'Untitled Event',
    artist = 'Unknown Artist',
    venue = {},
    eventDate,
    genres = [],
    minPrice,
    availableSeats,
    imageUrl,
  } = event;

  const isSoldOut = availableSeats === 0;

  return (
    <article
      onClick={() => !isSoldOut && onSelect?.(event)}
      className="group flex flex-col bg-gray-900 rounded-3xl overflow-hidden cursor-pointer border border-white/5 transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/30 hover:border-indigo-500/30"
    >
      {/* ── IMAGE SECTION ── */}
      <div className="relative h-56 w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        
        {/* Genre Badge */}
        {genres && genres.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold uppercase tracking-wider text-white">
              {genres[0]}
            </span>
          </div>
        )}

        {isSoldOut && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <span className="border-2 border-red-500 px-6 py-2 text-xl font-black tracking-widest text-red-500 uppercase rounded-full rotate-[-10deg]">
              SOLD OUT
            </span>
          </div>
        )}
      </div>

      {/* ── CONTENT SECTION ── */}
      <div className="flex flex-col flex-1 p-6">
        
        {/* Artist / Title */}
        <div className="mb-4">
          <p className="text-indigo-400 font-mono text-sm tracking-widest uppercase mb-1">{artist}</p>
          <h3 className="text-2xl font-bold text-white leading-tight line-clamp-2">{name}</h3>
        </div>

        {/* Date & Location */}
        <div className="space-y-2 mb-6 text-gray-400 text-sm font-medium mt-auto">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span>{formatDate(eventDate)}</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <span className="truncate">{venue.name}, {venue.city}</span>
          </div>
        </div>

        {/* Footer: Price & CTA */}
        <div className="flex items-center justify-between pt-5 border-t border-white/10 mt-auto">
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-indigo-300/70 uppercase tracking-widest font-bold mb-0.5">Starting at</span>
            <span className="text-xl font-black text-white leading-none">{formatPrice(minPrice)}</span>
          </div>
          
          <button
            disabled={isSoldOut}
            className="shrink-0 flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs font-bold tracking-wide shadow-[0_4px_15px_rgba(99,102,241,0.3)] transition-all duration-300 hover:scale-105 hover:shadow-[0_6px_25px_rgba(99,102,241,0.5)] hover:from-indigo-500 hover:to-purple-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none group"
          >
            <Ticket className="w-3.5 h-3.5 transition-transform group-hover:-rotate-12" />
            <span className="whitespace-nowrap">Buy Now</span>
          </button>
        </div>
      </div>
    </article>
  );
}
