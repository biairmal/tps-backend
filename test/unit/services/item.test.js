const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const disableConsole = require('../disableConsole')
const server = require('../../../src/index')
const { Item } = require('../../../src/models')

chai.use(chaiHttp)

describe('Stock Management', () => {
  disableConsole()
  before(async () => {
    Item.destroy({ where: {} })
  })

  describe('/POST items', () => {
    it('should create item with valid request', async () => {
      const data = {
        code: 'TEST001',
        name: 'Test Item 1',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      }
      const res = await chai.request(server).post('/api/items').send(data)

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created item!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('code')
      res.body.data.code.should.equal('TEST001')
      res.body.data.should.have.property('name')
      res.body.data.name.should.equal('Test Item 1')
      res.body.data.should.have.property('quantity')
      res.body.data.quantity.should.equal(20)
    })

    it('should not create item without code', async () => {
      const data = {
        name: 'Test Item 1',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      }
      const res = await chai.request(server).post('/api/items').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create item without name', async () => {
      const data = {
        code: 'TEST001',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      }
      const res = await chai.request(server).post('/api/items').send(data)

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
        code: '',
        name: '',
        description: '',
        quantity: null,
        cogs: null,
        normalPrice: null,
        dealerPrice: null,
      }
      const res = await chai.request(server).post('/api/items').send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })
  })

  describe('/GET item', () => {
    let testId

    before(async () => {
      const item1 = await Item.create({
        code: 'TEST002',
        name: 'Test Item 2',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      })
      const item2 = await Item.create({
        code: 'TEST003',
        name: 'Test Item 3',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      })
      testId = item1.id
    })

    it('should return all items', async () => {
      const res = await chai.request(server).get('/api/items')

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved items!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('edge')
      res.body.data.edge.should.be.a('array')
      res.body.data.should.have.property('cursor')
      res.body.data.cursor.should.be.a('object')
    })

    it('should return one item when id is specified', async () => {
      const res = await chai.request(server).get(`/api/items/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved item!')
      res.body.should.have.property('data')
    })

    it('should notify if no item found', async () => {
      const res = await chai.request(server).get(`/api/items/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Item not found!')
    })
  })

  describe('/PUT item', () => {
    let testId

    before(async () => {
      const item = await Item.create({
        code: 'TESTUPDATE',
        name: 'Test Item Update',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      })
      testId = item.id
    })

    it('should update item on valid request', async () => {
      const updateData = {
        name: 'Test Item Updated',
        quantity: 10,
        cogs: 110000,
      }
      const res = await chai
        .request(server)
        .put(`/api/items/${testId}`)
        .send(updateData)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.should.have.property('data')
    })

    it('should not update item with bad request', async () => {
      const updateData = {
        name: '',
        cogs: 110000,
      }
      const res = await chai
        .request(server)
        .put(`/api/items/${testId}`)
        .send(updateData)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.should.have.property('errors')
    })

    it('should notify if no item found', async () => {
      const updateData = {
        name: 'Test Item Updated',
        quantity: 10,
        cogs: 110000,
      }
      const res = await chai
        .request(server)
        .put(`/api/items/0`)
        .send(updateData)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Item not found!')
    })
  })

  describe('/DELETE item', () => {
    let testId

    before(async () => {
      const item = await Item.create({
        code: 'TESTDELETE',
        name: 'Test Item Delete',
        description: 'Test item.',
        quantity: 20,
        cogs: 100000,
        normalPrice: 140000,
        dealerPrice: 120000,
      })
      testId = item.id
    })

    it('should notify if no item found', async () => {
      const res = await chai.request(server).delete(`/api/items/0`)

      res.should.have.status(404)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Item not found!')
    })

    it('should delete item with valid item id', async () => {
      const res = await chai.request(server).delete(`/api/items/${testId}`)

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully deleted item!')
    })
  })
})
