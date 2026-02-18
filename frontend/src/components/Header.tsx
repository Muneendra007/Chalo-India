import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, User, LogOut, ChevronDown,
  Palmtree, Settings,
  Menu, X as XIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { SettingsModal } from './SettingsModal';

interface HeaderProps {
  onAuthClick: () => void;
  onBookingsClick: () => void;
  onExploreClick: () => void;
  onAdminClick?: () => void;
}

export function Header({ onAuthClick, onBookingsClick, onExploreClick, onAdminClick }: HeaderProps) {


  // ... inside Header component
  const { user, signOut } = useAuth();
  const { info } = useToast();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Destinations', icon: MapPin },
    { label: 'Tours', icon: Palmtree },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-slate-950/90 backdrop-blur-md shadow-lg border-b border-white/5' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>

      {/* Top Bar - Hidden on mobile, visible on scroll top */}
      <div className={`hidden lg:block border-b border-white/10 transition-all duration-300 ${isScrolled ? 'h-0 opacity-0 overflow-hidden' : 'h-10 opacity-100'}`}>
        <div className="container mx-auto px-6 h-full flex items-center justify-end space-x-6 text-xs font-medium text-white/70">
          <button onClick={() => info('Compelling offers coming soon!')} className="hover:text-emerald-400 transition">Offers</button>
          <button onClick={() => info('Customer support lines are currently busy. Please try again later.')} className="hover:text-emerald-400 transition">Customer Support</button>
          <button onClick={() => info('Corporate travel portal is under maintenance.')} className="hover:text-emerald-400 transition">Corporate Travel</button>
          <div className="flex items-center space-x-1 cursor-pointer hover:text-white">
            <span>English</span>
            <ChevronDown className="w-3 h-3" />
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <nav className={`container mx-auto px-6 transition-all duration-300 ${isScrolled ? 'py-3' : 'py-4'}`}>
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
            <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <MapPin className="w-6 h-6 text-white transform -rotate-12" />
            </div>
            <div>
              <h1 className="text-xl font-serif text-white tracking-wide leading-none">Chalo India</h1>
              <p className="text-[10px] text-white/50 tracking-[0.2em] uppercase">Premium Travel</p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center space-x-1 bg-white/5 rounded-full p-1 border border-white/5 backdrop-blur-sm">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={onExploreClick}
                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition group"
              >
                <item.icon className="w-4 h-4 text-emerald-400/70 group-hover:text-emerald-400 transition" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </div>

          {/* Right Section (Auth / Mobile Toggle) */}
          <div className="flex items-center space-x-4">

            {/* Desktop Auth */}
            <div className="hidden md:flex items-center">
              {user ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-white/90 hover:text-white transition py-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-xs font-bold shadow-md border border-white/10">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3 h-3 text-white/50 group-hover:text-white transition" />
                  </button>

                  {/* Dropdown */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-slate-900 border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
                    <div className="p-2 space-y-1">
                      {(user.role === 'admin' || user.role === 'lead-guide') && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
                        >
                          <Settings className="w-4 h-4" />
                          <span>Admin Portal</span>
                        </Link>
                      )}

                      <button
                        onClick={onBookingsClick}
                        className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        <Palmtree className="w-4 h-4" />
                        <span>My Trips</span>
                      </button>
                      <button
                        onClick={() => setShowSettings(true)}
                        className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        <Settings className="w-4 h-4" />
                        <span>My Profile</span>
                      </button>
                      <button
                        onClick={() => signOut()}
                        className="flex items-center space-x-3 w-full px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={onAuthClick}
                  className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full transition border border-white/10 backdrop-blur-sm shadow-lg"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-semibold tracking-wide">Login / Sign Up</span>
                </button>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="lg:hidden text-white/80 hover:text-white transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <XIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-900 border-t border-white/10 absolute left-0 right-0 p-6 shadow-2xl animate-in slide-in-from-top-5">
          <div className="grid grid-cols-2 gap-4 mb-6">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  onExploreClick();
                  setMobileMenuOpen(false);
                }}
                className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-xl border border-white/5 active:scale-95 transition"
              >
                <item.icon className="w-6 h-6 text-emerald-400 mb-2" />
                <span className="text-sm text-white">{item.label}</span>
              </button>
            ))}
          </div>

          <div className="border-t border-white/10 pt-6">
            {user ? (
              <div className="space-y-3">
                <div className="flex items-center space-x-3 mb-4 px-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-white font-medium">{user.name}</p>
                    <p className="text-white/50 text-xs">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onBookingsClick();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg text-white"
                >
                  <Palmtree className="w-5 h-5 text-emerald-400" />
                  <span>My Trips</span>
                </button>
                <button
                  onClick={() => {
                    setShowSettings(true);
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-white/5 rounded-lg text-white"
                >
                  <Settings className="w-5 h-5 text-emerald-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    signOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-3 px-4 py-3 bg-red-500/10 text-red-400 rounded-lg"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onAuthClick();
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-emerald-600 text-white py-3 rounded-xl font-semibold shadow-lg shadow-emerald-600/20"
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </header>
  );
}
