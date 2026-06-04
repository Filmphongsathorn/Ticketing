import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, User, Menu, X, Ticket } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-gray-900/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/50 py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
              <Ticket className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              STAGE<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">FRONT</span>
            </span>
          </Link>

          {/* DESKTOP SEARCH */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-400 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Search artists, venues, or events..." 
              className="w-full bg-white/5 border border-white/10 text-white placeholder-gray-400 rounded-full py-2.5 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all backdrop-blur-sm"
            />
          </div>

          {/* DESKTOP NAV */}
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/events" className={`text-sm font-bold transition-colors ${location.pathname === '/events' ? 'text-white' : 'text-gray-400 hover:text-white'}`}>Events</Link>
            
            {token ? (
              <>
                <Link to="/orders" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">My Tickets</Link>
                {user?.role === 'admin' && (
                  <Link to="/admin" className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Dashboard</Link>
                )}
                
                <div className="h-6 w-px bg-white/20 mx-2"></div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-white">{user?.name || 'User'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors"
                  >
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="h-6 w-px bg-white/20 mx-2"></div>
                <Link to="/login" className="text-sm font-bold text-white hover:text-indigo-400 transition-colors">Log In</Link>
                <Link to="/login" className="px-5 py-2.5 rounded-full bg-white text-gray-900 font-bold text-sm hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.5)]">
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* MOBILE MENU TOGGLE */}
          <button 
            className="md:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE NAV (Dropdown) */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900/95 backdrop-blur-xl border-b border-white/10 shadow-2xl p-4 flex flex-col gap-4">
          <div className="relative w-full mb-2">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search events..." 
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-4 focus:outline-none"
            />
          </div>
          
          <Link to="/events" className="text-lg font-bold text-white px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Events</Link>
          
          {token ? (
            <>
              <Link to="/orders" className="text-lg font-bold text-white px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>My Tickets</Link>
              <button 
                onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                className="text-lg font-bold text-red-400 text-left px-4 py-2 hover:bg-white/5 rounded-lg"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-lg font-bold text-white px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/login" className="text-lg font-bold text-indigo-400 px-4 py-2 hover:bg-white/5 rounded-lg" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
