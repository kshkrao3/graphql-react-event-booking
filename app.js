const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Event = require('./models/event');
const User = require('./models/user');
app.use(express.json());

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

app.use('/api', graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        input UserInput{
            email: String!
            password: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }
        schema{
            query: RootQuery
            mutation: RootMutation
        }
        `),
    rootValue: {
        events: () => {
            return Event.find((err, events) => {
                if (err) throw err;
                return events.map(event => {
                    return Object.assign({}, event._doc);
                });
            });
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
                    createdEvent = Object.assign({}, result._doc);
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
        createUser: args => {
            return User.findOne({ email: args.userInput.email }).then(user => {
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
            });

        }
    },
    graphiql: true
}), (req, res, next) => {

});

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@graphql-event-dnara.mongodb.net/${process.env.MONGO_DB}?retryWrites=true`, { useNewUrlParser: true })
    .then(() => {
        console.log('Mongo Cluster connected');
    }).catch(err => {
        console.log('User', process.env.MONGO_USER);
        console.log('Password', process.env.MONGO_PASSWORD);
        console.log('Database', process.env.MONGO_DB);
        console.log('Error while connecting mongo db', err);
    });