import { Ticket } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand & Mission */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6 group cursor-pointer">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
                <Ticket className="w-5 h-5 text-white" />
              </div>
              <span className="font-black text-2xl tracking-tight text-white">
                STAGE<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">FRONT</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              The ultimate enterprise ticketing platform. Secure, lightning-fast, and designed for the most breathtaking live music experiences globally.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692h1.971v3z"/></svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 hover:border-indigo-500/50 transition-all group">
                <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
            </div>
          </div>

          {/* Links: Explore */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase mb-6 text-sm">Explore</h3>
            <ul className="space-y-4">
              <li><a href="/events" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">All Concerts</a></li>
              <li><a href="/events" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Music Festivals</a></li>
              <li><a href="/events" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Trending Now</a></li>
              <li><a href="/events" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Upcoming Tours</a></li>
            </ul>
          </div>

          {/* Links: Support */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase mb-6 text-sm">Support</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Help Center</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Ticket Protection</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Refund Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Contact Us</a></li>
            </ul>
          </div>

          {/* Links: Legal */}
          <div>
            <h3 className="text-white font-bold tracking-wider uppercase mb-6 text-sm">Legal</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="text-gray-400 hover:text-indigo-400 text-sm font-medium transition-colors">Accessibility</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} StageFront Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-gray-600 text-sm font-mono tracking-widest uppercase">Powered by Magic</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
