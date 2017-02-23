/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

require('dotenv').config();
require('es6-promise').polyfill();

import * as chai from 'chai';
import { userModel } from '../src/users/UserSchema';
import * as _ from 'lodash';
import { UserProfile, UserModel } from '../src/users/UserModel';

import chaiHttp = require('chai-http');
// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] User Module Model', function () {

    it('Should add a new user', (done) => {
       done();
    });
});