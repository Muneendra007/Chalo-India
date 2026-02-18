import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/api/v1`
    : 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: true // send cookies
});

export const getTours = () => api.get('/tours');
export const getTour = (id: string) => api.get(`/tours/${id}`);
export const getReviews = (tourId: string) => api.get(`/tours/${tourId}/reviews`);
export const createReview = (tourId: string, data: any) => api.post(`/tours/${tourId}/reviews`, data);
export const updateSettings = (data: { name: string; email: string }) => {
    return api.patch('/users/updateMe', data);
};

export const updatePassword = (data: any) => {
    return api.patch('/users/updateMyPassword', data);
};
export const signup = (data: any) => api.post('/users/signup', data);
export const verifyOTP = (data: any) => api.post('/users/verifyOTP', data);
export const login = (data: any) => api.post('/users/login', data);
export const logout = () => api.get('/users/logout');

export const getMyBookings = () => api.get('/bookings');
export const createBooking = (data: any) => api.post('/bookings', data);
export const cancelBooking = (id: string) => api.delete(`/bookings/${id}`);
export const deleteBooking = cancelBooking; // Alias for admin usage
export const updateBooking = (id: string, data: any) => api.patch(`/bookings/${id}`, data);

export const getAllUsers = () => api.get('/users');
export const updateUser = (id: string, data: any) => api.patch(`/users/${id}`, data);
export const deleteUser = (id: string) => api.delete(`/users/${id}`);

export const createTour = (data: any) => api.post('/tours', data);
export const updateTour = (id: string, data: any) => api.patch(`/tours/${id}`, data);
export const deleteTour = (id: string) => api.delete(`/tours/${id}`);

export const getAllBookings = (userId?: string) => api.get('/bookings', { params: { user: userId } }); // For admin

export default api;
