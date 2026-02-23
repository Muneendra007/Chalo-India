import { useEffect, useState } from 'react';
import { X, Calendar, Users, DollarSign, MapPin, Trash2, Eye, Palmtree } from 'lucide-react';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Trip } from '../types';
import { TripDetailsModal } from './TripDetailsModal';
import { useToast } from '../contexts/ToastContext';

interface MyTripsProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function MyTrips({ isOpen, onClose }: MyTripsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    if (user && (isOpen || isOpen === undefined)) {
      loadBookings();
    }
  }, [user, isOpen]);

  const loadBookings = async () => {
    try {
      const res = await api.getMyBookings();
      setBookings(res.data.data.bookings);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) {
      return;
    }

    try {
      await api.cancelBooking(bookingId);
      setBookings(bookings.filter(b => b._id !== bookingId));
      success('Booking cancelled successfully.');
    } catch (err: any) {
      error('Failed to cancel booking: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleViewDetails = async (tourId: string) => {
    try {
      const res = await api.getTour(tourId);
      setSelectedTrip(res.data.data.tour);
      setShowDetails(true);
    } catch (err) {
      console.error('Error loading tour details:', err);
      error('Failed to load trip details.');
    }
  };

  const Content = (
    <div className={`p-4 md:p-8 ${!isOpen ? 'bg-transparent' : 'bg-slate-900 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto w-full max-w-4xl'}`}>
      {isOpen && (
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-white/40 hover:text-white transition group z-10"
        >
          <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-serif text-white mb-2 flex items-center space-x-3">
          <Palmtree className="w-8 h-8 text-emerald-500" />
          <span>My Travels</span>
        </h2>
        <p className="text-white/40">Manage your past and upcoming adventures with Chalo India.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
          <p className="text-white/40 animate-pulse">Retrieving your journey records...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white/5 rounded-3xl border border-white/5 border-dashed">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-10 h-10 text-white/10" />
          </div>
          <p className="text-xl text-white font-serif mb-2">No active bookings found</p>
          <p className="text-white/40 text-sm max-w-xs mx-auto mb-8">Ready to start your next adventure? Explore our curated destination list.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition shadow-lg shadow-emerald-600/20"
          >
            Explore Destinations
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking, index) => (
            <div
              key={booking._id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="group bg-slate-800/40 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 animate-in fade-in slide-in-from-bottom-4"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="md:w-64 h-48 md:h-auto relative overflow-hidden">
                  <img
                    src={booking.tour?.imageCover || '/placeholder-tour.jpg'}
                    alt={booking.tour?.name || 'Tour'}
                    className="w-full h-full object-cover transition duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-[10px] text-white uppercase tracking-widest font-bold border border-white/20">
                      {booking.tour?.difficulty || 'Adventure'}
                    </span>
                  </div>
                </div>

                {/* Info Section */}
                <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-2xl font-serif text-white group-hover:text-emerald-400 transition mb-1 line-clamp-1">{booking.tour?.name || 'Unnamed Journey'}</h3>
                        <div className="flex items-center text-white/40 text-sm">
                          <MapPin className="w-3.5 h-3.5 mr-1" />
                          <span>{booking.tour?.state || 'Various'}, India</span>
                        </div>
                      </div>
                      <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold border ${booking.status === 'confirmed'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${booking.status === 'confirmed' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                        <span>{booking.status.toUpperCase()}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Launch Date</p>
                        <div className="flex items-center text-sm text-white/80">
                          <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                          <span>{booking.tour?.startDates?.[0] ? new Date(booking.tour.startDates[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Flexible'}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Party Size</p>
                        <div className="flex items-center text-sm text-white/80">
                          <Users className="w-4 h-4 mr-2 text-emerald-500" />
                          <span>{booking.seats} Explorers</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Investment</p>
                        <div className="flex items-center text-sm font-bold text-white">
                          <DollarSign className="w-4 h-4 mr-1 text-emerald-500" />
                          <span>₹{booking.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Voucher ID</p>
                        <code className="text-[11px] text-white/50 bg-white/5 px-2 py-0.5 rounded uppercase tracking-tighter">#{booking._id.slice(-6)}</code>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-white/5">
                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="text-white/30 hover:text-red-400 transition-colors text-sm font-medium flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-red-500/5 group/cancel"
                    >
                      <Trash2 className="w-4 h-4 group-hover/cancel:scale-110 transition" />
                      <span>Release Booking</span>
                    </button>
                    <button
                      onClick={() => handleViewDetails(booking.tour?._id || booking.tour?.id || '')}
                      className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl transition flex items-center space-x-2 border border-white/10 group/view"
                    >
                      <Eye className="w-4 h-4 text-emerald-500 group-hover/view:scale-110 transition" />
                      <span className="font-semibold text-sm">Trip Dossier</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <TripDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        trip={selectedTrip}
        onBook={() => {
          setShowDetails(false);
          if (onClose) onClose();
        }}
      />
    </div>
  );

  if (isOpen) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        {Content}
      </div>
    );
  }

  return Content;
}
