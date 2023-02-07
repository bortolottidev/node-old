import passport from 'passport';
import passportJWT from 'passport-jwt';
import User from '../models/User';

const { Strategy, ExtractJwt } = passportJWT;

const secret = process.env.SECRET_OR_KEY || 'Secret very secret';
const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    , secretOrKey: secret
}

const strategy = new Strategy(options, function(payload, verifyCallback) {
    console.log('Token: ', payload);
    User.findOne({ _id: payload.id }, function (error, result) {
        console.log('Found in Mongo: ', result);
        if(error) {
            return verifyCallback(error);
        }
        return verifyCallback(null, result);
    });
});

passport.use(strategy);
export default passport;
export { secret };
export const auth = passport.authenticate('jwt', { session: false });