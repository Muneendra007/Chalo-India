import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
    success: (message: string) => void;
    error: (message: string) => void;
    info: (message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const showToast = useCallback((message: string, type: ToastType) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            removeToast(id);
        }, 5000); // Auto dismiss after 5 seconds
    }, [removeToast]);

    const success = (message: string) => showToast(message, 'success');
    const error = (message: string) => showToast(message, 'error');
    const info = (message: string) => showToast(message, 'info');

    return (
        <ToastContext.Provider value={{ showToast, success, error, info }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[200] flex flex-col space-y-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
              pointer-events-auto flex items-center space-x-3 px-4 py-3 rounded-lg shadow-2xl border border-white/10
              transform transition-all duration-300 animate-in slide-in-from-right-full
              ${toast.type === 'success' ? 'bg-emerald-500/90 text-white' : ''}
              ${toast.type === 'error' ? 'bg-red-500/90 text-white' : ''}
              ${toast.type === 'info' ? 'bg-slate-800/90 text-white' : ''}
              backdrop-blur-md min-w-[300px] max-w-md
            `}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 flex-shrink-0" />}

                        <p className="text-sm font-medium flex-1">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="p-1 hover:bg-white/20 rounded-full transition"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
