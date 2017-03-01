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
import { authData, newUser, password, updates} from './details';

import chaiHttp = require('chai-http');
// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] User Module', function () {
    
    let userToken: string; // authentication token details

    //#test: Registration
    it('Should add a new user', (done) => {

        chai
            .request(`http://127.0.0.1:${port}`)
            .post('/user/')
            .send({ 
                user_details: newUser, 
                password 
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

    //#test: Login    
    it('Should authenticate and login the user', (done) => {

        chai
            .request(`http://127.0.0.1:${port}`)
            .post('/user/login')
            .send({ 
                auth: authData
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
                auth: authData,
                updates
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
            email: updates.email,
            password: updates.password,
            phone: newUser.phone
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

});