/**
 * created by waweru
*/

import * as winston from 'winston';
import * as path from 'path';
/**
 * @docs:
 *     This is a module for handling logging for the zushar api.
*/

export let logger: any = new (winston.Logger)({
  transports: [
        new (winston.transports.Console)({ 
            name: '[zushar-api::console]', 
            level: 'info', 
            colorize: true 
        }),
        new (winston.transports.Console)({
            name: '[zushar-api::warnings]',
            level: 'warn',
            colorize: true 
        }),
        new (winston.transports.Console)({
            name: '[zushar-api::error]',
            level: 'error',
            colorize: true 
        })
  ]
}); 