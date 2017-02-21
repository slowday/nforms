/**
 * created by waweru
*/

import * as express from 'express';
import * as expressJWT from 'express-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';
import { logger as log } from './logger';
import { UserProfile, UserModel } from './users/UserModel';

export default class Auth extends UserModel {
    /**
     * @docs: 
     *     This is a static class whose domain is authentication and authorization
    */
    static authJWT = expressJWT({
      secret : process.env.JWT_SECRET,
      userProperty : 'zushar_auth'
    });

    // request is type any to suppress error about zushar_auth
    static getLoggedInUser(request: any, response: express.Response, next: express.NextFunction): void {
        // query for user details
        if (_.isEmpty(request.zushar_auth) || _.isNil(request.zushar_auth.id)) {
            request.zushar_auth.isLoggedin = false;
            next();
        }

        super.getOneUser(request.zushar_auth.id)
            .then((data: UserProfile) => {
                let age = null;
                request.zushar_auth.isLoggedin = true;
                if (!_.isEmpty(data.dob)) {
                    let dob = moment(data.dob);
                    let now = moment();
                    age = now.diff(dob, 'years', true);
                }
                //  add user data to request object
                request.zushar_auth.user_data = {
                    email: data.email,
                    gender: data.gender,
                    phone: data.phone,
                    name: data.name,
                    age: (age)
                };
                next();
            })
            .catch((err: Error) => {
                next(err);
            });
    }
    
    static refreshToken(request: express.Request, response: express.Response, next: express.NextFunction) {
        // requires user module
    }    
}