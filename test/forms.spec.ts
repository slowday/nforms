/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

require('dotenv').config();
require('es6-promise').polyfill();

import * as chai from 'chai';
import * as _ from 'lodash';
import chaiHttp = require('chai-http');
import { AuthData } from '../src/users/UserModel';
import { authData, newUser, password, updates} from './details';


describe('[zushar-api] Forms Module', function () {

	before(() => {
		//# login user
	});

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