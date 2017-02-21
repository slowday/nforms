/**
 * created by waweru
*/

import * as path from 'path'
import * as express from 'express'
import * as logger from 'morgan'
import * as bodyParser from 'body-parser'
import * as compression from 'compression'
import * as helmet from 'helmet'
import Database from './database';
import { logger as log } from './logger';
import { User } from './users/User';

export default class Zushar {
    /**
     * @docs:
     *     This is the main app class that holds the middlewares routes and all application-level configuration
     *     including database connection.
    */
    public static app: express.Application;
    constructor() {
        Database.connect( <string>process.env.MONGO_URI ); // connect to the database
        // #Express
        Zushar.app = express(); // init the express app
        this._middlewares(); // install middlewares
        this._errorHandling(); // enable error handling
    }

    private _middlewares(): void {
        Zushar.app.use(compression());
        Zushar.app.use(helmet({
            frameguard: {
                action: 'deny'
            }
        }));   
        Zushar.app.use(helmet.hidePoweredBy({ setTo: 'PHP 3.1.6' }));
        Zushar.app.use(logger('dev'));
        Zushar.app.use(bodyParser.json());
        Zushar.app.use(bodyParser.urlencoded({ extended: false }));
        Zushar.app.use(
            this._appRoutes() // install api-routes as middleware on express application
        ); 
    }

    private _appRoutes(): express.Router {
        let router = express.Router();
        
        //# USER
        let user_module = new User(); // install all the routes for user module and bind the user router as middleware to express
        router.use('/user', user_module.router);

        //# ROOT
        router.get('/', 
            (request: express.Request, response: express.Response, next: express.NextFunction) => {
               response.json({
                   name: 'zushar-api',
                   message: 'Hello! Welcome to zushar api.',
                   timestamp: new Date().toDateString()
               });
            });

        return router;
    }
    // all error handling middleware plugged in
    private _errorHandling(): void {
        Zushar.app.use(
            (request: express.Request, response: express.Response, next: express.NextFunction) => {
                let err: any = new Error('Resource Not Found');
                err.status = 404;
                next(err);
            });

        if (process.env.NODE_ENV === 'production') {
            // #prodcution
            Zushar.app.use(
                (err: any, request: express.Request, response: express.Response, next: express.NextFunction) => {                    
                    log.error(err);// log all 500 errors
                    response.status(err.status || 500);
                    response.send(err);
                });
        
        }
        if (process.env.NODE_ENV === 'development') {
            // #development
            Zushar.app.use(
                (err: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
                    log.error(err);// log all 500 errors
                    response.status(err.status || 500);
                    response.json({
                      message: err.message,
                      error: err
                    });
                });
        }
    }
}