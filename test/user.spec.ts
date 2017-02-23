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
// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('[zushar-api] User Module Model', function () {
    
    let newUser: UserProfile = <UserProfile>{
        name: 'John Waweru',
        email: 'waweruj00@gmail.com',
        phone: '+254714224735',
        gender: 'male'
    };
    let password: string = 'metoyoupassword';
    let userToken: string = '';

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
    
    it('Should authenticate and login the user', (done) => {
        let authData: AuthData = <AuthData>{
            email: newUser.email,
            password: password,
            phone: newUser.phone
        };

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


    
});