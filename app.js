const express = require('express');
const app = express();
const graphqlHttp = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');
app.use(express.json());

app.listen(3000, () => {
    console.log('App listening on port 3000!');
});

app.use(isAuth);

app.use('/api', graphqlHttp({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
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