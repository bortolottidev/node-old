const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');
const bcryptjs = require('bcryptjs');

module.exports = (passport) => {
    passport.serializeUser((user, next) => {
        next(null, user);
    });

    passport.deserializeUser((id, next) => {
        User.findById(id, (err, user) => {
            next(err, user);
        });
    });

    const localLogin = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, next) => {
        User.findOne({ email }, (err, user) => {
            if (err) {
                return next(err);
            }

            if (!user) {
                return next(new Error('User not found'));
            }

            if(bcryptjs.compareSync(password, user.password) !== true) {
                return next(new Error('Incorrect user or password'));
            }

            return next(null, user);
        });
    })

    passport.use('localLogin', localLogin);

    const localRegister = new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, (req, email, password, next) => {
        User.findOne({ email }, (err, user) => {
            if(err) {
                return next(new Error('Cannot check if user exists. Retry later'));
            }
            if(user) {
                return next(new Error('User already exists. Please login'));
            } 

            const hashedPasword = bcryptjs.hashSync(password);
            const isAdmin = email.endsWith('@email.com');
            User.create({ email, password: hashedPasword, isAdmin }, (err, user) => {
                if(err) {
                    return next(err);
                }
        
                return next(null, user);
            });
        });
    });

    passport.use('localRegister', localRegister);
}