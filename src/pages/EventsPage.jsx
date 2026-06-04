import { ArrowRight, Ticket, Calendar, MapPin, Music } from 'lucide-react';
import ConcertList from '../components/ConcertList/ConcertList';

export default function EventsPage() {
  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans selection:bg-indigo-500/30">
      
      {/* ── HERO SECTION ── */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Video/Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=2070" 
            alt="Concert Crowd" 
            className="w-full h-full object-cover opacity-30 mix-blend-screen scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center mt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
            <span className="text-sm font-medium tracking-wide text-indigo-300 uppercase">Live Music Is Back</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight text-white drop-shadow-2xl">
            EXPERIENCE THE <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-600 animate-gradient-x">
              ULTIMATE SOUND
            </span>
          </h1>
          
          <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-light leading-relaxed">
            Secure your spot at the most anticipated world-class music festivals and exclusive intimate acoustic sessions. The stage is set.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={() => window.scrollTo({ top: window.innerHeight * 0.9, behavior: 'smooth' })}
              className="group relative px-8 py-4 bg-white text-gray-900 font-bold rounded-full text-lg overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(99,102,241,0.6)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity"></div>
              <span className="flex items-center gap-2">
                <Ticket className="w-5 h-5" />
                Find Tickets Now
              </span>
            </button>
            <button className="px-8 py-4 text-white font-medium rounded-full text-lg border border-white/20 hover:bg-white/5 backdrop-blur-md transition-all hover:border-white/40 flex items-center gap-2">
              <Music className="w-5 h-5" />
              View Lineup
            </button>
          </div>
        </div>
      </section>

      {/* ── TRENDING CONCERTS SECTION ── */}
      <section className="py-24 relative z-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Trending <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">Events</span>
            </h2>
            <p className="text-gray-400 text-lg">Don't miss out on the hottest shows this month.</p>
          </div>
          <button className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-bold transition-colors group">
            See All Events 
            <ArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Reusing the ConcertList component, but we will upgrade ConcertCard */}
        <ConcertList />
      </section>
      
    </div>
  );
}
