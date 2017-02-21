/**
 * created by waweru
*/

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as JWT from 'jsonwebtoken';
import { logger as log } from '../logger';

let UserSchema: mongoose.Schema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 4,
        trim: true,
        default: crypto.randomBytes(7).toString('hex')
    },
    email: {
        type: String,
        unique: true,
        require: true,
        minlength: 3,
        trim: true
    },
    phone: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: {
            values: 'male,female'.split(','),
            message: 'Gender not available'
        },
        required: true
    },
    dob: {
        type: String
    },
    // code below will be uncommented once email and phone verification for users is implemented
/*    verified: {
        type: Boolean,
        default: false
    },
    verification_code: {
        type: String,
        unique: true,
        required: true,
        default: crypto.randomBytes(4).toString('hex')
    },*/
    deletion: {
        type: Boolean,
        default: false
    },
    password: {
        type: String,
        unique: true,
        required: true
    }
}, 
{

}).set('strict');


UserSchema.methods.validatePassword = function(password: string): boolean {
    let pwd: string[] = this.password.split(';');
    let hmac: crypto.Hmac = crypto.createHmac('sha512WithRSAEncryption', pwd[1]);
    hmac.update(password);
    let hash_pwd: string = hmac.digest('hex') + ';' + pwd[1];
    return (this.password === hash_pwd);
};

UserSchema.statics.setPassword = function(password: string): string {
    let salt: string = crypto.randomBytes(24).toString('hex');
    let hmac: crypto.Hmac = crypto.createHmac('sha512WithRSAEncryption', salt);
    hmac.update(password);
    return `${hmac.digest('hex')};${salt}`;
};

UserSchema.methods.generateJWT = function(): JWT.SignOptions{
    return JWT.sign({
        id: this._id,
        creation_date: this.creation_date
    }, 
    process.env.JWT_SECRET, 
    { 
        expiresIn: '2h' 
    });
};

/**
 * @docs:
 *     Expose a user model 
 *     Expose user model interface for type guarding model implementation and integrate to other modules
*/
export interface IUserModel extends mongoose.Document {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob?: string;
    //validated: boolean;
    //validation_code: string;
    deletion: boolean;
    password: string;
}
export let userModel =  mongoose.model<IUserModel>('users', UserSchema);