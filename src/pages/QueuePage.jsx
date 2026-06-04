import { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/ui/Header';

export default function QueuePage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [progress, setProgress] = useState(0);
  const [queueNumber, setQueueNumber] = useState(Math.floor(Math.random() * 50000) + 10000);
  
  useEffect(() => {
    // Simulate moving up in the queue
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + (Math.random() * 5 + 2);
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            navigate(`/seats/${eventId}`, { state });
          }, 500);
          return 100;
        }
        return next;
      });
      
      setQueueNumber(prev => Math.max(1, prev - Math.floor(Math.random() * 1500 + 500)));
    }, 1000);
    
    return () => clearInterval(interval);
  }, [eventId, navigate, state]);

  return (
    <div className="min-h-screen bg-[#07070d] flex flex-col items-center justify-center p-4">
      <Header />
      
      <div className="max-w-md w-full bg-zinc-900/50 backdrop-blur-md border border-amber-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(245,158,11,0.1)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
          <div 
            className="h-full bg-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.8)] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        
        <div className="w-20 h-20 mx-auto bg-amber-400/10 border-2 border-amber-400 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <svg className="w-10 h-10 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-display font-bold text-white mb-2 uppercase tracking-wider">
          You are in line
        </h1>
        <p className="text-zinc-400 text-sm mb-8">
          Due to high demand, you have been placed in a virtual waiting room. Please do not refresh this page.
        </p>
        
        <div className="bg-black/50 rounded-2xl p-6 border border-zinc-800">
          <p className="text-xs text-zinc-500 uppercase tracking-widest mb-2">People ahead of you</p>
          <p className="text-5xl font-mono font-bold text-amber-400">
            {queueNumber.toLocaleString()}
          </p>
        </div>
        
        <p className="text-xs text-zinc-600 mt-6">
          Expected wait time: {Math.max(1, Math.ceil((100 - progress) / 10))} minutes
        </p>
      </div>
    </div>
  );
}
