/**
 * created by waweru
*/

import mongoose = require('mongoose');
require('dotenv').config(); // added .env content to application

export default function (): void{
    if (!global.Promise) {
      global.Promise = require('es6-promise/auto');
    }
    mongoose.Promise = global.Promise; 
}