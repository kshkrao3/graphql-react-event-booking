const Event = require('../../models/event');
const { transformEvent } = require('./merge');

module.exports = {
    events: async() => {
        try {
            const events = await Event.find();
            return events.map(event => {
                return transformEvent(event);
            });
        } catch (err) {
            console.log('Error while populating events');
            throw new Error(err);
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
                createdEvent = transformEvent(result);
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
};