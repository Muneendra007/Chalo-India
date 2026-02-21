# Chalo India - Travel Booking Application 🌍

Chalo India is a professional MERN stack travel booking platform tailored for the Indian travel market. It provides a seamless experience for users to find, book, and review travel tours, alongside a robust administrative system for managing the platform.

---

## 🚀 Key Features

### For Users
- **Dynamic Tour Discovery**: Browse various tour packages across India with high-quality images and details.
- **Secure Authentication**: Traditional Signup/Login with **OTP verification** and **Google OAuth** integration.
- **Booking System**: Real-time booking with price calculations and seat selection.
- **User Dashboard**: Manage profiles, view booking history, and leave reviews.
- **Responsive Design**: Fully optimized for mobile and desktop using Tailwind CSS.

### For Admins
- **Powerful Dashboard**: Overview of key statistics (Total Users, Tours, and Bookings).
- **Tour Management (CRUD)**: Create, Read, Update, and Delete tour packages.
- **User Management**: Monitor all registered users, with the ability to block or delete accounts.
- **Booking Management**: Track and manage all customer bookings centrally.

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: React 18 (Vite + TypeScript)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **State/HTTP**: Axios, Context API
- **Icons**: Lucide React

### Backend
- **Environment**: Node.js & Express
- **Database**: MongoDB (Mongoose ODM)
- **Security**: JWT (JSON Web Tokens), Bcrypt.js, Helmet.js, Express-Mongo-Sanitize, XSS-Clean
- **Authentication**: Passport.js (Google OAuth 2.0)
- **Email**: Nodemailer (OTP and Communication)

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account
- Google Cloud Console Project (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/Muneendra007/Chalo-India.git
cd Chalo-India
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder:
```env
NODE_ENV=development
PORT=5000
DATABASE=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USERNAME=your_email
EMAIL_PASSWORD=your_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Create a `.env` file in the `frontend` folder:
```env
VITE_API_URL=http://localhost:5000
```

### 4. Run Locally
**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```
**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

---

## 🌐 Deployment

### Backend (Render)
1. Connect your GitHub repository to Render.
2. Create a "Web Service" using the `backend` folder.
3. Add environment variables from your `.env` file.

### Frontend (Vercel)
1. Import the repository to Vercel.
2. Set "Root Directory" to `frontend`.
3. Add `VITE_API_URL` environment variable pointing to your Render backend.

---
