const bcrypt = require('bcryptjs');
const User = require('../../models/user');
const jwt = require('jsonwebtoken');
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
    }),

    login: async({ email, password }) => {
        const user = await User.findOne({ email: email });
        if (!user) {
            throw new Error('User does not exist');
        }
        const isEqual = await bcrypt.compare(password, user.password);
        if (!isEqual) {
            throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'VaniGuruSecretKey', {
            expiresIn: '1h'
        });
        return {
            userId: user.id,
            token: token,
            tokenExpiration: 1
        };
    }
};