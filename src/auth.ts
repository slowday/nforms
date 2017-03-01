/**
 * created by waweru
*/

/// <reference path="../node_modules/moment/moment.d.ts" />

import * as express from 'express';
import * as expressJWT from 'express-jwt';
import * as _ from 'lodash';
import * as moment from 'moment';
import { logger as log } from './logger';
import { IUser } from './users/UserSchema';
import { getOneUser as getUser } from './users/UserModel';

export default class Auth {
    /**
     * @docs: 
     *     This is a static class whose domain is authentication and authorization
    */
    static authJWT = expressJWT({
      secret : process.env.JWT_TOKEN || '12814de572bd6abbb83c3666',
      userProperty : 'zushar_auth'
    });

     //#note: request is type any to suppress error about zushar_auth
    static getLoggedInUser(request: any, response: express.Response, next: express.NextFunction): void {
        // query for user details
        if (_.isEmpty(request.zushar_auth) || _.isNil(request.zushar_auth.id)) {
            request.zushar_auth.isLoggedin = false;
            next();
        }
        
        //# Get User Details
        getUser(request.zushar_auth.id)
            .then((data: IUser) => {
                let age = null;
                request.zushar_auth.isLoggedin = true;
                if (!_.isEmpty(data.dob)) {
                    let dob = moment(data.dob);
                    let now = moment();
                    age = now.diff(dob, 'years', true);
                }
                //  add user data to request object
                request.zushar_user = {
                    email: data.email,
                    gender: data.gender,
                    phone: data.phone,
                    name: data.name,
                    age: (age)
                };
                next();
            })
            .catch((err: any) => {
                request.zushar_auth.isLoggedin = false;
                next(err);
            });
    }
    
    static refreshToken(request: express.Request, response: express.Response, next: express.NextFunction) {
        // requires user module
    }    
}