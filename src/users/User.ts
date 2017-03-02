/**
 * created by waweru
*/

import * as express from 'express';
import * as _ from 'lodash';
import * as UserModel from './UserModel';
import Auth from '../auth';

/**
 * @class: User 
 * @docs: Main class for user module
*/
export class User{
    public router: express.Router = express.Router();

    public constructor() {        
        this.router.get('/', 
            (request: any, response: express.Response, next: express.NextFunction) => {
                response.json({
                    name: 'zushar-api',
                    message: 'Hello! Welcome to zushar api. You are at the user module section of the api',
                    timestamp: new Date().toDateString()
                });
            });
        this.router.post('/', this._createUser);
        this.router.post('/login', this._authenticateUser);
        this.router.put('/', Auth.authJWT, Auth.getLoggedInUser, this._updateUser);
        this.router.delete('/', Auth.authJWT, Auth.getLoggedInUser, this._disableUser);
    }

    private _createUser(request: express.Request, response: express.Response, next: express.NextFunction): void {
        UserModel.registerUser(request.body.user_details, request.body.password)
            .then((user) => {
                response.json({
                    message: 'user created',
                    user: { ...user }, 
                    server_timestamp: new Date()
                });
            })
            .catch((err) => {
                return next(err);
            });
    }

    private _authenticateUser(request: express.Request, response: express.Response, next: express.NextFunction): void {
        UserModel.authenticateUser(request.body.auth)
            .then((user) => {
                response.json({
                    message: 'user logged-in',
                    user,
                    server_timestamp: new Date()
                });
            })
            .catch((err) => {
                return next(err);
            });
    }
    
    //#note: request is type any to suppress error about zushar_auth
    private _updateUser(request: any, response: express.Response, next: express.NextFunction): void {
        UserModel.updateUser(request.zushar_auth.id, request.body.auth, request.body.updates)
            .then((results) => {
                if (!_.isEmpty(results)) {
                    response.json({
                        message: `User ${ (results.done) ? `is` : `is not` } updated`,
                        ...results
                    });
                }
                else {
                    response.json({
                        message: `User ${ (results.done) ? `is` : `is not` } updated`,
                        ...results
                    });
                }
            })
            .catch((err) => {
                next(err);
            });
    }

    //#note: request is type any to suppress error about zushar_auth
    protected _disableUser(request: any, response: express.Response, next: express.NextFunction): void {
        UserModel.updateUser(request.zushar_auth.id, request.body.auth, { deletion: true })
            .then((results) => {
                if (!_.isEmpty(results)) {
                    response.json({
                        message: `User ${ (results.done) ? `is` : `is not` } deleted`,
                        ...results
                    });
                }
                else {
                    response.json({
                        message: `User ${ (results.done) ? `is` : `is not` } deleted`,
                        results: null
                    });
                }
            })
            .catch((err) => {
                next(err);
            });
    }

}