/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

require('dotenv').config();
require('es6-promise').polyfill();

import * as chai from 'chai';
import * as _ from 'lodash';
import { IFormsModel } from '../src/forms/FormsSchema';
import chaiHttp = require('chai-http');
import { AuthData } from '../src/users/UserModel';
import { authorAuthData, authorUser, password, contributorUser, contributorAuthData } from './details';

// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] Forms Module', function () {
	
	let user_as_contributor_token: string;
	let user_as_author_token: string;
	let author_id: string;
	let contributor_id: string;
	let createdForm: any; 
	let sampleForm: IFormsModel = <IFormsModel>{
		name: 'Sample Form',
		questions: [],
		form_state: 'draft',
		author: author_id
	};

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
			contributor_id = res.body.user._id;
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
			author_id = res.body.user._id;
			done();
		});
	});

	it('Should add a new form', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.post('/forms/')
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.send({
			form: sampleForm
		})
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'form');
			chai.expect(res.body.form).to.have.any.keys('questions', 'name', 'form_state', '_id', 'author', 'contributors', '__v');
			chai.expect(res.body.form.contributors.length).to.eql(0);
			chai.expect(res.body.form.form_state).to.eql('draft');
			createdForm = _.assign({}, res.body.form);
			done();
		});
	});

	it('Should get a list of all forms', (done) => {
		 chai
		.request(`http://127.0.0.1:${port}`)
		.get('/forms/')
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'forms');
			chai.expect(res.body.forms[0]).to.have.any.keys('questions', 'name', 'form_state', '_id', 'author', 'contributors', '__v');
			chai.expect(res.body.forms[0]._id).to.eql(createdForm._id);
			done();
		});
	});

	it('Should get one form', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.get(`/forms/${createdForm._id}?user_type=author`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'form');
			chai.expect(res.body.form).to.have.any.keys('questions', 'name', 'form_state', '_id', 'author', 'contributors', '__v');
			chai.expect(res.body.form._id).to.eql(createdForm._id);
			done();
		});
	});

	it('Should update a form', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.put(`/forms/${createdForm._id}?user_type=author`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.send({
			updates: {
				questions: [
					{
						id: 1,
						label: 'Write about yourself ?',
						fieldType: 'text-input',
						field: 'paragraph',
						instructions: 'Must be between 144 and 200 characters',
						isMandatory: true,
						addedBy: createdForm._id,
						params: {
							max: 200,
							min: 144
						}
					}
				],
				name: '[Edited] Sample Form',
				form_state: 'ready'
			}
		})
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'form');
			chai.expect(res.body.form).to.have.any.keys('questions', 'name', 'form_state', '_id', 'author', 'contributors', '__v');
			chai.expect(res.body.form._id).to.eql(createdForm._id);
			done();
		});
	});

	it('Should disable a form', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.del(`/forms/${createdForm._id}`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'data');
			chai.expect(res.body.data).to.have.all.keys('done', 'timestamp');
			done();
		});
	});

	it('Should add a new contributor', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.post(`/forms/contributors/${createdForm._id}`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.send({
			contributor: contributor_id
		})
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'contributors');
			chai.expect(res.body.contributors).to.be.an('array');
			chai.expect(res.body.contributors.length).to.eql(1);
			done();
		});
	});

	it('Shoudl get all contributors', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.get(`/forms/contributors/${createdForm._id}`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'contributors');
			chai.expect(res.body.contributors).to.be.an('array');
			chai.expect(res.body.contributors.length).to.eql(1);
			done();
		});
	});

	it('Should remove a contributor', (done) => {
		chai
		.request(`http://127.0.0.1:${port}`)
		.del(`/forms/contributors/${createdForm._id}`)
		.set('Authorization', `Bearer ${user_as_author_token}`)
		.send({
			contributor: contributor_id
		})
		.end((err, res) => {
			chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
			chai.expect(res.body).to.have.all.keys('message', 'timestamp', 'contributors');
			chai.expect(res.body.contributors).to.be.an('array');
			chai.expect(res.body.contributors.length).to.eql(0);
			done();
		});
	});

});