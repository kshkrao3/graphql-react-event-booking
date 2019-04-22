const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const Event = require('./models/event');
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

        input EventInput{
            title: String!
            description: String!
            price: Float!
            date: String!
        }

        type RootQuery{
            events: [Event!]!
        }

        type RootMutation{
            createEvent(eventInput: EventInput): Event
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
                date: new Date(args.eventInput.date)
            });
            return event.save()
                .then(result => {
                    console.log('Saved event successfully', result);
                    return Object.assign({}, result._doc);
                })
                .catch(err => {
                    console.log('Error while saving event', err);
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
        console.log('Error while connecting mongo db', err);
    });