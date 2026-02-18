import { useState } from 'react';
import { X, User, Lock, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import * as api from '../lib/api';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const { user } = useAuth(); // login is used to update user state
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

    // Profile State
    const [name, setName] = useState(user?.name || '');
    const [email] = useState(user?.email || '');
    const [profileLoading, setProfileLoading] = useState(false);
    const [profileMessage, setProfileMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Password State
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    if (!isOpen) return null;

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setProfileLoading(true);
        setProfileMessage(null);

        try {
            // Pass current email to satisfy API requirement, even if backend ignores it or it's same
            const res = await api.updateSettings({ name, email });
            // Update local user context if possible, or just show success
            // Ideally AuthContext should expose a generic update function, but we can hack it by re-calling login or just force reload.
            // For now, let's assume the user object in context needs to be refreshed.
            // Since we don't have a direct 'updateUser' method in context, we might rely on the fact that 'login' sets the user.
            // But 'login' expects a token structure usually. 
            // Let's just show success message. The user might need to re-login to see changes if Context doesn't auto-fetch.
            // actually, if we want to update the UI immediately, we should probably update the stored user in localStorage and reload window, or add updateUser to context.
            // For simplicity, let's alert and maybe reload.

            const updatedUser = res.data.data.user;
            localStorage.setItem('user', JSON.stringify(updatedUser));
            // Force reload to update context (quick fix without refactoring Context)
            window.location.reload();

            setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
        } catch (err: any) {
            setProfileMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update profile' });
        } finally {
            setProfileLoading(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordLoading(true);
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match' });
            setPasswordLoading(false);
            return;
        }

        try {
            const res = await api.updatePassword({
                currentPassword,
                newPassword,
                passwordConfirm: confirmPassword
            });

            // Update token
            const token = res.data.token;
            localStorage.setItem('token', token);

            setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (err: any) {
            setPasswordMessage({ type: 'error', text: err.response?.data?.message || 'Failed to update password' });
        } finally {
            setPasswordLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 overflow-hidden border border-white/10 flex flex-col md:flex-row min-h-[500px]">

                {/* Sidebar */}
                <div className="w-full md:w-1/3 bg-black/20 p-6 border-b md:border-b-0 md:border-r border-white/10">
                    <h2 className="text-2xl font-serif text-white mb-8">My Profile</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'profile' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                            <User className="w-5 h-5" />
                            <span className="font-medium">Profile</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('security')}
                            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition ${activeTab === 'security' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                        >
                            <Lock className="w-5 h-5" />
                            <span className="font-medium">Security</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-8 relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/40 hover:text-white transition"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {activeTab === 'profile' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-medium text-white mb-6">Profile Settings</h3>

                            {profileMessage && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center ${profileMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {profileMessage.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                                    <span>{profileMessage.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdateProfile} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        disabled
                                        className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-white/60 cursor-not-allowed"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={profileLoading}
                                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {profileLoading ? (
                                            <span>Saving...</span>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Save Changes</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-xl font-medium text-white mb-6">Password Security</h3>

                            {passwordMessage && (
                                <div className={`mb-6 p-4 rounded-xl flex items-center ${passwordMessage.type === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                    {passwordMessage.type === 'success' ? <CheckCircle className="w-5 h-5 mr-3" /> : <AlertCircle className="w-5 h-5 mr-3" />}
                                    <span>{passwordMessage.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleUpdatePassword} className="space-y-6">
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Current Password</label>
                                    <input
                                        type="password"
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">New Password</label>
                                    <input
                                        type="password"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-white/60 mb-2">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-emerald-500/50 transition"
                                    />
                                </div>
                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={passwordLoading}
                                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold hover:bg-emerald-400 transition flex items-center space-x-2 disabled:opacity-50"
                                    >
                                        {passwordLoading ? (
                                            <span>Updating...</span>
                                        ) : (
                                            <>
                                                <Save className="w-4 h-4" />
                                                <span>Update Password</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
