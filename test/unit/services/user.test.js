const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const disableConsole = require('../disableConsole')
const server = require('../../../src/index')
const { User } = require('../../../src/models')

chai.use(chaiHttp)

describe('User Management', () => {
  disableConsole()
  before(async () => {
    User.destroy({ where: {} })
  })

  describe('/POST users', () => {
    it('should create user with valid request', async () => {
      const data = {
        username: 'testuser1',
        password: 'password',
        firstName: 'Test',
        lastName: 'One',
        role: 'admin',
      }
      const res = await chai.request(server).post('/api/users').send(data)

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created user!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('username')
      res.body.data.username.should.equal('testuser1')
      res.body.data.should.have.property('firstName')
      res.body.data.firstName.should.equal('Test')
      res.body.data.should.have.property('role')
      res.body.data.role.should.equal('admin')
    })

    it('should not create user without username', async () => {
      const data = {
        password: 'password',
        firstName: 'User',
        lastName: 'One',
        role: 'admin',
      }
      const res = await chai.request(server).post('/api/users').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create user without password', async () => {
      const data = {
        username: 'username2',
        firstName: 'User',
        lastName: 'One',
        role: 'admin',
      }
      const res = await chai.request(server).post('/api/users').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create user without firstName', async () => {
      const data = {
        username: 'username2',
        password: 'password',
        lastName: 'One',
        role: 'admin',
      }
      const res = await chai.request(server).post('/api/users').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should notify when criteria is not fulfilled', async () => {
      const data = {
        username: '!',
        password: 'a',
        firstName: 'User',
        lastName: 'One',
        role: 'admin',
      }
      const res = await chai.request(server).post('/api/users').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })
  })

  describe('/GET users', () => {
    let testId

    before(async () => {
      const user1 = await User.create({
        username: 'testGet1',
        password: 'password',
        firstName: 'Test',
        lastName: 'Get1',
        role: 'dealer',
      })
      const user2 = await User.create({
        username: 'testGet2',
        password: 'password',
        firstName: 'Test',
        lastName: 'Get2',
        role: 'distributor',
      })
      testId = user1.id
    })

    it('should return all users', async () => {
      const res = await chai.request(server).get('/api/users')

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved users!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('array')
    })

    it('should return one user when id is specified', async () => {
      const res = await chai.request(server).get(`/api/users/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved user!')
      res.body.should.have.property('data')
    })

    it('should notify if no user found', async () => {
      const res = await chai.request(server).get(`/api/users/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('User not found!')
    })
  })

  describe('/PUT users', () => {
    let testId

    before(async () => {
      const user = await User.create({
        username: 'testUpdate',
        password: 'password',
        firstName: 'Test',
        lastName: 'Update',
        role: 'dealer',
      })
      testId = user.id
    })

    it('should update user on valid request', async () => {
      const updateData = {
        password: 'updatepassword',
        firstName: 'Update',
        lastName: 'Test',
        role: 'admin',
      }
      const res = await chai
        .request(server)
        .put(`/api/users/${testId}`)
        .send(updateData)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.should.have.property('data')
    })

    it('should not update user with bad request', async () => {
      const updateData = {
        password: '',
        firstName: '',
        lastName: '',
        role: '',
      }
      const res = await chai
        .request(server)
        .put(`/api/users/${testId}`)
        .send(updateData)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.should.have.property('errors')
    })

    it('should notify if no user found', async () => {
      const updateData = {
        password: 'updatepassword',
        firstName: 'Update',
        lastName: 'Test',
        role: 'admin',
      }
      const res = await chai
        .request(server)
        .put(`/api/users/0`)
        .send(updateData)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('User not found!')
    })
  })

  describe('/DELETE users', () => {
    let testId

    before(async () => {
      const user = await User.create({
        username: 'testDelete',
        password: 'password',
        firstName: 'Test',
        lastName: 'Delete',
        role: 'dealer',
      })
      testId = user.id
    })

    it('should notify if no user found', async () => {
      const res = await chai.request(server).delete(`/api/users/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('User not found!')
    })

    it('should delete user with valid user id', async () => {
      const res = await chai.request(server).delete(`/api/users/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully deleted user!')
    })
  })
})
