const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToISOString } = require('../../helpers/date');
const transformEvent = event => {
    return Object.assign({}, event._doc, { creator: user.bind(this, event.creator), date: dateToISOString(event._doc.date) });
};

const transformBooking = booking => {
    return Object.assign({}, booking._doc, {
        createdAt: dateToISOString(booking._doc.createdAt),
        updatedAt: dateToISOString(booking._doc.updatedAt),
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event)
    });
};

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
            return transformEvent(event);
        });
    } catch (err) {
        throw err;
    }
};

const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId);
        return transformEvent(event);
    } catch (err) {
        throw err;
    }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;