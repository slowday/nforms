/**
 * created by waweru
*/

import * as express from 'express';
import * as expressJWT from 'express-jwt';
import { logger as log } from './logger';

export default class Auth {
    /**
     * @docs: 
     *     This is a static class whose domain is authentication and authorization
    */
    static authJWT = expressJWT({
      secret : <string>process.env.JWT_SECRET,
      userProperty : 'zushar_auth'
    });

    static getLoggedInUser(request: express.Request, response: express.Response, next: express.NextFunction) {
        // requires user module
    }
    
    static refreshToken(request: express.Request, response: express.Response, next: express.NextFunction) {
        // requires user module
    }    
}