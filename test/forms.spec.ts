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
import { authorAuthData, authorUser, password, contributorUser, contributorAuthData } from './details';

// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] Forms Module', function () {
	
	let user_as_contributor_token: string;
	let user_as_author_token: string;

	before('Before all create a new user and log them in', (done) => {
		//# create new user (to act as a contributor)
		chai
		.request(`http://127.0.0.1:${port}`)
		.post('/user/')
		.send({ 
			user_details: contributorUser, 
			password 
		})
		.end((err, res) => {
			user_as_contributor_token = res.body.user.jwt_token;
			done();
		});

	});

	beforeEach('Logging a user', (done) => {
		//# login a user to store token
		chai
		.request(`http://127.0.0.1:${port}`)
		.post('/user/login')
		.send({ 
			auth: authorAuthData
		})
		.end((err, res) => {
			user_as_author_token = res.body.user.jwt_token;
			done();
		});
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