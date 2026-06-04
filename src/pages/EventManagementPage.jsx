import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from '../components/ui/Header';
import Spinner from '../components/ui/Spinner';

export default function EventManagementPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/events');
      setEvents(Array.isArray(data) ? data : (data.content ?? []));
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${id}`);
      setEvents(events.filter(e => e.id !== id));
    } catch (err) {
      alert('Failed to delete event. Make sure you have admin rights.');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white font-bold tracking-widest uppercase">
              Event <span className="text-amber-400">Management</span>
            </h1>
            <button onClick={() => navigate('/admin')} className="text-sm text-zinc-500 hover:text-amber-400 mt-2">
              &larr; Back to Dashboard
            </button>
          </div>
          <button 
            onClick={() => navigate('/events/new')}
            className="bg-amber-500 hover:bg-amber-400 text-black px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(245,158,11,0.2)]"
          >
            Create New Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">{error}</div>
        ) : (
          <div className="bg-zinc-900/60 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-sm text-zinc-300">
              <thead className="bg-zinc-800/80 text-zinc-400 uppercase font-mono text-xs tracking-wider">
                <tr>
                  <th className="px-6 py-4">Event Name</th>
                  <th className="px-6 py-4">Artist</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-zinc-800/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-white">{event.name}</td>
                    <td className="px-6 py-4">{event.artist}</td>
                    <td className="px-6 py-4">{new Date(event.eventDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => alert('Edit feature coming soon.')}
                        className="text-blue-400 hover:text-blue-300 mr-4 font-medium"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(event.id)}
                        className="text-red-400 hover:text-red-300 font-medium"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {events.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-zinc-500">
                      No events found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
