const User = require('./../models/userModel');
const Booking = require('./../models/bookingModel');

const filterObj = (obj, ...allowedFields) => {
    const newObj = {};
    Object.keys(obj).forEach(el => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
    });
    return newObj;
};

exports.getMe = (req, res, next) => {
    res.status(200).json({
        status: 'success',
        data: {
            user: req.user
        }
    });
};

exports.getProfileStats = async (req, res) => {
    try {
        // 1. Get total bookings (trips)
        const totalBookings = await Booking.countDocuments({ user: req.user.id });

        // 2. Calculate adventure points (100 per booking)
        const adventurePoints = totalBookings * 100;

        // 3. Count wishlist items
        const user = await User.findById(req.user.id);
        const bucketListCount = user.wishlist ? user.wishlist.length : 0;

        res.status(200).json({
            status: 'success',
            data: {
                tripsCount: totalBookings,
                points: adventurePoints,
                bucketListCount: bucketListCount
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const { tourId } = req.params;
        const user = await User.findById(req.user.id);

        const isFavorited = user.wishlist.includes(tourId);

        if (isFavorited) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter(id => id.toString() !== tourId);
        } else {
            // Add to wishlist
            user.wishlist.push(tourId);
        }

        await user.save({ validateBeforeSave: false });

        res.status(200).json({
            status: 'success',
            data: {
                wishlist: user.wishlist
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.updateMe = async (req, res, next) => {
    try {
        // 1) Create error if user POSTs password data
        if (req.body.password || req.body.passwordConfirm) {
            return res.status(400).json({
                status: 'fail',
                message: 'This route is not for password updates. Please use /updateMyPassword.'
            });
        }

        // 2) Filtered out unwanted field names that are not allowed to be updated
        const filteredBody = filterObj(req.body, 'name', 'email', 'phone', 'address', 'bio', 'preferences', 'dateOfBirth', 'photo');

        // 3) Update user document
        const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                user: updatedUser
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteMe = async (req, res, next) => {
    try {
        await User.findByIdAndUpdate(req.user.id, { active: false });

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json({
            status: 'success',
            results: users.length,
            data: {
                users
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.createUser = (req, res) => {
    res.status(500).json({
        status: 'error',
        message: 'This route is not defined! Please use /signup instead'
    });
};

// Do NOT update passwords with this!
exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({
            status: 'success',
            data: {
                user
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err.message });
    }
};
