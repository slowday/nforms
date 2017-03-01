/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

require('dotenv').config();
require('es6-promise').polyfill();

import * as chai from 'chai';
import * as mongoose from 'mongoose';
import * as _ from 'lodash';
import { AuthData } from '../src/users/UserModel';
import { IUser } from '../src/users/UserSchema';
import { authorAuthData, authorUser, password, contributorUser, contributorAuthData } from './details';

import chaiHttp = require('chai-http');
// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] User Module', function () {
    
    let userToken: string; // authentication token details
    let sampleUser: IUser = <IUser>{
        name: 'Sample User',
        gender: 'male',
        email: 'sample@domain.com',
        phone: '+90-120789102'
    };
    let sampleAuth: AuthData = <AuthData>{
        email: 'sample@domain.com',
        password: 'metoyourpaas',
        phone: '+90-120789102'
    };
    let sampleUpdates = {
        email: 'example@domain.net',
        dob: new Date('1997-9-12'),
        password: 'qweerttyuuiop'
    };

    
    it('Should add a new user', (done) => {
        //#test: Registration
        chai
        .request(`http://127.0.0.1:${port}`)
        .post('/user/')
        .send({ 
            user_details: sampleUser, 
            password: sampleAuth.password 
        })
        .end((err, res) => {
            chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.have.all.keys('message', 'user', 'server_timestamp');
            chai.expect(res.body.user).to.have.all.keys('_id', 'name', 'gender', 'email', 'phone', 'createdAt', 'jwt_token');
            userToken = res.body.user.jwt_token;
            done();
        });
    });

    it('Should authenticate and login the user', (done) => {
        //#test: Login  
        chai
        .request(`http://127.0.0.1:${port}`)
        .post('/user/login')
        .send({ 
            auth: sampleAuth
        })
        .end((err, res) => {
            chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.have.all.keys('message', 'user', 'server_timestamp');
            chai.expect(res.body.user).to.have.all.keys('_id', 'name', 'gender', 'email', 'phone', 'createdAt', 'jwt_token');
            userToken = res.body.user.jwt_token;                
            done();
        });
    });

    //#test: Edit 
    it ('Should update a user account', (done) => {

        chai
        .request(`http://127.0.0.1:${port}`)
        .put('/user/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            auth: sampleAuth,
            updates: sampleUpdates
        })
        .end((err, res) => {
            chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.have.all.keys('message', 'done', 'timestamp');           
            done();
        });
    });

    //#test: remove
    it('Should disable a user account', (done) => {
        let authData: AuthData = <AuthData>{
            email: sampleUpdates.email,
            password: sampleUpdates.password,
            phone: sampleUser.phone
        };

         chai
        .request(`http://127.0.0.1:${port}`)
        .del('/user/')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
            auth: authData
        })
        .end((err, res) => {
            chai.expect(err).to.be.null
            chai.expect(res.status).to.eql(200);
            chai.expect(res).to.be.json;
            chai.expect(res.body).to.have.all.keys('message', 'done', 'timestamp');               
            done();
        });
    });
    
    after('Creator a user whose an author', (done) => {
		//# create a user
		 chai
		.request(`http://127.0.0.1:${port}`)
		.post('/user/')
		.send({ 
			user_details: authorUser, 
			password 
		})
		.end((err, res) => {
			done();
		});

	});

});