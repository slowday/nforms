/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

require('dotenv').config();
require('es6-promise').polyfill();

import * as chai from 'chai';
import { userModel } from '../src/users/UserSchema';
import * as _ from 'lodash';
import { UserProfile, UserModel, AuthData } from '../src/users/UserModel';
import chaiHttp = require('chai-http');

describe('[zushar-api] Forms Module', function () {

	it('Should add a new form', (done) => {
		
		done();
	});

	it('Should get a list of all forms', (done) => {
		done();
	});

	it('Should get one form', (done) => {
		done();
	});

	it('Should update a form', (done) => {
		done();
	});

	it('Should disable a form', (done) => {
		done();
	});

	it('Should add a new contributor', (done) => {
		done();
	});

	it('Shoudl get all contributors', (done) => {
		done();
	});

	it('Should remove a contributor', (done) => {
		done();
	});

})