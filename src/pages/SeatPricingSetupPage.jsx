import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/ui/Header';

export default function SeatPricingSetupPage() {
  const navigate = useNavigate();
  const [zones, setZones] = useState([
    { id: 1, name: 'VIP', price: 5000, capacity: 100, color: 'bg-purple-500' },
    { id: 2, name: 'Zone A', price: 3500, capacity: 300, color: 'bg-blue-500' },
    { id: 3, name: 'Zone B', price: 2500, capacity: 500, color: 'bg-emerald-500' },
  ]);

  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />
      <div className="pt-32 px-4 max-w-6xl mx-auto pb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl md:text-4xl text-white font-bold tracking-widest uppercase">
              Seat & Pricing <span className="text-blue-400">Setup</span>
            </h1>
            <button onClick={() => navigate('/admin')} className="text-sm text-zinc-500 hover:text-blue-400 mt-2">
              &larr; Back to Dashboard
            </button>
          </div>
          <button className="bg-blue-500 hover:bg-blue-400 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            Save Configuration
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8">
            <h2 className="text-xl font-bold text-white mb-6">Venue Map Simulator</h2>
            <div className="aspect-video bg-zinc-800 rounded-2xl border border-zinc-700 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-64 h-16 bg-zinc-700 rounded-t-3xl flex items-center justify-center text-zinc-400 font-bold mb-8">
                STAGE
              </div>
              
              <div className="flex flex-col gap-4 w-full px-12">
                {zones.map((zone) => (
                  <div key={zone.id} className={`w-full py-6 rounded-xl flex items-center justify-center font-bold text-white border-2 border-transparent hover:border-white/20 cursor-pointer transition-all ${zone.color} bg-opacity-20`}>
                    {zone.name} - ฿{zone.price}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 rounded-3xl p-8 h-fit">
            <h2 className="text-xl font-bold text-white mb-6">Zone Configuration</h2>
            <div className="space-y-4">
              {zones.map((zone) => (
                <div key={zone.id} className="p-4 bg-zinc-800/50 rounded-xl border border-zinc-700/50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${zone.color}`} />
                      <span className="font-bold text-white">{zone.name}</span>
                    </div>
                    <button className="text-red-400 hover:text-red-300 text-sm">Remove</button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Price (THB)</label>
                      <input type="number" defaultValue={zone.price} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-500 block mb-1">Capacity</label>
                      <input type="number" defaultValue={zone.capacity} className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-white text-sm" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-6 py-3 rounded-xl border border-dashed border-zinc-600 text-zinc-400 hover:border-blue-500 hover:text-blue-400 transition-colors font-medium text-sm">
              + Add New Zone
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
