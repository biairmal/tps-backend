const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const disableConsole = require('../disableConsole')
const server = require('../../../src/index')
const { Buyer } = require('../../../src/models')

chai.use(chaiHttp)

describe('Buyer Management', () => {
  disableConsole()
  before(async () => {
    Buyer.destroy({ where: {} })
  })

  describe('/POST buyers', () => {
    it('should create buyer with valid request', async () => {
      const data = {
        name: 'Test Buyer',
        phone: '081122334455',
        email: 'testbuyer@gmail.com',
        address: 'Test Street 12',
        city: 'Test City',
        country: 'Test Country'
      }
      const res = await chai.request(server).post('/api/buyers').send(data)

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created buyer!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('name')
      res.body.data.name.should.equal('Test Buyer')
      res.body.data.should.have.property('phone')
      res.body.data.phone.should.equal('081122334455')
    })

    it('should not create buyer without name', async () => {
      const data = {
        phone: '081122334455',
      }
      const res = await chai.request(server).post('/api/buyers').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create buyer without phone', async () => {
      const data = {
        name: 'Test Buyer',
      }
      const res = await chai.request(server).post('/api/buyers').send(data)

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
        name: 'Test Buyer 2',
        phone: '12310391238103913',
      }
      const res = await chai.request(server).post('/api/buyers').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })
  })

  describe('/GET buyers', () => {
    let testId

    before(async () => {
      const buyer1 = await Buyer.create({
        name: 'Test Buyer 2',
        phone: '081122334456',
        email: 'testbuyer2@gmail.com',
        address: 'Test Street 12',
        city: 'Test City',
        country: 'Test Country'
      })
      const buyer2 = await Buyer.create({
        name: 'Test Buyer 3',
        phone: '081122334457',
        email: 'testbuyer3@gmail.com',
        address: 'Test Street 12',
        city: 'Test City',
        country: 'Test Country'
      })
      testId = buyer1.id
    })

    it('should return all buyers', async () => {
      const res = await chai.request(server).get('/api/buyers')

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved buyers!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('array')
    })

    it('should return one buyer when id is specified', async () => {
      const res = await chai.request(server).get(`/api/buyers/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved buyer!')
      res.body.should.have.property('data')
    })

    it('should notify if no buyer found', async () => {
      const res = await chai.request(server).get(`/api/buyers/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Buyer not found!')
    })
  })

  describe('/PUT buyers', () => {
    let testId

    before(async () => {
      const buyer = await Buyer.create({
        name: 'Test Buyer Update',
        phone: '081122334457',
        email: 'testbuyerupdate@gmail.com',
        address: 'Test Street 12',
        city: 'Test City',
        country: 'Test Country'
      })
      testId = buyer.id
    })

    it('should update buyer on valid request', async () => {
      const updateData = {
        name: 'Test Buyer Updated',
        address: 'Updated Street 12',
        city: 'Updated City',
        country: 'Updated Country'
      }
      const res = await chai
        .request(server)
        .put(`/api/buyers/${testId}`)
        .send(updateData)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.should.have.property('data')
    })

    it('should not update buyer with bad request', async () => {
      const updateData = {
        name: '',
        phone: '',
      }
      const res = await chai
        .request(server)
        .put(`/api/buyers/${testId}`)
        .send(updateData)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.should.have.property('errors')
    })

    it('should notify if no buyer found', async () => {
      const updateData = {
        password: 'updatepassword',
        firstName: 'Update',
        lastName: 'Test',
        role: 'admin',
      }
      const res = await chai
        .request(server)
        .put(`/api/buyers/0`)
        .send(updateData)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Buyer not found!')
    })
  })

  describe('/DELETE buyers', () => {
    let testId

    before(async () => {
      const buyer = await Buyer.create({
        name: 'Test Buyer Delete',
        phone: '081122334458',
        email: 'testbuyerdelete@gmail.com',
        address: 'Test Street 12',
        city: 'Test City',
        country: 'Test Country'
      })
      testId = buyer.id
    })

    it('should notify if no buyer found', async () => {
      const res = await chai.request(server).delete(`/api/buyers/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Buyer not found!')
    })

    it('should delete buyer with valid buyer id', async () => {
      const res = await chai.request(server).delete(`/api/buyers/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully deleted buyer!')
    })
  })
})
