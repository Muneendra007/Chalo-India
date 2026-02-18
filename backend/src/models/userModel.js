const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please tell us your name!']
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        unique: true,
        lowercase: true,
        validate: [
            {
                validator: validator.isEmail,
                message: 'Please provide a valid email'
            },
            {
                validator: function (el) {
                    const allowedDomains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'voyana.in', 'chaloindia.in'];
                    const domain = el.split('@')[1];
                    return allowedDomains.includes(domain);
                },
                message: 'Email provider not supported. Please use Gmail, Outlook, Yahoo, or Hotmail.'
            }
        ]
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: 8,
        select: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    otp: {
        type: String,
        select: false
    },
    otpExpires: Date,
    isVerified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: true,
        select: true // Admins need to see this by default in lists
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
