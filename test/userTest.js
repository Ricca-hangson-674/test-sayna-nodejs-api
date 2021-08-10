import assert from 'assert'

import  chai from 'chai'
import  chaiHttp from 'chai-http'
import  server from '../server.js'
import faker from 'faker'
import bcrypt from 'bcryptjs'

let should = chai.should();

chai.use(chaiHttp)

/** Example */
describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal([1, 2, 3].indexOf(4), -1)
    })
  })
})

/** Users */
describe('Users', () => {

    /** Before test */
    /* beforeEach((done) => {
        User.remove({}, (err) => {
           done()
        })
    }) */

    /*
    * Test the /POST register route
    */
    describe('/POST register', () => {
        it('it should not POST a user without firstname field', (done) => {
            let user = {
                // firstname, 
                lastname       : "Last Name Test", 
                date_naissance : "12/08/1994",
                sexe           : "male",
                email          : "email@test.com", 
                password       : "password"
            }
              chai.request(server)
              .post('/register')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(401);
                    res.body.should.be.a('object')
                    res.body.should.have.property('error').eql(true)
                    res.body.should.have.property('message')
                done();
              });
        });

        it('it should POST a user ', (done) => {
            let user = {
                firstname       : `${faker.name.firstName()}${Date.now()}`,
                lastname        : faker.name.lastName(),
                sexe			      : faker.name.gender(),
                date_naissance  : faker.date.past(),
                email           : `${Date.now()}${faker.time.recent()}${faker.internet.email()}`,
                password 		    : bcrypt.hashSync('password', 10)
            }
              chai.request(server)
              .post('/register')
              .send(user)
              .end((err, res) => {
                    res.should.have.status(201);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error').eql(false)
                    res.body.should.have.property('message').eql("L'utilisateur a bien été créé avec succès")
                    res.body.should.have.property('tokens')
                    res.body.tokens.should.have.property('token')
                    res.body.tokens.should.have.property('refreshToken')
                    res.body.tokens.should.have.property('createdAt')
                done()
              })
        })
    })

    /*
    * Test the /POST login route
    */
    describe('/POST login', () => {
      it('Login with a email not exist', (done) => {
          let user = {
              email          : "NOTexistemail@test.com", 
              password       : "password"
          }
            chai.request(server)
            .post('/login')
            .send(user)
            .end((err, res) => {
                  res.should.have.status(401);
                  res.body.should.be.a('object')
                  res.body.should.have.property('error').eql(true)
                  res.body.should.have.property('message')
              done()
            })
      })
    })
})