const bcrypt = require('bcryptjs');
const Event = require('../../models/event');
const User = require('../../models/user');
const Booking = require('../../models/booking');
const user = async userId => {
    try {
        const user = await User.findById(userId);
        return Object.assign({}, user._doc, { _id: user.id, createdEvents: events.bind(this, user._doc.createdEvents) });
    } catch (err) {
        throw new Error(err);
    }
};

const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } });
        return events.map(event => {
            return Object.assign({}, event._doc, { creator: user.bind(this, event.creator), date: new Date(event._doc.date).toISOString() });
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return Object.assign({}, event._doc, { creator: user.bind(this, event.creator) });
    } catch (err) {
        throw err;
    }
};


module.exports = {
    events: async() => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return Object.assign({}, event._doc, { creator: user.bind(this, event._doc.creator), date: new Date(event._doc.date).toISOString() });
            });
        } catch (err) {
            console.log('Error while populating events');
            throw new Error(err);
        }
    },
    bookings: async() => {
        try {
            const bookings = await Booking.find();
            return bookings.map(booking => {
                return Object.assign({},
                    booking._doc, {
                        createdAt: new Date(booking._doc.createdAt).toISOString(),
                        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
                        user: user.bind(this, booking._doc.user),
                        event: singleEvent.bind(this, booking._doc.event)
                    });
            });
        } catch (err) {
            throw err;
        }
    },
    createEvent: args => {
        const event = new Event({
            title: args.eventInput.title,
            description: args.eventInput.description,
            price: +args.eventInput.price,
            date: new Date(args.eventInput.date),
            creator: "5cbdd34dbcc0712f484a7409"
        });
        let createdEvent;
        return event.save()
            .then(result => {
                console.log('Saved event successfully');
                createdEvent = Object.assign({}, result._doc, { creator: user.bind(this, result._doc.creator), date: new Date(result._doc.date).toISOString() });
                return User.findById('5cbdd34dbcc0712f484a7409');
            })
            .then(user => {
                if (!user) {
                    throw new Error('User not found');
                }
                user.createdEvents.push(event);
                return user.save();
            })
            .then(res => {
                return createdEvent;
            })
            .catch(err => {
                console.log('Error while saving event', err);
                throw err;
            });
    },
    createUser: args => User.findOne({ email: args.userInput.email }).then(user => {
        if (user) {
            throw new Error('User already exists');
        }
        return bcrypt.hash(args.userInput.password, 12);
    }).then(hashString => {
        const user = new User({
            email: args.userInput.email,
            password: hashString
        });
        return user.save().then(res => {
            return Object.assign({}, res._doc);
        });
    }).catch(err => {
        console.log('Error occured', err);
        throw err;
    }),
    bookEvent: async args => {
        const fetchedEvent = await Event.findOne({ _id: args.eventId });
        const booking = new Booking({
            user: "5cbdd34dbcc0712f484a7409",
            event: fetchedEvent
        });
        const result = await booking.save();
        return Object.assign({}, result._doc, {
            createdAt: new Date(result._doc.createdAt).toISOString(),
            updatedAt: new Date(result._doc.updatedAt).toISOString(),
            user: user.bind(this, result._doc.user),
            event: singleEvent.bind(this, result._doc.event)
        });
    },
    cancelBooking: async args => {
        try {
            const booking = await Booking.findById(args.bookingId).populate('event');
            const event = Object.assign({}, booking.event._doc, { _id: booking.event._doc.id, creator: user.bind(this, booking.event._doc.creator) });
            await Booking.deleteOne({ _id: args.bookingId });
            return event;
        } catch (error) {
            throw error;
        }
    }

};