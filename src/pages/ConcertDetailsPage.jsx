import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEventById } from '../api/api';
import ErrorBanner from '../components/ui/ErrorBanner';

export default function ConcertDetailsPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const { data } = await fetchEventById(eventId);
        setEvent(data);
      } catch (err) {
        setError(err.message || 'Failed to load event details.');
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [eventId]);

  const [selectedSessionId, setSelectedSessionId] = useState("");
  const [activeTab, setActiveTab] = useState('details');

  // Automatically select the first session if there's only one
  useEffect(() => {
    if (event?.sessions?.length === 1 && !selectedSessionId) {
      setSelectedSessionId(event.sessions[0].id);
    }
  }, [event, selectedSessionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#07070d]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen pt-24 px-4 bg-[#07070d] flex flex-col items-center">
        <ErrorBanner message={error || "Event not found"} onDismiss={() => setError(null)} />
        <button onClick={() => navigate(-1)} className="mt-4 text-red-500 hover:underline">Go Back</button>
      </div>
    );
  }

  const sessions = event.sessions?.length > 0 ? event.sessions : [
    { 
      id: "mock-session-1", 
      displayDate: new Date(event.eventDate).toLocaleDateString('th-TH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }),
      displayTime: new Date(event.eventDate).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const handleBuyTickets = () => {
    const selectedSession = sessions.find(s => s.id === selectedSessionId);
    navigate(`/queue/${event.id}`, { state: { event, session: selectedSession } });
  };

  const eventDate = new Date(event.eventDate);
  const isPast = eventDate < new Date();

  const formatDate = (isoStr) => {
    return new Date(isoStr).toLocaleDateString('th-TH', { 
      day: 'numeric', month: 'short', year: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-white pt-24 pb-20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Hero Section */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left: Poster Image */}
          <div className="w-full lg:w-[40%] shrink-0">
            <div className="relative aspect-[3/4] w-full rounded-[2rem] overflow-hidden shadow-[0_0_40px_rgba(220,38,38,0.15)] border border-white/5">
              <img 
                src={event.imageUrl} 
                alt={event.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#07070d]/80 via-transparent to-transparent"></div>
            </div>
          </div>

          {/* Right: Details & Buying Box */}
          <div className="w-full lg:w-[60%] flex flex-col pt-4">
            
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">{event.name}</h1>
            
            {/* Genres */}
            {event.genres && (
              <div className="flex flex-wrap gap-2 mb-8">
                {event.genres.map(genre => (
                  <span key={genre} className="px-4 py-1.5 rounded-full border border-white/20 text-sm font-medium text-white/80 hover:bg-white/10 transition cursor-default">
                    {genre}
                  </span>
                ))}
              </div>
            )}

            {/* Date & Location Info */}
            <div className="space-y-4 mb-10 text-white/90">
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-semibold text-lg">{formatDate(event.eventDate)}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="text-lg">{event.sessions?.[0]?.displayTime || '18:00 - 23:00'}</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-lg">{event.venue?.name}, {event.venue?.city}</span>
                <a href="#" className="text-blue-400 hover:text-blue-300 ml-2 text-sm flex items-center gap-1 font-medium bg-blue-500/10 px-2 py-1 rounded-full">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" /></svg>
                  ดูเส้นทาง
                </a>
              </div>
            </div>

            {/* Artists */}
            {event.artists && (
              <div className="mb-8">
                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 inline-block">ศิลปิน</h3>
                <div className="flex flex-wrap gap-6">
                  {event.artists.map(artist => (
                    <div key={artist.name} className="flex flex-col items-center gap-3">
                      <div className="w-20 h-20 rounded-full border-2 border-red-500/50 p-1 hover:border-red-500 hover:scale-105 transition-all cursor-pointer">
                        <img src={artist.image} alt={artist.name} className="w-full h-full rounded-full object-cover" />
                      </div>
                      <span className="text-sm font-medium text-white/90">{artist.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Organizer */}
            {event.organizer && (
              <div className="mb-10">
                <h3 className="text-xl font-bold mb-4 border-b border-white/10 pb-2 inline-block">ผู้จัดงาน</h3>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-zinc-800 overflow-hidden border border-white/10">
                    <img src={event.organizer.image} alt={event.organizer.name} className="w-full h-full object-cover grayscale hover:grayscale-0 transition cursor-pointer" />
                  </div>
                  <span className="text-lg font-medium text-white/90">{event.organizer.name}</span>
                </div>
              </div>
            )}

            {/* Buy Tickets Floating/Sticky Bar */}
            <div className="mt-auto bg-white text-black rounded-[2rem] p-6 flex flex-col sm:flex-row items-center justify-between shadow-2xl gap-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-2 h-full bg-red-600"></div>
              
              <div className="flex-1 w-full">
                {/* Session Selector */}
                {sessions.length > 1 ? (
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-gray-500 mb-1">เลือกรอบการแสดง</label>
                    <select 
                      value={selectedSessionId}
                      onChange={(e) => setSelectedSessionId(e.target.value)}
                      className="w-full sm:w-2/3 bg-gray-100 border-none rounded-xl px-4 py-2.5 font-bold focus:ring-2 focus:ring-red-500 outline-none"
                    >
                      <option value="" disabled>เลือกรอบ...</option>
                      {sessions.map(s => <option key={s.id} value={s.id}>{s.displayDate} • {s.displayTime}</option>)}
                    </select>
                  </div>
                ) : null}

                <div className="text-sm font-bold text-gray-500">ราคาเริ่มต้น :</div>
                <div className="text-4xl font-extrabold tracking-tight">฿{event.minPrice?.toLocaleString() || '2,500'}</div>
              </div>

              <button 
                onClick={handleBuyTickets}
                disabled={isPast || !selectedSessionId}
                className={`w-full sm:w-auto shrink-0 px-10 py-4 rounded-full font-bold text-xl transition-all duration-300 ${
                  isPast || !selectedSessionId
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95'
                }`}
              >
                {isPast ? 'หมดเวลาซื้อ' : !selectedSessionId ? 'กรุณาเลือกรอบ' : 'ซื้อบัตร'}
              </button>
            </div>

          </div>
        </div>

        {/* Bottom Section: Tabs and Description */}
        <div className="mt-20 border-t border-white/10 pt-10">
          
          <div className="flex gap-8 mb-8 border-b border-white/10">
            <button 
              onClick={() => setActiveTab('details')}
              className={`pb-4 font-bold text-lg transition ${
                activeTab === 'details' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              รายละเอียดคอนเสิร์ต
            </button>
            <button 
              onClick={() => setActiveTab('how-to-buy')}
              className={`pb-4 font-bold text-lg transition ${
                activeTab === 'how-to-buy' 
                  ? 'text-red-500 border-b-2 border-red-500' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              ขั้นตอนการซื้อบัตร
            </button>
          </div>

          <div className="prose prose-invert max-w-4xl">
            {activeTab === 'details' && (
              <p className="text-lg leading-relaxed text-zinc-300 whitespace-pre-line">
                {event.fullDescription || event.description || "พบกับความสนุกสุดเหวี่ยงแบบจัดเต็มในคอนเสิร์ตที่คุณไม่ควรพลาด!"}
              </p>
            )}
            
            {activeTab === 'how-to-buy' && (
              <div className="text-zinc-300 space-y-6">
                <h3 className="text-xl font-bold text-white mb-4">วิธีการซื้อบัตรเข้าชมคอนเสิร์ต (ง่ายๆ ใน 4 ขั้นตอน)</h3>
                <div className="flex items-start gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">เลือกรอบการแสดงที่ต้องการ</h4>
                    <p className="text-zinc-400">เลือกรอบการแสดง (กรณีมีหลายรอบ) จากกล่องเลือกซื้อบัตรด้านขวาบน และตรวจสอบราคาเริ่มต้นของบัตร</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">กดปุ่ม "ซื้อบัตร" สีแดง</h4>
                    <p className="text-zinc-400">ระบบจะพาคุณเข้าสู่ระบบคิว (Queue System) เพื่อให้สิทธิ์ผู้ที่เข้ามาก่อนมีโอกาสจองที่นั่งได้ก่อน</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">เลือกที่นั่งและจ่ายเงิน</h4>
                    <p className="text-zinc-400">เมื่อถึงคิวของคุณ ให้เลือกที่นั่งที่ต้องการ (ที่นั่งสีเขียวคือว่าง สีเทาคือถูกจองแล้ว) จากนั้นกรอกข้อมูลการชำระเงินให้ครบถ้วน</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-red-600 text-white font-bold flex items-center justify-center shrink-0">4</div>
                  <div>
                    <h4 className="text-white font-bold text-lg mb-1">รับ E-Ticket เข้างานได้เลย!</h4>
                    <p className="text-zinc-400">หลังชำระเงินสำเร็จ ระบบจะออก E-Ticket ให้ทันที โดยสามารถดูได้ที่เมนู "My Tickets" นำ QR Code ไปสแกนเข้างานได้เลย</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
