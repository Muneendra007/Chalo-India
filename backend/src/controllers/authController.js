const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const sendEmail = require('./../utils/email');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(
            Date.now() + 90 * 24 * 60 * 60 * 1000 // 90 days
        ),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') {
        cookieOptions.secure = true;
        cookieOptions.sameSite = 'none';
    }

    res.cookie('jwt', token, cookieOptions);

    // Remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

exports.signup = async (req, res, next) => {
    try {
        let user = await User.findOne({ email: req.body.email });

        if (user && user.isVerified) {
            return res.status(400).json({ status: 'fail', message: 'User already exists!' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

        if (!user) {
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                passwordConfirm: req.body.passwordConfirm,
                role: req.body.role,
                otp,
                otpExpires,
                isVerified: false
            });
        } else {
            // Update existing unverified user
            user.name = req.body.name;
            user.password = req.body.password;
            user.passwordConfirm = req.body.passwordConfirm;
            user.otp = otp;
            user.otpExpires = otpExpires;
            await user.save({ validateBeforeSave: false });
        }

        try {
            console.log('Attempting to send OTP email to:', user.email);
            await sendEmail({
                email: user.email,
                subject: 'Your OTP for Chalo India Signup',
                message: `Your OTP is ${otp}. It expires in 10 minutes.`
            });
            console.log('OTP email sent successfully');

            res.status(200).json({
                status: 'success',
                message: 'OTP sent to email!'
            });
        } catch (err) {
            console.error('Email sending failed:', err.message);
            user.otp = undefined;
            user.otpExpires = undefined;
            await user.save({ validateBeforeSave: false });
            return res.status(500).json({ status: 'fail', message: 'There was an error sending the email. Try again later!' });
        }
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and OTP' });
        }

        const user = await User.findOne({ email }).select('+otp');

        if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ status: 'fail', message: 'Invalid or expired OTP' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save({ validateBeforeSave: false });

        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1) Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ status: 'fail', message: 'Please provide email and password!' });
        }

        // 2) Check if user exists && password is correct
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Incorrect email or password' });
        }

        // Check if user is active (not blocked/deleted)
        if (user.active === false) {
            return res.status(401).json({ status: 'fail', message: 'Your account has been deactivated. Please contact support.' });
        }

        if (!user.isVerified) {
            return res.status(401).json({ status: 'fail', message: 'Please verify your email first (OTP sent during signup).' });
        }

        // 3) If everything ok, send token to client
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });
    res.status(200).json({ status: 'success' });
};

exports.protect = async (req, res, next) => {
    try {
        // 1) Getting token and check of it's there
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.cookies.jwt) {
            token = req.cookies.jwt;
        }

        if (!token) {
            return res.status(401).json({ status: 'fail', message: 'You are not logged in! Please log in to get access.' });
        }

        // 2) Verification token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3) Check if user still exists
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) {
            return res.status(401).json({ status: 'fail', message: 'The user belonging to this token does no longer exist.' });
        }

        // GRANT ACCESS TO PROTECTED ROUTE
        req.user = currentUser;
        next();
    } catch (err) {
        res.status(401).json({ status: 'fail', message: 'Invalid token or session expired' });
    }
};

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ status: 'fail', message: 'You do not have permission to perform this action' });
        }
        next();
    };
};

exports.updatePassword = async (req, res, next) => {
    try {
        // 1) Get user from collection
        const user = await User.findById(req.user.id).select('+password');

        // 2) Check if POSTed current password is correct
        if (!(await user.correctPassword(req.body.currentPassword, user.password))) {
            return res.status(401).json({ status: 'fail', message: 'Your current password is wrong' });
        }

        // 3) If so, update password
        user.password = req.body.newPassword;
        user.passwordConfirm = req.body.passwordConfirm || req.body.newPassword; // Handle confirm check if model requires it
        await user.save();

        // 4) Log user in, send JWT
        createSendToken(user, 200, res);
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.googleAuthCallback = (req, res) => {
    // req.user contains the authenticated user from Passport
    createSendToken(req.user, 200, res);
};

