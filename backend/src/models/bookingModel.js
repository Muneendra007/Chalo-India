const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    tour: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tour',
        required: [true, 'Booking must belong to a Tour!']
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: [true, 'Booking must belong to a User!']
    },
    price: {
        type: Number,
        required: [true, 'Booking must have a price.']
    },
    seats: {
        type: Number,
        default: 1
    },
    selectedDate: {
        type: Date,
        required: [true, 'Booking must have a date.']
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    paid: {
        type: Boolean,
        default: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled'],
        default: 'confirmed'
    }
});

bookingSchema.pre(/^find/, function (next) {
    this.populate('user').populate({
        path: 'tour',
        select: 'name imageCover state startDates'
    });
    next();
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
