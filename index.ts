/**
 * created by waweru
 * @docs: main file for zushar api
*/

import * as http from 'http';
import * as debug from 'debug';
import * as mongoose from 'mongoose';
import Zushar from './src/app';
import { logger as log } from './src/logger';

debug('[zushar-api]'); // debugging enabled

class ApiServer extends Zushar{
    private static ZusharApi: Zushar;
    private static _server: http.Server; // server instance
    
    public static init(port: number) {
        if (!ApiServer.ZusharApi) {
            ApiServer.ZusharApi = new ApiServer(port);
        }
        return ApiServer.ZusharApi;
    }

    private constructor(private port: number) {
        super();
        
        Zushar.app.set('port', this.port);
        ApiServer._server = http.createServer(Zushar.app);
        ApiServer._server.listen(port);
        ApiServer._server.on('error', this._handleServerError);
        ApiServer._server.on('listening', this._startListening);
    }

    private _handleServerError(error: NodeJS.ErrnoException): void {
        // logging server errors
        log.error(error);

        if (error.syscall !== 'listen') throw error; 

        let bind = (typeof this.port === 'string') ? 'Pipe ' + this.port : 'Port ' + this.port;
        switch(error.code) {
            case 'EACCES':
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case 'EADDRINUSE':
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }

    private _startListening(): void{
        let addr = ApiServer._server.address();
        let bind = (typeof addr === 'string') ? `pipe ${addr}` : `port ${addr.port}`;
        debug(`Listening on ${bind}`);
        // log
        log.info(`zushar-api server running on port ${addr.port}`);
    }
}

require('dotenv').config(); // added .env content to api
if (!global.Promise) {
  global.Promise = require('es6-promise/auto');
}
(mongoose as any).Promise = global.Promise; // assign mongoose es6Promise as the defacto promise library
ApiServer.init(<number>(process.env.PORT || 3000));