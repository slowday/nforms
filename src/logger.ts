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
        new (winston.transports.File)({
            name: '[zushar-api::warnings]',
            level: 'warn',
            prettyPrint: true,
            filename: path.resolve(__dirname, '../logs/zushar-warnings.log')
        }),
        new (winston.transports.File)({
            name: '[zushar-api::error]',
            level: 'error',
            prettyPrint: true,
            filename: path.resolve(__dirname, '../logs/zushar-errors.log')
        })
  ]
}); 