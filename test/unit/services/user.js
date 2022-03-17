// required devDependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../index')
const should = chai.should()
// define model
const { User } = require('../../../src/models')

chai.use(chaiHttp)

describe('User Management', () => {
  // Test create user
  describe('/POST user', () => {
    beforeEach((done) => {
      // Empty table on every request
      User.destroy({ where: {}, truncate: true })
      console.log = function () {}
      done()
    })
    afterEach(() => {
      delete console.log
    })

    it('should create user with valid request', (done) => {
      // Setup
      const data = {
        id: '518846cc-6078-4a1c-9c00-bde23fe33b14',
        username: 'username1',
        password: 'password',
        first_name: 'User',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/user')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          res.body.data.should.have.property('username')
          res.body.data.should.have.property('first_name')
          res.body.data.should.have.property('role')
          done()
        })
    })
    // it('should not create user without username', () => {})
    // it('should not create user without password', () => {})
    // it('should not create user without first_name', () => {})
    // it('should notify when criteria is not fulfilled', () => {})
  })

  //   describe('/GET user', () => {})
  //   describe('/PATCH user', () => {})
  //   describe('/DELETE user', () => {})
})
