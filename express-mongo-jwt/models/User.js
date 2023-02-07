import { Schema } from 'mongoose';
import mongoose from '../database/mongodb';
import bcrypt from 'bcrypt';
import _ from 'lodash';

const userSchema = new Schema({
    username: { type: String, required: true, index: { unique: true } }
    , password: { type: String, required: true }
    , animals: [ { type: Schema.Types.ObjectId, ref: 'animal' } ]
});

function updatePassword(user, next) {
    bcrypt.genSalt(10, (error, salt) => {
        if(error) {
            return next(error);
        }
        bcrypt.hash(user.password, salt, (error, hash) => {
            if(error) {
                return next(error);
            }
            user.password = hash;
            next();
        });
    });
}

userSchema.pre('save', function(next) {
    updatePassword(this, next);
});

userSchema.methods.comparePassword = function(password, next) {
    bcrypt.compare(password, this.password, (error, isMatch) => {
        if(error) {
            return next(error);
        }
        return next(null, isMatch);
    })
};

userSchema.methods.removePass = function() {
    return _.omit(this.toObject(), 'password');
};

export default mongoose.model('user', userSchema);