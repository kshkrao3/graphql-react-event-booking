const DataLoader = require('dataloader');
const Event = require('../../models/event');
const User = require('../../models/user');
const { dateToISOString } = require('../../helpers/date');

const eventLoader = new DataLoader((eventIds) => {
    console.log('Event Ids', eventIds);
    return events(eventIds);
});

const userLoader = new DataLoader(userIds => {
    return User.find({_id: {$in: userIds}});
});

const transformEvent = event => {
    if(!event) return;
    return Object.assign({}, event._doc, { creator: user.bind(this, event.creator), date: dateToISOString(event._doc.date) });
};

const transformBooking = booking => {
    return Object.assign({}, booking, {
        _id: booking._id,
        createdAt: dateToISOString(booking.createdAt),
        updatedAt: dateToISOString(booking.updatedAt),
        user: user.bind(this, booking.user),
        event: singleEvent.bind(this, booking.event._id)
    });
};

const user = async userId => {
    try {
        const user = await userLoader.load(userId.toString());
        return Object.assign({}, 
            user._doc, 
            { _id: user.id, 
                createdEvents: () => eventLoader.loadMany(user._doc.createdEvents) 
            });
        
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
        const event = await eventLoader.load(eventId.toString());
        return event;
    } catch (err) {
        throw err;
    }
};

exports.transformEvent = transformEvent;
exports.transformBooking = transformBooking;