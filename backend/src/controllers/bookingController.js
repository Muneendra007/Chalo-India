const Booking = require('./../models/bookingModel');

exports.getAllBookings = async (req, res) => {
    try {
        let filter = {};
        if (req.params.tourId) filter = { tour: req.params.tourId };
        if (req.user.role === 'user') {
            filter.user = req.user.id;
        } else if (req.query.user) {
            filter.user = req.query.user; // Allow admin to filter by user
        }

        const bookings = await Booking.find(filter);

        res.status(200).json({
            status: 'success',
            results: bookings.length,
            data: {
                bookings
            }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err });
    }
};

exports.createBooking = async (req, res) => {
    try {
        // User is taken from protect middleware
        if (!req.body.user) req.body.user = req.user.id;

        const newBooking = await Booking.create(req.body);
        res.status(201).json({
            status: 'success',
            data: {
                booking: newBooking
            }
        });
    } catch (err) {
        res.status(400).json({ status: 'fail', message: err });
    }
};

exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) throw new Error('No booking found with that ID');
        res.status(200).json({ status: 'success', data: { booking } });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

exports.updateBooking = async (req, res) => {
    try {
        let booking = await Booking.findById(req.params.id);
        if (!booking) throw new Error('No booking found with that ID');

        // Allow Admin OR Owner
        if (req.user.role !== 'admin' && booking.user.id !== req.user.id) {
            return res.status(403).json({ status: 'fail', message: 'You can only edit your own bookings.' });
        }

        booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            status: 'success',
            data: {
                booking
            }
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};

exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);
        if (!booking) throw new Error('No booking found with that ID');

        // Allow Admin OR Owner
        // booking.user is likely an ObjectId if not populated. 
        // We cast both to string to be safe.
        const bookingUserId = booking.user._id ? booking.user._id.toString() : booking.user.toString();

        if (req.user.role !== 'admin' && bookingUserId !== req.user.id) {
            return res.status(403).json({ status: 'fail', message: 'You can only delete your own bookings.' });
        }

        await Booking.findByIdAndDelete(req.params.id);
        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({ status: 'fail', message: err.message });
    }
};
