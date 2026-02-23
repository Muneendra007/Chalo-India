import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Heart, Award, Shield, Camera, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import * as api from '../lib/api';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { AuthModal } from '../components/AuthModal';
import { MyTrips } from '../components/MyTrips';

export function ProfilePage() {
    const { user } = useAuth();
    const { success, error } = useToast();
    const [activeTab, setActiveTab] = useState<'overview' | 'info' | 'preferences' | 'security'>('overview');
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({
        tripsCount: 0,
        points: 0,
        bucketListCount: 0
    });

    // Form states
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || '',
        bio: user?.bio || '',
        dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
        preferences: user?.preferences || []
    });

    // Password states
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                address: user.address || '',
                bio: user.bio || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
                preferences: user.preferences || []
            });
            loadStats();
        }
    }, [user]);

    const loadStats = async () => {
        try {
            const res = await api.getProfileStats();
            setStats(res.data.data);
        } catch (err) {
            console.error('Failed to load stats:', err);
        }
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="text-center space-y-6 max-w-md">
                    <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto border border-emerald-500/20">
                        <User className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h1 className="text-3xl font-serif text-white">Join the Adventure</h1>
                    <p className="text-white/60">Please sign in to view and manage your travel profile, bookings, and preferences.</p>
                    <button
                        onClick={() => setIsAuthModalOpen(true)}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 transition transform hover:-translate-y-1"
                    >
                        Sign In to Continue
                    </button>
                </div>
                <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
            </div>
        );
    }

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.updateSettings(formData as any);
            // Update local user state
            // We should ideally have a way to refresh user context
            // Since AuthContext doesn't have a direct "setUser", we might need to refresh or add it.
            // For now, let's suggest a refresh or assume AuthContext handles storage sync (it does in signIn/Up)
            localStorage.setItem('user', JSON.stringify({ ...user, ...formData }));
            window.location.reload(); // Simple sync for now
            success('Profile updated successfully!');
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            error('New passwords do not match');
            return;
        }

        setPasswordLoading(true);
        try {
            const res = await api.updatePassword({
                currentPassword,
                newPassword,
                passwordConfirm: confirmPassword
            });

            localStorage.setItem('token', res.data.token);
            success('Password updated successfully!');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            error(err.response?.data?.message || 'Failed to update password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const travelPreferences = [
        'Adventure', 'Luxury', 'Budget', 'Nature', 'Culture', 'Beach', 'Mountain', 'Foodie'
    ];

    const handlePreferenceToggle = (pref: string) => {
        setFormData(prev => ({
            ...prev,
            preferences: prev.preferences.includes(pref)
                ? prev.preferences.filter(p => p !== pref)
                : [...prev.preferences, pref]
        }));
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-emerald-500/30">
            <Header
                onAuthClick={() => { }}
                onBookingsClick={() => setActiveTab('overview')}
            />

            <main className="container mx-auto px-4 pt-32 pb-20">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar */}
                    <aside className="lg:w-1/3 xl:w-1/4">
                        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden sticky top-32">
                            <div className="p-8 text-center border-b border-white/10">
                                <div className="relative inline-block group mb-6">
                                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-500/20 shadow-2xl transition group-hover:border-emerald-500/40">
                                        {user.photo === 'default.jpg' ? (
                                            <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-4xl font-bold">
                                                {user.name.charAt(0)}
                                            </div>
                                        ) : (
                                            <img src={user.photo} alt={user.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <button className="absolute bottom-0 right-0 p-2 bg-emerald-500 rounded-full shadow-lg border-4 border-slate-900 transition hover:bg-emerald-400">
                                        <Camera className="w-4 h-4 text-white" />
                                    </button>
                                </div>
                                <h2 className="text-2xl font-serif mb-1">{user.name}</h2>
                                <p className="text-white/40 text-sm mb-4 capitalize">{user.role} member</p>
                                <div className="flex justify-center space-x-2">
                                    {user.preferences?.slice(0, 3).map(p => (
                                        <span key={p} className="px-2 py-1 bg-white/5 rounded-md text-[10px] uppercase tracking-wider text-emerald-400 border border-emerald-500/10">
                                            {p}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="p-4 space-y-2">
                                {[
                                    { id: 'overview', label: 'Overview', icon: User },
                                    { id: 'info', label: 'Personal Info', icon: Shield },
                                    { id: 'preferences', label: 'Travel Preferences', icon: Heart },
                                    { id: 'security', label: 'Account Security', icon: Award },
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as any)}
                                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === tab.id ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Content Area */}
                    <div className="lg:w-2/3 xl:w-3/4 space-y-8">

                        {activeTab === 'overview' && (
                            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {[
                                        { label: 'Trips Completed', value: stats.tripsCount.toString(), icon: MapPin, color: 'text-emerald-400' },
                                        { label: 'Adventure Points', value: stats.points.toString(), icon: Award, color: 'text-amber-400' },
                                        { label: 'Bucket List', value: stats.bucketListCount.toString(), icon: Heart, color: 'text-rose-400' },
                                    ].map((stat) => (
                                        <div key={stat.label} className="bg-slate-900/50 backdrop-blur-xl border border-white/10 p-6 rounded-3xl group hover:border-white/20 transition">
                                            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-4 ${stat.color} group-hover:scale-110 transition duration-300`}>
                                                <stat.icon className="w-6 h-6" />
                                            </div>
                                            <p className="text-white/40 text-sm mb-1">{stat.label}</p>
                                            <p className="text-3xl font-serif">{stat.value}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Recent Activity / My Trips */}
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden min-h-[400px]">
                                    <MyTrips />
                                </div>
                            </div>
                        )}

                        {activeTab === 'info' && (
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <div className="flex items-center justify-between mb-8">
                                    <h3 className="text-2xl font-serif">Personal Information</h3>
                                    <button
                                        form="profile-form"
                                        type="submit"
                                        disabled={loading}
                                        className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-bold transition disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4" />
                                        <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                                    </button>
                                </div>

                                <form id="profile-form" onSubmit={handleUpdateProfile} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-3.5 w-5 h-5 text-white/20" />
                                            <input
                                                type="text"
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Email Address</label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-white/20" />
                                            <input
                                                type="email"
                                                value={formData.email}
                                                disabled
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/40 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Phone Number</label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-3.5 w-5 h-5 text-white/20" />
                                            <input
                                                type="tel"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                                placeholder="+91 98765 43210"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Date of Birth</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-3.5 w-5 h-5 text-white/20" />
                                            <input
                                                type="date"
                                                value={formData.dateOfBirth}
                                                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition [color-scheme:dark]"
                                            />
                                        </div>
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Bio</label>
                                        <textarea
                                            value={formData.bio}
                                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                            rows={4}
                                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition resize-none"
                                            placeholder="Tell us about yourself and your travel style..."
                                        />
                                    </div>

                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-sm text-white/40 ml-1">Permanent Address</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-4 top-3.5 w-5 h-5 text-white/20" />
                                            <input
                                                type="text"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                                placeholder="Street, City, State, ZIP"
                                            />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'preferences' && (
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <h3 className="text-2xl font-serif mb-2">Travel Preferences</h3>
                                <p className="text-white/40 mb-8">Tell us what you love so we can personalize your experience.</p>

                                <div className="space-y-8">
                                    <div>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">Travel Style</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {travelPreferences.map(pref => (
                                                <button
                                                    key={pref}
                                                    onClick={() => handlePreferenceToggle(pref)}
                                                    className={`px-6 py-3 rounded-2xl border transition flex items-center space-x-2 ${formData.preferences.includes(pref) ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20'}`}
                                                >
                                                    <Heart className={`w-4 h-4 ${formData.preferences.includes(pref) ? 'fill-current' : ''}`} />
                                                    <span>{pref}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/10">
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={loading}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-bold shadow-xl shadow-emerald-600/20 transition disabled:opacity-50"
                                        >
                                            {loading ? 'Updating Preferences...' : 'Save Preferences'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 animate-in fade-in slide-in-from-bottom-5 duration-500">
                                <h3 className="text-2xl font-serif mb-2">Security Settings</h3>
                                <p className="text-white/40 mb-8">Update your password and manage account security.</p>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                    {/* Password Form */}
                                    <form onSubmit={handleUpdatePassword} className="space-y-6">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-emerald-400 mb-4">Change Password</h4>

                                        <div className="space-y-2">
                                            <label className="text-xs text-white/40 ml-1">Current Password</label>
                                            <input
                                                type="password"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-white/40 ml-1">New Password</label>
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs text-white/40 ml-1">Confirm New Password</label>
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-emerald-500/50 transition"
                                                placeholder="••••••••"
                                                required
                                            />
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={passwordLoading}
                                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold transition disabled:opacity-50"
                                        >
                                            {passwordLoading ? 'Updating...' : 'Update Password'}
                                        </button>
                                    </form>

                                    {/* Security Features */}
                                    <div className="space-y-6">
                                        <h4 className="text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4">Enhanced Security</h4>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:scale-110 transition">
                                                    <Award className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Two-Factor Auth</p>
                                                    <p className="text-xs text-white/40">Highly recommended</p>
                                                </div>
                                            </div>
                                            <button className="text-emerald-400 font-medium hover:underline text-sm">Enable</button>
                                        </div>

                                        <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl border border-white/5 group hover:border-blue-500/20 transition">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition">
                                                    <Shield className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">Login Alerts</p>
                                                    <p className="text-xs text-white/40">Track account access</p>
                                                </div>
                                            </div>
                                            <button className="text-emerald-400 font-medium hover:underline text-sm">Configure</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
