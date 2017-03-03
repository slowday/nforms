/**
 * created by waweru
*/

import * as path from 'path';
import * as express from 'express';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as helmet from 'helmet'
import Database from './database';
import { logger as log } from './logger';
import { User } from './users/User';
import { Form } from './forms/Forms';

export default class Zushar {
    /**
     * @docs:
     *     This is the main app class that holds the middlewares routes and all application-level configuration
     *     including database connection.
    */
    public static app: express.Application;
    constructor() {
        let uri: (env: string)=>string = (env: string): string => {
            switch(env) {
                case 'development':
                    return process.env.MONGO_URI;
                case 'testing':
                    return process.env.MONGO_URI;
                default:
                    return process.env.MONGO_URI_MLAB;
            }
        };

        Database.connect( uri(process.env.NODE_ENV) ); // connect to the database
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
        Zushar.app.use(express.static(path.resolve(__dirname, '../docs')))
        Zushar.app.use(
            this._appRoutes() // install api-routes as middleware on express application
        ); 
    }

    private _appRoutes(): express.Router {
        let router = express.Router();
        //# Cross-Domain
        router.all('*', (request: express.Request, response: express.Response, next: express.NextFunction) => {
              response.header('Access-Control-Allow-Origin', '*');
              response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
              response.header('Access-Control-Allow-Headers', 'Content-type,Accept,X-Access-Token,X-Key');
              if (request.method == 'OPTIONS') {
                    response.status(200).end();
              } else {
                    next();
              }
        });
    
        //# FORMS 
        let forms_module = new Form();
        router.use('/forms', forms_module.router);

        //# USER
        let user_module = new User(); // install all the routes for user module and bind the user router as middleware to express
        router.use('/user', user_module.router);
        
        //# ROOT
        router.get('/', 
            (request: express.Request, response: express.Response, next: express.NextFunction) => {
               response.sendFile(path.resolve(__dirname, '../docs/index.html'));
            });

        router.get('/about-api', 
            (request: express.Request, response: express.Response, next: express.NextFunction) => {
               response.json({
                    name: 'Zushar Api Server',
                    version: '0.2.0',
                    timestamp: new Date()
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

        Zushar.app.use(
            (err: any, request: express.Request, response: express.Response, next: express.NextFunction) => {
                log.error(err);// log all 500 errors
                response.status(err.status || 500);
                response.json(err);
            });
    }
}