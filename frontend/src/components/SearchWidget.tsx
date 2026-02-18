import { useState } from 'react';
import { MapPin, Calendar, Clock, Search } from 'lucide-react';

interface SearchWidgetProps {
    onSearch: (filters: { destination: string; date: string; duration: string }) => void;
    suggestions?: string[];
}

export function SearchWidget({ onSearch, suggestions = [] }: SearchWidgetProps) {
    const [destination, setDestination] = useState('');
    const [date, setDate] = useState('');
    const [duration, setDuration] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

    const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDestination(value);

        if (value.length > 0) {
            const filtered = suggestions.filter(item =>
                item.toLowerCase().includes(value.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (value: string) => {
        setDestination(value);
        setShowSuggestions(false);
    };

    const handleSearch = () => {
        onSearch({ destination, date, duration });
        setShowSuggestions(false);
    };

    return (
        <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl p-6 shadow-2xl border border-white/20 relative z-50">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

                {/* Destination Input */}
                <div className="md:col-span-1 relative">
                    <label className="block text-xs text-white/70 uppercase tracking-wider mb-1 font-medium ml-1">Destination</label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                        <input
                            type="text"
                            placeholder="Where to go?"
                            value={destination}
                            onChange={handleDestinationChange}
                            onFocus={() => {
                                if (destination && filteredSuggestions.length > 0) setShowSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition"
                        />

                        {/* Suggestions Dropdown */}
                        {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-white/10 rounded-xl shadow-xl overflow-hidden z-50 max-h-60 overflow-y-auto">
                                {filteredSuggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-4 py-3 text-white/80 hover:bg-white/10 hover:text-white transition text-sm flex items-center space-x-2"
                                    >
                                        <MapPin className="w-3 h-3 text-emerald-500" />
                                        <span>{suggestion}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Date Input */}
                <div className="md:col-span-1 relative">
                    <label className="block text-xs text-white/70 uppercase tracking-wider mb-1 font-medium ml-1">Travel Date</label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition [color-scheme:dark]"
                        />
                    </div>
                </div>

                {/* Duration Select */}
                <div className="md:col-span-1 relative">
                    <label className="block text-xs text-white/70 uppercase tracking-wider mb-1 font-medium ml-1">Duration</label>
                    <div className="relative">
                        <Clock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-emerald-400" />
                        <select
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition cursor-pointer"
                        >
                            <option value="" className="bg-slate-900 text-white/40">Any Duration</option>
                            <option value="1-3" className="bg-slate-900 text-white">1-3 Days</option>
                            <option value="4-7" className="bg-slate-900 text-white">4-7 Days</option>
                            <option value="8+" className="bg-slate-900 text-white">8+ Days</option>
                        </select>
                    </div>
                </div>

                {/* Search Button */}
                <div className="md:col-span-1 flex items-end">
                    <button
                        onClick={handleSearch}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all active:scale-95 flex items-center justify-center space-x-2"
                    >
                        <Search className="w-5 h-5" />
                        <span>Search</span>
                    </button>
                </div>

            </div>
        </div>
    );
}
