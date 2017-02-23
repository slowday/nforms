/**
 * created by waweru
*/

import * as mongoose from 'mongoose';
import { logger as log } from './logger';

export default class Database {

    /**
     * @docs: 
     *     A static class for handling database connection and connection events for mongoose. Also handles disconnections
     * @param: connUri: sting -> a connection uri string for mongodb database
    */
    static connect(connUri: string): void {
        (<any>mongoose).Promise = require('es6-promise').Promise;
        mongoose.connect(connUri, {
            'db': {
                'native_parse': true
            }
        });
        Database._connectionEvents();
    }

    private static _connectionEvents() {
        let conn = mongoose.connection;
        conn.on('error', (err: Error):void => {
            log.error(err); // log
            mongoose.disconnect();
            throw err;
        });
        conn.once('open', ():void => {
            log.info('Successfully connected to zushar-api database');
        });
        conn.on('disconnected', function ():void {
            log.info('disconnected to database successfully');
        });
        // nodemon exit strategy
        process.once('SIGUSR2', function () {
            Database._gracefulShutdown(function () {
                process.kill(process.pid, 'SIGUSR2');
            });
        });
        process.on('SIGINT', ():void => {
            Database._gracefulShutdown(function():void {
                process.exit(0);
            },
            'app termination');
        });
    }

    private static _gracefulShutdown(done: any, message?: string): any {
        mongoose.connection.close(function () {
            log.debug(`Mongoose disconnected through ${message}`);
            return done();
        });
    }
}