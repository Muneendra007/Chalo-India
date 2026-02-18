import { useEffect, useState } from 'react';
import { X, Calendar, Users, DollarSign, MapPin, Trash2, Eye } from 'lucide-react';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Booking, Trip } from '../types';
import { TripDetailsModal } from './TripDetailsModal';
import { useToast } from '../contexts/ToastContext';

interface MyTripsProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MyTrips({ isOpen, onClose }: MyTripsProps) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const { user } = useAuth();
  const { success, error } = useToast();

  useEffect(() => {
    if (isOpen && user) {
      loadBookings();
    }
  }, [isOpen, user]);

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
      // ...
      const res = await api.getTour(tourId);
      setSelectedTrip(res.data.data.tour);
      setShowDetails(true);
    } catch (err) {
      console.error('Error loading tour details:', err);
      error('Failed to load trip details.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-4xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <h2 className="text-3xl font-serif text-white mb-2">My Trips</h2>
          <p className="text-white/60 mb-6">View and manage your bookings</p>

          {loading ? (
            <div className="text-center py-12 text-white/60">Loading...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-12">
              <MapPin className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <p className="text-white/60">No bookings yet</p>
              <p className="text-white/40 text-sm mt-2">Start exploring and book your first trip!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <div
                  key={booking._id}
                  className="bg-white/5 border border-white/10 rounded-lg overflow-hidden hover:border-white/20 transition"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-48 h-32 md:h-auto">
                      <img
                        src={booking.tour.imageCover}
                        alt={booking.tour.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-serif text-white mb-1">{booking.tour.name}</h3>
                          <p className="text-white/60 text-sm">
                            {booking.tour.state}, India
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${booking.status === 'confirmed'
                            ? 'bg-green-500/20 text-green-300'
                            : 'bg-yellow-500/20 text-yellow-300'
                            }`}
                        >
                          {booking.status.toUpperCase()}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/40 text-xs">Date</p>
                            <p className="text-white/80">
                              {new Date(booking.tour.startDates[0]).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <Users className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/40 text-xs">Seats</p>
                            <p className="text-white/80">{booking.seats}</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-sm">
                          <DollarSign className="w-4 h-4 text-white/40" />
                          <div>
                            <p className="text-white/40 text-xs">Total</p>
                            <p className="text-white/80">₹{booking.price}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-end pl-6 border-l border-white/10 ml-6">
                    <button
                      onClick={() => handleViewDetails(booking.tour._id || booking.tour.id || '')}
                      className="flex items-center space-x-2 text-white/80 hover:text-white transition text-sm mb-4"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={() => handleCancel(booking._id)}
                      className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Cancel Booking</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <TripDetailsModal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        trip={selectedTrip}
        onBook={() => {
          setShowDetails(false);
          onClose();
        }}
      />
    </div>
  );
}
