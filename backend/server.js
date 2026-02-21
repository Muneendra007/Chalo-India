const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');

// Load env vars
dotenv.config({ path: './.env' }); // Adjusted path for root execution

const connectDB = require('./src/config/db');
const passport = require('./src/config/passport'); // Import passport config

// Connect to database
connectDB();

const app = express();

app.use(passport.initialize());

// 1) Manual CORS Middleware (Ensures headers stay even if 500 error occurs)
app.use((req, res, next) => {
    const origin = req.get('Origin');
    const allowedPatterns = ['localhost', '127.0.0.1', 'vercel.app', 'onrender.com'];

    if (origin && (allowedPatterns.some(p => origin.includes(p)) || origin === process.env.FRONTEND_URL)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Cache-Control');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
    }

    // Handle Preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    next();
});

app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginOpenerPolicy: false,
    contentSecurityPolicy: false
}));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Limit requests from same API
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: 'Too many requests from this IP, please try again in an hour!'
});
app.use('/api', limiter);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Serve static files
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// Routes
const tourRouter = require('./src/routes/tourRoutes');
const userRouter = require('./src/routes/userRoutes');
const bookingRouter = require('./src/routes/bookingRoutes');
const reviewRouter = require('./src/routes/reviewRoutes');



app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/bookings', bookingRouter);
app.use('/api/v1/reviews', reviewRouter);

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Handler Middleware 
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        error: err.message || 'Server Error'
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
