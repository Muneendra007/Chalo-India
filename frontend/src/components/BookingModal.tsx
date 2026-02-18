import { useState } from 'react';
import { X, Calendar, Users, DollarSign } from 'lucide-react';
import { Trip } from '../types';
import * as api from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip | null;
}

export function BookingModal({ isOpen, onClose, trip }: BookingModalProps) {
  const [seats, setSeats] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { success, error, info } = useToast();

  // Initialize selectedDate when trip changes
  if (trip && !selectedDate && trip.startDates && trip.startDates.length > 0) {
    setSelectedDate(trip.startDates[0]);
  }

  if (!isOpen || !trip) return null;

  const totalPrice = trip.price * seats;

  const handleBooking = async () => {
    if (!user) {
      info('Please sign in to book a trip');
      return;
    }

    setLoading(true);
    try {
      await api.createBooking({
        tour: trip._id || trip.id,
        seats: seats,
        price: totalPrice,
        selectedDate: selectedDate
      });

      success('Booking confirmed! Check "My Trips" to view your bookings.');
      onClose();
    } catch (err: any) {
      error('Booking failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-900 rounded-lg shadow-2xl max-w-2xl w-full mx-4 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white/60 hover:text-white transition z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="aspect-[16/9] overflow-hidden rounded-t-lg">
          <img src={trip.imageCover} alt={trip.name} className="w-full h-full object-cover" />
        </div>

        <div className="p-8">
          <h2 className="text-3xl font-serif text-white mb-2">{trip.name}</h2>
          <p className="text-white/60 mb-6">
            {trip.state}, India
          </p>

          <p className="text-white/80 mb-6">{trip.summary}</p>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-white/5 border border-white/10 rounded p-4">
              <Calendar className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-xs text-white/50">Departure</p>
              <select
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-transparent text-white font-medium focus:outline-none w-full cursor-pointer"
              >
                {trip.startDates?.map((date) => (
                  <option key={date} value={date} className="bg-slate-900 text-white">
                    {new Date(date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-4">
              <Users className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-xs text-white/50">Max Group</p>
              <p className="text-white font-medium">{trip.maxGroupSize} people</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded p-4">
              <DollarSign className="w-5 h-5 text-white/60 mb-2" />
              <p className="text-xs text-white/50">Price</p>
              <p className="text-white font-medium">₹{trip.price}/person</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded p-6 mb-6">
            <label className="block text-white/80 text-sm mb-3">Number of Seats</label>
            <input
              type="number"
              min="1"
              max={trip.maxGroupSize}
              value={seats}
              onChange={(e) => setSeats(Math.min(trip.maxGroupSize, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded text-white focus:outline-none focus:border-white/40 transition"
            />

            <div className="mt-4 flex items-center justify-between text-lg">
              <span className="text-white/60">Total Price:</span>
              <span className="text-white font-bold text-2xl">₹{totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={loading}
            className="w-full bg-white text-slate-900 py-4 rounded font-medium hover:bg-white/90 transition disabled:opacity-50 text-lg"
          >
            {loading ? 'Processing...' : 'Confirm Booking'}
          </button>
        </div>
      </div>
    </div>
  );
}
