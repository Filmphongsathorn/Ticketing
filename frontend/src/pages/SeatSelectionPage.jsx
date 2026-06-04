import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation, Link } from 'react-router-dom';
import api from '../api/api';
import { useAuth } from '../hooks/useAuth';
import Spinner from '../components/ui/Spinner';
import ErrorBanner from '../components/ui/ErrorBanner';

const ROWS = ['A', 'B', 'C', 'D', 'E'];
const SEATS_PER_ROW = 8;

export default function SeatSelectionPage() {
  const { eventId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  const [event, setEvent] = useState(state?.event || null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toastAlert, setToastAlert] = useState(null);

  // Mock WebSocket Event Simulation (Randomly lock seats every 8 seconds)
  useEffect(() => {
    if (loading || availableSeats.length === 0) return;
    
    const wsInterval = setInterval(() => {
      // 30% chance to randomly lock a seat to simulate high contention
      if (Math.random() < 0.3) {
        setAvailableSeats(prev => {
          if (prev.length === 0) return prev;
          const randomIndex = Math.floor(Math.random() * prev.length);
          const stolenSeat = prev[randomIndex];
          
          // Show a tiny notification that someone just booked this
          console.log(`[WebSocket] Seat ${stolenSeat} was just booked by someone else!`);
          
          return prev.filter(s => s !== stolenSeat);
        });
      }
    }, 8000);

    return () => clearInterval(wsInterval);
  }, [loading, availableSeats]);

  const showToast = (message) => {
    setToastAlert(message);
    setTimeout(() => setToastAlert(null), 5000);
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true, state: { from: `/seats/${eventId}` } });
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event if not passed via state
        let currentEvent = event;
        if (!currentEvent) {
          const { data } = await api.get(`/events/${eventId}`);
          currentEvent = data;
          setEvent(data);
        }
        
        // Fetch seats for the event
        const { data: seatsData } = await api.get(`/inventory/concerts/${eventId}/seats/available`);
        setAvailableSeats(seatsData.map(s => s.seatNumber));
        
        // Auto-seed seats if there are none (for demo purposes)
        if (seatsData.length === 0) {
          await seedDemoSeats(eventId);
          const { data: newSeatsData } = await api.get(`/inventory/concerts/${eventId}/seats/available`);
          setAvailableSeats(newSeatsData.map(s => s.seatNumber));
        }

      } catch (err) {
        setError("Could not load seat map. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [eventId, isAuthenticated, navigate]);

  const seedDemoSeats = async (concertId) => {
    // Generate a few random seats for the demo
    const seatsToSeed = ['A1', 'A2', 'A3', 'A4', 'B1', 'B2', 'C5', 'C6', 'D1', 'D2', 'D8', 'E4', 'E5'];
    try {
      await Promise.all(seatsToSeed.map(seat => 
        api.post('/inventory/seats', { concertId, seatNumber: seat })
      ));
    } catch (e) {
      console.error("Failed to seed seats", e);
    }
  };

  const toggleSeat = async (seatId) => {
    if (!availableSeats.includes(seatId) && !selectedSeats.includes(seatId)) return; // Taken

    const isSelecting = !selectedSeats.includes(seatId);

    if (isSelecting) {
      // OPTIMISTIC UI: Turn blue immediately
      setSelectedSeats(prev => [...prev, seatId]);
      
      try {
        // API Call: Request Lock (Simulated)
        // Simulate a 500ms network delay
        await new Promise(r => setTimeout(r, 500));
        
        // Simulate a 10% chance of Race Condition Conflict (Someone else clicked it exactly when we did)
        if (Math.random() < 0.1) {
          throw new Error("409_CONFLICT");
        }
        
        // Success: It remains blue. In a real app, we'd persist the lock token.
      } catch (err) {
        // REVERT OPTIMISTIC UI
        setSelectedSeats(prev => prev.filter(s => s !== seatId));
        
        // Update local available seats state to remove it (it's taken)
        setAvailableSeats(prev => prev.filter(s => s !== seatId));
        
        // Show Alert
        showToast(`ที่นั่ง ${seatId} ถูกจองโดยผู้อื่นแล้ว โปรดเลือกที่นั่งใหม่!`);
      }
    } else {
      // Deselecting (Unlocking)
      setSelectedSeats(prev => prev.filter(s => s !== seatId));
      // In a real app, fire unlock API here
    }
  };

  const handleContinue = () => {
    if (selectedSeats.length === 0) return;
    // We map seats to object structure expected by Checkout
    const seatObjects = selectedSeats.map(s => ({
      id: s,
      section: s.charAt(0),
      row: s.charAt(0),
      seatNumber: s
    }));
    navigate(`/checkout/${eventId}`, { state: { event, selectedSeats: seatObjects } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#07070d] flex items-center justify-center">
        <Spinner size="lg" label="Loading seat map..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center p-4">
        <ErrorBanner message={error} />
        <Link to="/events" className="mt-6 text-amber-400 hover:underline">← Back to events</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07070d] flex flex-col items-center py-24 px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-amber-500/5 rounded-full blur-[100px]" />
      </div>

      {/* Real-time Toast Alert */}
      {toastAlert && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-[slideDown_0.3s_ease-out]">
          <div className="bg-red-500/90 backdrop-blur-md border border-red-400 text-white px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(239,68,68,0.4)] flex items-center gap-3">
            <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-bold tracking-wide text-lg">{toastAlert}</span>
          </div>
        </div>
      )}

      <div className="w-full max-w-4xl relative z-10">
        <button onClick={() => navigate(-1)} className="mb-8 flex items-center gap-2 text-sm text-zinc-500 hover:text-amber-400 transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"/>
          </svg>
          Back
        </button>

        <div className="text-center mb-12">
          <h1 className="font-display text-3xl font-bold text-white uppercase tracking-widest">
            Select Your <span className="text-amber-400">Seats</span>
          </h1>
          <p className="text-zinc-400 mt-2">{event?.name} • {event?.artist}</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 max-w-7xl mx-auto w-full">
          {/* Seat Map (75%) */}
          <div className="lg:col-span-3 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-8 flex flex-col items-center shadow-2xl">
            {/* Stage */}
            <div className="w-full max-w-md h-12 bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-t-3xl border-t-2 border-amber-500/50 flex items-center justify-center mb-12 shadow-[0_-10px_30px_rgba(251,191,36,0.1)]">
              <span className="text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">Stage</span>
            </div>

            {/* Grid */}
            <div className="flex flex-col gap-4">
              {ROWS.map(row => (
                <div key={row} className="flex items-center gap-3">
                  <div className="w-6 text-center text-xs font-mono text-zinc-600">{row}</div>
                  <div className="flex gap-2">
                    {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                      const seatId = `${row}${i + 1}`;
                      const isAvailable = availableSeats.includes(seatId);
                      const isSelected = selectedSeats.includes(seatId);
                      
                      return (
                        <button
                          key={seatId}
                          disabled={!isAvailable}
                          onClick={() => toggleSeat(seatId)}
                          className={`
                            w-10 h-10 rounded-t-lg rounded-b-sm flex items-center justify-center text-xs font-mono transition-all duration-200
                            ${isSelected 
                                ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.6)] scale-110' 
                                : isAvailable
                                  ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white cursor-pointer hover:shadow-lg'
                                  : 'bg-zinc-900/50 text-zinc-800 cursor-not-allowed border border-zinc-800/50'
                            }
                          `}
                        >
                          {i + 1}
                        </button>
                      );
                    })}
                  </div>
                  <div className="w-6 text-center text-xs font-mono text-zinc-600">{row}</div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6 mt-12 pt-6 border-t border-zinc-800/50 w-full justify-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-800 rounded-t-sm" />
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-600 rounded-t-sm shadow-[0_0_10px_rgba(37,99,235,0.4)]" />
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Selected</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-zinc-900/50 border border-zinc-800/50 rounded-t-sm" />
                <span className="text-xs text-zinc-500 uppercase tracking-widest">Taken</span>
              </div>
            </div>
          </div>

          {/* Sidebar / Summary (25%) */}
          <div className="lg:col-span-1 bg-zinc-900/50 backdrop-blur-md border border-zinc-800/80 rounded-2xl p-6 h-fit sticky top-24">
            <h3 className="text-xs font-mono uppercase tracking-widest text-blue-400 mb-6">Selection Summary</h3>
            
            {selectedSeats.length > 0 ? (
              <div className="space-y-4">
                <div className="flex justify-between items-end pb-4 border-b border-zinc-800">
                  <div>
                    <p className="text-2xl font-display text-white">{selectedSeats.length}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Seats Selected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-mono text-blue-400">${(event?.minPrice || 100) * selectedSeats.length}</p>
                    <p className="text-xs text-zinc-500 uppercase tracking-wider">Subtotal</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {selectedSeats.map(s => (
                    <span key={s} className="px-3 py-1 bg-zinc-800 text-zinc-300 text-xs font-mono rounded-md border border-zinc-700">
                      {s}
                    </span>
                  ))}
                </div>

                <button
                  onClick={handleContinue}
                  className="w-full mt-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase text-white bg-blue-600 hover:bg-blue-500 transition-all duration-200 shadow-[0_4px_20px_rgba(37,99,235,0.3)] hover:-translate-y-1"
                >
                  Proceed to Checkout
                </button>
              </div>
            ) : (
              <div className="py-12 flex flex-col items-center text-center opacity-50">
                <svg className="w-12 h-12 text-zinc-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
                <p className="text-sm text-zinc-400">Select seats on the map<br/>to proceed.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
