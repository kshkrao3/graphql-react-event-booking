const bcrypt = require('bcryptjs');
const User = require('../../models/user');

module.exports = {
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
    })
};