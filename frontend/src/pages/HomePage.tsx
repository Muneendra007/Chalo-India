import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { TripCard } from '../components/TripCard';
import { AuthModal } from '../components/AuthModal';
import { BookingModal } from '../components/BookingModal';
import { TripDetailsModal } from '../components/TripDetailsModal';
import { Footer } from '../components/Footer';
import { MyTrips } from '../components/MyTrips';
import { Trip } from '../types';
import * as api from '../lib/api';

export function HomePage() {
    const { user } = useAuth();
    const { info } = useToast();
    const [tours, setTours] = useState<Trip[]>([]);
    const [filteredTours, setFilteredTours] = useState<Trip[]>([]);
    const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [showTripDetails, setShowTripDetails] = useState(false);
    const [showMyTrips, setShowMyTrips] = useState(false);
    const [viewAllMode, setViewAllMode] = useState(false);
    const [wishlistIds, setWishlistIds] = useState<string[]>([]);

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const response = await api.getTours();
                setTours(response.data.data.tours);
                setFilteredTours(response.data.data.tours);
            } catch (error) {
                console.error('Error fetching tours:', error);
            }
        };

        fetchTours();
        if (user) {
            setWishlistIds(user.wishlist || []);
        }
    }, [user]);

    /* Create suggestions list from tours */
    const suggestions = Array.from(new Set(
        tours.flatMap(tour => [
            tour.name,
            tour.state,
            tour.startLocation?.description || ''
        ].filter(Boolean) as string[])
    )).sort();

    const handleSearch = ({ destination, date, duration }: { destination: string; date: string; duration: string }) => {
        if (!destination && !date && !duration) {
            info('Please select at least one filter to search.');
            return;
        }

        setViewAllMode(true); // Always show results on search
        let results = tours;

        if (destination) {
            const lowerDest = destination.toLowerCase();
            results = results.filter(tour =>
                tour.name.toLowerCase().includes(lowerDest) ||
                tour.description.toLowerCase().includes(lowerDest) ||
                (tour.startLocation && tour.startLocation.description && tour.startLocation.description.toLowerCase().includes(lowerDest))
            );
        }

        if (date) {
            const searchDate = new Date(date);
            results = results.filter(tour => {
                if (!tour.startDates || tour.startDates.length === 0) return false;
                // Check if any start date is after the search date
                return tour.startDates.some(d => new Date(d) >= searchDate);
            });
        }

        if (duration) {
            results = results.filter(tour => {
                if (duration === '1-3') return tour.duration >= 1 && tour.duration <= 3;
                if (duration === '4-7') return tour.duration >= 4 && tour.duration <= 7;
                if (duration === '8+') return tour.duration >= 8;
                return true;
            });
        }

        setFilteredTours(results);
        const element = document.getElementById('trips');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleBookTrip = (trip: Trip) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        setSelectedTrip(trip);
        setShowTripDetails(false);
        setShowBookingModal(true);
    };

    const handleViewDetails = (trip: Trip) => {
        setSelectedTrip(trip);
        setShowTripDetails(true);
    };

    const handleToggleWishlist = async (trip: Trip) => {
        if (!user) {
            setShowAuthModal(true);
            return;
        }
        try {
            const tourId = trip.id || trip._id;
            const res = await api.toggleWishlist(tourId);
            setWishlistIds(res.data.data.wishlist);
        } catch (error) {
            console.error('Error toggling wishlist:', error);
        }
    };

    let displayedTours = filteredTours;

    if (!user) {
        if (!viewAllMode) {
            displayedTours = tours.slice(0, 6);
        }
    } else {
        // Logged in mode
        if (!viewAllMode) {
            displayedTours = [];
        }
    }

    return (
        <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30">
            <Header
                onAuthClick={() => setShowAuthModal(true)}
                onBookingsClick={() => setShowMyTrips(true)}
            />

            <Hero onSearch={handleSearch} suggestions={suggestions} />

            <section id="trips" className="container mx-auto px-6 py-20 min-h-[50vh]">

                {/* Header Section */}
                {user && !viewAllMode ? (
                    <div className="text-center">
                        <h2 className="text-4xl font-serif text-white mb-8">Ready for your next adventure with Chalo India?</h2>
                        <button
                            onClick={() => {
                                setViewAllMode(true);
                                setFilteredTours(tours);
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold text-lg tracking-wide shadow-2xl hover:shadow-emerald-500/20 transition transform hover:-translate-y-1"
                        >
                            Explore All India's Best Places
                        </button>
                    </div>
                ) : (
                    <div className="text-center mb-12">
                        <h2 className="text-4xl font-serif text-white mb-4">
                            {viewAllMode ? 'All Expeditions' : 'Featured Expeditions'}
                        </h2>
                        {viewAllMode && (
                            <button
                                onClick={() => {
                                    setViewAllMode(false);
                                    setFilteredTours(tours);
                                }}
                                className="text-emerald-400 hover:text-emerald-300 flex items-center justify-center space-x-2 mx-auto transition hover:-translate-x-1"
                            >
                                <span>←</span>
                                <span>Back to Featured</span>
                            </button>
                        )}
                    </div>
                )}

                {/* Trips Grid */}
                {displayedTours.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
                        {displayedTours.map((tour) => (
                            <TripCard
                                key={tour.id || tour._id}
                                trip={tour}
                                onBook={() => handleBookTrip(tour)}
                                onViewDetails={() => handleViewDetails(tour)}
                                onToggleWishlist={() => handleToggleWishlist(tour)}
                                isWishlisted={wishlistIds.includes(tour.id || tour._id)}
                            />
                        ))}
                    </div>
                )}

                {/* Empty State for Search */}
                {viewAllMode && displayedTours.length === 0 && (
                    <div className="text-center text-white/60 py-12">
                        <p className="text-xl">No trips found matching your criteria.</p>
                        <button
                            onClick={() => {
                                setFilteredTours(tours);
                            }}
                            className="mt-4 text-emerald-400 hover:text-emerald-300 underline"
                        >
                            View All Trips
                        </button>
                    </div>
                )}
            </section>

            {/* About Us Section */}
            <section className="bg-white/5 py-20 border-t border-white/10">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-emerald-400 mb-8">About Chalo India</h2>
                    <div className="max-w-3xl mx-auto text-white/80 space-y-6 leading-relaxed text-lg">
                        <p>
                            Welcome to <strong>Chalo India</strong>, your ultimate gateway to exploring the vibrant and diverse landscapes of India.
                            From the snow-capped peaks of the Himalayas to the sun-kissed beaches of Kerala, and from the majestic forts of Rajasthan
                            to the serene backwaters of the South, we bring you closer to the soul of incredible India.
                        </p>
                        <p>
                            Our mission is to create unforgettable travel experiences that are not just trips, but journeys of discovery.
                            Curated with passion and precision, our expeditions are designed to immerse you in the culture, history, and natural beauty
                            that makes India truly unique.
                        </p>
                        <p>
                            Whether you are seeking adventure, spiritual solace, or a luxury escape, Chalo India is your trusted companion.
                            Join us and let's say <em>"Chalo India!"</em> (Let's go to India!) together.
                        </p>
                    </div>
                </div>
            </section>

            <Footer />

            <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />

            {selectedTrip && (
                <BookingModal
                    isOpen={showBookingModal}
                    onClose={() => setShowBookingModal(false)}
                    trip={selectedTrip}
                />
            )}

            {selectedTrip && (
                <TripDetailsModal
                    isOpen={showTripDetails}
                    onClose={() => setShowTripDetails(false)}
                    trip={selectedTrip}
                    onBook={() => handleBookTrip(selectedTrip)}
                />
            )}

            <MyTrips isOpen={showMyTrips} onClose={() => setShowMyTrips(false)} />
        </div>
    );
}
