import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import Header from '../components/ui/Header';
import Spinner from '../components/ui/Spinner';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

// Mock data for charts
const revenueData = [
  { name: 'Mon', revenue: 4000 },
  { name: 'Tue', revenue: 3000 },
  { name: 'Wed', revenue: 2000 },
  { name: 'Thu', revenue: 2780 },
  { name: 'Fri', revenue: 1890 },
  { name: 'Sat', revenue: 2390 },
  { name: 'Sun', revenue: 3490 },
];

const ticketData = [
  { name: 'VIP', sold: 400 },
  { name: 'Zone A', sold: 300 },
  { name: 'Zone B', sold: 300 },
  { name: 'Zone C', sold: 200 },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/orders/admin/stats');
        setStats(data);
      } catch (err) {
        setError('Failed to load admin stats. You may not have permission.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />
      <div className="pt-32 px-4 max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h1 className="font-display text-4xl md:text-5xl text-white font-bold tracking-widest uppercase">
              Admin <span className="text-amber-400">Dashboard</span>
            </h1>
            <p className="text-zinc-400 mt-2">Manage your platform and track performance.</p>
          </div>
          <button 
            onClick={() => navigate('/events/new')}
            className="hidden md:flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black px-6 py-3 rounded-full font-bold uppercase tracking-wider text-sm transition-colors"
          >
            + New Event
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center">
            {error}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* Stat Card 1 */}
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[50px] rounded-full group-hover:bg-amber-500/20 transition-colors" />
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">Total Revenue</div>
              <div className="text-5xl font-display text-white font-bold">${stats?.totalRevenue?.toFixed(2) || '0.00'}</div>
              <div className="mt-4 text-xs text-emerald-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                +14.5% from last week
              </div>
            </div>

            {/* Stat Card 2 */}
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors" />
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">Tickets Sold</div>
              <div className="text-5xl font-display text-white font-bold">{stats?.totalTicketsSold || 0}</div>
              <div className="mt-4 text-xs text-emerald-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                +8.2% from last week
              </div>
            </div>

            {/* Stat Card 3 */}
            <div className="bg-zinc-900/60 backdrop-blur-md border border-zinc-800 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 blur-[50px] rounded-full group-hover:bg-purple-500/20 transition-colors" />
              <div className="text-zinc-500 text-sm font-bold uppercase tracking-widest mb-4">Total Orders</div>
              <div className="text-5xl font-display text-white font-bold">{stats?.totalOrders || 0}</div>
              <div className="mt-4 text-xs text-emerald-400 flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 10l7-7m0 0l7 7m-7-7v18" /></svg>
                +22% from last week
              </div>
            </div>
          </div>
        )}

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Revenue Trend</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#a1a1aa' }} />
                  <YAxis stroke="#52525b" tick={{ fill: '#a1a1aa' }} />
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', color: '#fff' }}
                    itemStyle={{ color: '#fbbf24' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#fbbf24" fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Tickets Sold by Zone</h2>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={ticketData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="name" stroke="#52525b" tick={{ fill: '#a1a1aa' }} />
                  <YAxis stroke="#52525b" tick={{ fill: '#a1a1aa' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '0.75rem', color: '#fff' }}
                    cursor={{ fill: '#27272a' }}
                  />
                  <Bar dataKey="sold" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/40 border border-zinc-800/80 rounded-3xl p-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button onClick={() => navigate('/admin/events')} className="p-6 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-left transition-colors">
              <div className="w-10 h-10 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Event Management</h3>
              <p className="text-xs text-zinc-500">Edit and Delete events</p>
            </button>

            <button onClick={() => navigate('/admin/seats')} className="p-6 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-left transition-colors">
              <div className="w-10 h-10 rounded-full bg-blue-400/20 text-blue-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Seat & Pricing Setup</h3>
              <p className="text-xs text-zinc-500">Map zones and prices</p>
            </button>

            <button onClick={() => navigate('/admin/orders')} className="p-6 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-left transition-colors">
              <div className="w-10 h-10 rounded-full bg-purple-400/20 text-purple-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Order Management</h3>
              <p className="text-xs text-zinc-500">Refunds & Support</p>
            </button>

            <button onClick={() => navigate('/scan')} className="p-6 rounded-2xl bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 text-left transition-colors">
              <div className="w-10 h-10 rounded-full bg-emerald-400/20 text-emerald-400 flex items-center justify-center mb-4">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              </div>
              <h3 className="font-bold text-white text-sm mb-1">Scan Tickets</h3>
              <p className="text-xs text-zinc-500">Gate entry validation</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
