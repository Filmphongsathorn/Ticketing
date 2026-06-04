import Header from "../components/ui/Header";
import OrderList from "../components/OrderList/OrderList";

export default function MyOrdersPage() {
  return (
    <div className="min-h-screen bg-[#07070d]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 flex flex-col md:flex-row gap-12 relative">
        {/* Sidebar */}
        <aside className="w-full md:w-[250px] shrink-0">
          <div className="bg-zinc-900/50 backdrop-blur-md border border-zinc-800 rounded-2xl p-6 sticky top-24">
            <div className="w-16 h-16 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mb-4 border border-amber-400/30 shadow-[0_0_15px_rgba(251,191,36,0.2)]">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-1">My Profile</h2>
            <p className="text-xs text-zinc-500 mb-8">VIP Member</p>
            
            <nav className="space-y-2">
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20 transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
                My Tickets
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Purchase History
              </a>
              <a href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                Settings
              </a>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Page header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              {/* Decorative pill */}
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-amber-400 text-xs font-semibold tracking-widest uppercase">
                <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                  <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v2a2 2 0 100 4v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2a2 2 0 100-4V6z" />
                </svg>
                My Collection
              </span>
            </div>

            <h1 className="font-display text-5xl md:text-6xl tracking-wider text-white uppercase leading-tight">
              My Concert{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-300">
                Tickets
              </span>
            </h1>

            <p className="mt-3 text-zinc-500 text-base max-w-lg">
              Your complete ticket history — past shows, upcoming events, and everything in between.
            </p>

            {/* Decorative divider */}
            <div className="mt-6 flex items-center gap-4">
              <div className="h-px flex-1 max-w-[80px] bg-gradient-to-r from-amber-400/60 to-transparent" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400/40" />
            </div>
          </div>

          {/* Order list */}
          <OrderList />
        </div>
      </main>

      {/* Subtle bottom gradient */}
      <div className="fixed bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-[#07070d] to-transparent" />
    </div>
  );
}
