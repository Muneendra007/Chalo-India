import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import { HomePage } from './pages/HomePage';
import { AdminRoute } from './components/AdminRoute';
import { AdminLayout } from './components/AdminLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminTours } from './pages/admin/AdminTours';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminBookings } from './pages/admin/AdminBookings';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />

          {/* Admin Routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="tours" element={<AdminTours />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="bookings" element={<AdminBookings />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;
