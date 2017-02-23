/**
 * created by waweru
*/

import * as express from 'express';
import * as my from './UserModel';
import Auth from '../auth';

/**
 * @class: User 
 * @docs: Main class for user module
*/
export class User extends my.UserModel{
    public router: express.Router = express.Router();

    public constructor() {
        super();
        
        this.router.get('/', 
            (request: any, response: express.Response, next: express.NextFunction) => {
                response.json({
                    name: 'zushar-api',
                    message: 'Hello! Welcome to zushar api. You are at the user module section of the api',
                    timestamp: new Date().toDateString()
                });
            });
        this.router.post('/', this.createUser);
        this.router.post('/login', this.loginUser);
        this.router.put('/', Auth.authJWT, Auth.getLoggedInUser, this.editUser);
        this.router.delete('/', Auth.authJWT, Auth.getLoggedInUser, this.disableUser);
    }

    private createUser(request: express.Request, response: express.Response, next: express.NextFunction): void {
        super.registerUser(request.body.user_details, request.body.password)
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

    private loginUser(request: express.Request, response: express.Response, next: express.NextFunction): void {
        super.authenticateUser(request.body.auth)
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
    private editUser(request: any, response: express.Response, next: express.NextFunction): void {
        super.updateUser(request.zushar_auth.id, request.body.auth, request.body.updates)
            .then((update_status) => {
                response.json({
                    message: `User ${ (update_status.done) ? `is` : `is not` } updated`,
                    update_status,
                    server_timestamp: new Date()
                });
            })
            .catch((err) => {
                return next(err);
            });
    }

    //#note: request is type any to suppress error about zushar_auth
    protected disableUser(request: any, response: express.Response, next: express.NextFunction): void {
        super.updateUser(request.zushar_auth.id, 
            request.body.auth, 
            {
                deletion: request.body.deletion
            })
            .then((update_status) => {
                response.json({
                    message: `User ${ (update_status.done) ? `is` : `is not` } deleted`,
                    update_status,
                    server_timestamp: new Date()
                });
            })
            .catch((err) => {
                return next(err);
            });
    }
}