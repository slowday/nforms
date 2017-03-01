/**
 * created by waweru
*/

import * as mongoose from 'mongoose';
import * as crypto from 'crypto';
import * as JWT from 'jsonwebtoken';
import { logger as log } from '../logger';

export interface IUser extends mongoose.Document{
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob?: Date;
    password?: string;
} 
interface User extends IUser{
    deletion: boolean;
    password: string;
    generateJWT(): JWT.SignOptions;
    validatePassword (password: string): boolean;
}
interface UserModel extends mongoose.Model<User> {
    setPassword(password: string): string;
}

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
        type: Date
    },
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
    strict: true,
    timestamps: true
});

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
        createdAt: this.createdAt
    }, 
    (process.env.JWT_TOKEN || '12814de572bd6abbb83c3666'), 
    { 
        expiresIn: '2h' 
    });
};

// compile schema and export
export let userModel = <UserModel>mongoose.model('users', UserSchema);