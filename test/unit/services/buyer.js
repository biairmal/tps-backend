// required devDependencies
const chai = require('chai')
const chaiHttp = require('chai-http')
const server = require('../../../src/index')
const should = chai.should()
// define model
const { Buyer } = require('../../../src/models')

const disableConsole = require('../disableConsole')

chai.use(chaiHttp)

describe('Buyer Management', () => {
  disableConsole()
  before((done) => {
    // Empty table to avoid unique violation
    Buyer.destroy({ where: {}, truncate: true })
    done()
  })

  // Test create buyer
  describe('/POST buyers', () => {
    it('should create buyer with valid request', (done) => {
      // Setup
      const data = {
        name: 'Buyer Test',
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/buyers')
        .send(data)
        .end((err, res) => {
          // Verify
          res.should.have.status(201)
          res.body.should.be.a('object')
          res.body.should.have.property('success')
          res.body.success.should.equal(true)
          res.body.should.have.property('message')
          res.body.should.have.property('data')
          res.body.data.should.have.property('name')
          res.body.data.should.have.property('phone')
          res.body.data.should.have.property('email')
          res.body.data.should.have.property('address')
          done()
        })
    })

    it('should not create buyer without name', (done) => {
      // Setup
      const data = {
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/buyers')
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

    it('should not create buyer without phone', (done) => {
      // Setup
      const data = {
        name: 'Buyer Test',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      }
      // Exercise
      chai
        .request(server)
        .post('/api/buyers')
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

  describe('/GET buyers', () => {
    let testId

    before(async () => {
      const buyer1 = await Buyer.create({
        name: 'Buyer Test',
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      })
      const buyer2 = await Buyer.create({
        name: 'Buyer Test',
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      })

      testId = buyer1.id
    })

    it('should return all buyers', (done) => {
      // Exercise
      chai
        .request(server)
        .get('/api/buyers')
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

    it('should return one buyer when id is specified', (done) => {
      // Exercise
      chai
        .request(server)
        .get(`/api/buyers/${testId}`)
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

    it('should notify if no buyer found', (done) => {
      // Exercise
      chai
        .request(server)
        .get(`/api/buyers/0`)
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

  describe('/PUT buyers', () => {
    let testId

    before(async () => {
      const buyer = await Buyer.create({
        name: 'Buyer Test',
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      })

      testId = buyer.id
    })

    it('should update buyer on valid request', (done) => {
      // Setup
      const updateData = {
        password: 'updatepassword',
        firstName: 'Update',
        lastName: 'Test',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/buyers/${testId}`)
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

    it('should not update buyer with bad request', (done) => {
      // Setup
      const updateData = {
        password: '',
        firstName: '',
        lastName: '',
        role: '',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/buyers/${testId}`)
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

    it('should notify if no buyer found', (done) => {
      // Setup
      const updateData = {
        password: 'updatepassword',
        firstName: 'Update',
        lastName: 'Test',
        role: 'admin',
      }
      // Exercise
      chai
        .request(server)
        .put(`/api/buyers/0`)
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

  describe('/DELETE buyers', () => {
    let testId

    before(async () => {
      const buyer = await Buyer.create({
        name: 'Buyer Test',
        phone: '081212341234',
        email: 'buyertest@mail.com',
        address: 'Automated City, Test Province',
      })

      testId = buyer.id
    })

    it('should notify if no buyer found', (done) => {
      // Exercise
      chai
        .request(server)
        .delete(`/api/buyers/0`)
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

    it('should delete buyer with valid buyer id', (done) => {
      // Exercise
      chai
        .request(server)
        .delete(`/api/buyers/${testId}`)
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
