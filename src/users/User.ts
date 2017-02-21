/**
 * created by waweru
*/

import * as express from 'express';
import * as my from './UserModel';
import * as auth from '../auth';

class UserController extends my.UserModel{
    /**
     * @docs:
     *     exposes model to express routing and middleware
    */

    protected createUser(request: express.Request, response: express.Response, next: express.NextFunction) {
        super.registerUser(request.body.user_details, request.body.password)
            .then((user) => {
                response.json({
                    message: 'user created',
                    user,
                    server_timestamp: new Date()
                });
            })
            .catch((err) => {
                return next(err);
            });
    }

    protected loginUser(request: express.Request, response: express.Response, next: express.NextFunction) {
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
    protected editUser(request: any, response: express.Response, next: express.NextFunction) {
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
    protected disableUser(request: any, response: express.Response, next: express.NextFunction) {
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
/**
 * @class: User 
 * @docs: Main class for user module
*/
export class User extends UserController{
    static router: express.Router = express.Router();

    public install() {
        // installs all the routes for accessing use resources
        User.router.get('/', 
            (request: any, response: express.Response, next: express.NextFunction) => {
                response.json({
                    name: 'zushar-api',
                    message: 'Hello! Welcome to zushar api. You are at the user module section of the api',
                    timestamp: new Date().toDateString()
                });
            });

        User.router.post('/', super.createUser);
        User.router.post('/login', super.loginUser);
        User.router.put('/', super.editUser);
        User.router.delete('/', super.disableUser);
    }
}