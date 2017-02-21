/**
 * created by waweru
 * @docs: testing if zushar-api server is running
*/

import * as chai from 'chai';
import { userModel } from '../src/users/UserSchema';
import * as _ from 'lodash';
import { default as promiseGlobal } from './promises_hack';
import { UserProfile } from '../src/users/UserModel';

// declare global.Promise to avoid error 
promiseGlobal();

import chaiHttp = require('chai-http');
// add plugin to chai
chai.use(chaiHttp);
let port: number = <number>(process.env.PORT || 3000);

describe('Zushar Api Server', function () {

    it('Should return information about server', function (done) {
        
        chai
            .request(`http://127.0.0.1:${port}`)
            .get('/')
            .end((err, res):void => {
                chai.expect(err).to.be.null
                chai.expect(res.status).to.eql(200);
                chai.expect(res).to.be.json;
                chai.expect(res.body).to.have.all.keys('name', 'version', 'message', 'timestamp');
                done();
            });
    });

    it('Should ensure database is functioning correctly', function (done) {
        let SampleUser: UserProfile = <UserProfile>{
            name: 'John Waweru',
            email: 'waweruj00@gmail.com',
            phone: '+254714224735',
            gender: 'male',
            password: 'metoyoupassword'
        };

        let newUser = new userModel(SampleUser);
        newUser.validate((err: Error) => {
            if (err) {
                throw err;
            }
            chai.expect(_.isNil(err)).to.be.true;
            done();
        });

    });

});