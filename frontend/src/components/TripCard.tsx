import { Calendar, Users, DollarSign } from 'lucide-react';
import { Trip } from '../types';

interface TripCardProps {
  trip: Trip;
  onBook: (trip: Trip) => void;
  onViewDetails: (trip: Trip) => void;
}

export function TripCard({ trip, onBook, onViewDetails }: TripCardProps) {
  // Use first start date for display
  const nextDate = trip.startDates && trip.startDates.length > 0 ? trip.startDates[0] : new Date().toISOString();

  const formattedDate = new Date(nextDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-all duration-300">
      <div className="aspect-[4/3] overflow-hidden bg-slate-800">
        <img
          src={trip.imageCover}
          alt={trip.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'; // Fallback image
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
        <h3 className="text-2xl font-serif mb-2">{trip.name}</h3>
        <p className="text-sm text-white/90 mb-1">{trip.state}</p>
        <p className="text-xs text-white/70 uppercase tracking-wider mb-4">India</p>

        <p className="text-sm text-white/80 mb-4 line-clamp-2">{trip.summary}</p>

        <div className="flex items-center justify-between mb-4 text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="w-4 h-4" />
            <span>{trip.maxGroupSize} people</span>
          </div>
          <div className="flex items-center space-x-1">
            <DollarSign className="w-4 h-4" />
            <span>₹{trip.price}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onBook(trip)}
            className="flex-1 bg-white text-slate-900 py-3 rounded hover:bg-slate-200 transition text-sm font-semibold tracking-wide"
          >
            BOOK NOW
          </button>
          <button
            onClick={() => onViewDetails(trip)}
            className="flex-1 bg-white/10 backdrop-blur-sm border border-white/30 text-white py-3 rounded hover:bg-white/20 transition text-sm font-semibold tracking-wide"
          >
            DETAILS
          </button>
        </div>
      </div>
    </div>
  );
}
