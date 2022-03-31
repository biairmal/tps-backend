// required devDependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../src/index')
const should = chai.should()
// define model
const { User } = require('../../../src/models')

chai.use(chaiHttp)

describe('User Management', () => {
  beforeEach(() => {
    console.log = function () {}
  })

  afterEach(() => {
    delete console.log
  })

  before((done) => {
    // Empty table to avoid unique violation
    User.destroy({ where: {}, truncate: true })
    done()
  })

  // Test create user
  describe('/POST user', () => {
    it('should create user with valid request', (done) => {
      // Setup
      const data = {
        username: 'username1',
        password: 'password',
        first_name: 'User',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/users')
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
    it('should not create user without username', (done) => {
      // Setup
      const data = {
        password: 'password',
        first_name: 'User',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('should not create user without password', (done) => {
      // Setup
      const data = {
        username: 'username2',
        first_name: 'User',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('should not create user without first_name', (done) => {
      // Setup
      const data = {
        username: 'username2',
        password: 'password',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('should notify when criteria is not fulfilled', (done) => {
      // Setup
      const data = {
        username: '!',
        password: 'a',
        first_name: 'User',
        last_name: 'One',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/users')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  describe('/GET user', () => {
    before((done) => {
      User.create({
        username: 'username2',
        password: 'password',
        first_name: 'User',
        last_name: 'Two',
        role: 'dealer',
      })
      User.create({
        username: 'username3',
        password: 'password',
        first_name: 'User',
        last_name: 'Three',
        role: 'distributor',
      })
      done()
    })

    let testId

    it('should return all users', (done) => {
      // Exercise
      chai
        .request(server)
        .get('/api/users')
        .end((err, res) => {
          // Verify
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          res.body.data.should.be.a('array')
          testId = res.body.data[0].id
          done()
        })
    })
    it('should return one user when id is specified', (done) => {
      // Exercise
      chai
        .request(server)
        .get(`/api/users/${testId}`)
        .end((err, res) => {
          // Verify
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          done()
        })
    })
    it('should notify if no user found', (done) => {
      // Exercise
      chai
        .request(server)
        .get(`/api/users/0`)
        .end((err, res) => {
          // Verify
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/PUT user', () => {
    let testId

    before((done) => {
      User.findAll().then((data) => {
        testId = data[0].id
        done()
      })
    })

    it('should update user on valid request', (done) => {
      // Setup
      const updateData = {
        password: 'updatepassword',
        first_name: 'Update',
        last_name: 'Test',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/users/${testId}`)
        .send(updateData)
        .end((err, res) => {
          // Verify
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          done()
        })
    })
    it('should not update user with bad request', (done) => {
      // Setup
      const updateData = {
        password: '',
        first_name: '',
        last_name: '',
        role: '',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/users/${testId}`)
        .send(updateData)
        .end((err, res) => {
          // Verify
          res.should.have.status(400)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('should notify if no user found', (done) => {
      // Setup
      const updateData = {
        password: 'updatepassword',
        first_name: 'Update',
        last_name: 'Test',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/users/0`)
        .send(updateData)
        .end((err, res) => {
          // Verify
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
  })
  describe('/DELETE user', () => {
    let testId

    before((done) => {
      const user = User.build({
        username: 'usernameDelete',
        password: 'password',
        first_name: 'User',
        last_name: 'Delete',
        role: 'dealer',
      })

      user.save().then(() => {
        testId = user.id
        done()
      })
    })

    it('should notify if no user found', (done) => {
      // Exercise
      chai
        .request(server)
        .delete(`/api/users/0`)
        .end((err, res) => {
          // Verify
          res.should.have.status(404)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(false)
          res.body.should.have.property('message')
          res.body.should.have.property('errors')
          done()
        })
    })
    it('should delete user with valid user id', (done) => {
      // Exercise
      chai
        .request(server)
        .delete(`/api/users/${testId}`)
        .end((err, res) => {
          // Verify
          res.should.have.status(200)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          done()
        })
    })
  })
})
