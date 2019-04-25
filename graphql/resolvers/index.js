const authResolver = require('./auth');
const eventsResolver = require('./event');
const bookingResolver = require('./booking');

const rootResolver = Object.assign({}, authResolver, eventsResolver, bookingResolver);

module.exports = rootResolver;