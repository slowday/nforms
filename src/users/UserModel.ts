/**
 * created by waweru
*/

import { logger as log } from '../logger';
import { userModel as db } from './UserSchema';

export interface editedUser extends UserProfile {
    done: boolean; 
};

export interface User extends UserProfile{
    jwt_token: string;
};

export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    gender: string;
    dob?: string;
}

export interface AuthData {
    email: string;
    phone: string;
    password: string;
}

export class UserModel {
    /**
     * @docs:
     *     user module model for dealing with user related data and data manipulation plus storage
    */
    protected registerUser(user: UserProfile, password: string): Promise<User> {
        let { email, gender, phone, name, dob } = user;
        
        let formattedDob: Date;
        if (dob) {
            formattedDob = new Date(dob);
        }
        
        let newUser = new db({ email, gender, phone, name, formattedDob });
        newUser.password = db.setPassword(password);

        return newUser
            .save()
            .then((data) => {
               let new_user =  { user: data, jwt_token: data.generateJWT() };
               delete new_user.user.password; // remove user password
               return Promise.resolve(new_user);
            })
            .catch((err: Error) => {
                log.error(err);
                return Promise.reject(err);
            });
    }
    protected loginUser(params: AuthData): Promise<User> {
        let { email, phone, password } = params;
        return db
            .findOne({ email, phone })
            .exec()
            .then((data) => {
                if (!data) {
                    let date = new Date();
                    let err: Error = new Error(`${date}:: account not found`);
                    log.warn(err);
                    return Promise.reject(err);
                }
                return Promise.resolve(data);
            })
            .then((data) => {
                if (!data.validatePassword(params.password)) {
                    let date = new Date();
                    let err: Error = new Error(`${date}:: password is incorrect`);
                    log.warn(err);
                    return Promise.reject(err);
                }
                return Promise.resolve(data);
            })
            .then((data) => {
                if (data.deletion) {
                    let date = new Date();
                    let err: Error = new Error(`${date.toDateString()}:: user-account is disabled`);
                    log.warn(err);
                    return Promise.reject(err);;
                }
                return Promise.resolve(data);
            })
            .then((data) => {
               let loggedInUser =  { user: data, jwt_token: data.generateJWT() };
               delete loggedInUser.user.password; // remove user password
               return Promise.resolve(loggedInUser);
            })
            .catch((err: Error) => {
                log.error(err);
                return Promise.reject(err);
            });
    }
    protected updateUser(): editedUser {
        return <editedUser>{};
    }
    protected diableUser(): editedUser {
        return <editedUser>{};
    }
    
    static getOneUser(): UserProfile {
        return <UserProfile>{};
    }
}