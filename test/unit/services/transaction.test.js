const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const disableConsole = require('../disableConsole')
const server = require('../../../src/index')
const { Transaction, Buyer, Item } = require('../../../src/models')

chai.use(chaiHttp)

describe('Transactions', () => {
  let buyerTestId
  let itemIds = []

  disableConsole()
  before(async () => {
    await Transaction.destroy({ where: {} })
    await Buyer.destroy({ where: {} })
    await Item.destroy({ where: {} })

    const buyer = await Buyer.create({
      name: 'Test Buyer',
      phone: '081122334455',
      email: 'testbuyer@gmail.com',
      address: 'Test Street 12',
      city: 'Test City',
      country: 'Test Country',
    })
    buyerTestId = buyer.id
    const item1 = await Item.create({
      code: 'TEST001',
      name: 'Test Item 1',
      description: 'Test item.',
      quantity: 50,
      cogs: 100000,
      normalPrice: 140000,
      dealerPrice: 120000,
    })
    const item2 = await Item.create({
      code: 'TEST002',
      name: 'Test Item 2',
      description: 'Test item 2.',
      quantity: 50,
      cogs: 220000,
      normalPrice: 250000,
      dealerPrice: 235000,
    })
    itemIds.push(item1.id)
    itemIds.push(item2.id)
  })

  describe('/POST transactions', async () => {
    it('should create transaction with new buyer', async () => {
      const data = {
        buyer: {
          name: 'New Buyer',
          phone: '081122334455',
          email: 'newbuyer@gmail.com',
          address: 'Test Street 12',
          city: 'Test City',
          country: 'Test Country',
          customerType: 'dealer',
        },
        items: [
          { id: itemIds[0], quantity: 2 },
          { id: itemIds[1], quantity: 1 },
        ],
      }

      const res = await chai
        .request(server)
        .post('/api/transactions')
        .send(data)

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created transaction!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('totalProducts')
      res.body.data.totalProducts.should.equal(2)
      res.body.data.should.have.property('totalQuantity')
      res.body.data.totalQuantity.should.equal(3)
      res.body.data.should.have.property('subtotalPrice')
      res.body.data.subtotalPrice.should.equal(475000)
      res.body.data.should.have.property('totalPrice')
      res.body.data.totalPrice.should.equal(522500)
      res.body.data.should.have.property('buyerId')
    })

    it('should create transaction with existing buyer', async () => {
      const data = {
        buyer: {
          id: buyerTestId,
          customerType: 'dealer',
        },
        items: [
          { id: itemIds[0], quantity: 2 },
          { id: itemIds[1], quantity: 1 },
        ],
      }

      const res = await chai
        .request(server)
        .post('/api/transactions')
        .send(data)

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created transaction!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('totalProducts')
      res.body.data.totalProducts.should.equal(2)
      res.body.data.should.have.property('totalQuantity')
      res.body.data.totalQuantity.should.equal(3)
      res.body.data.should.have.property('subtotalPrice')
      res.body.data.subtotalPrice.should.equal(475000)
      res.body.data.should.have.property('totalPrice')
      res.body.data.totalPrice.should.equal(522500)
      res.body.data.should.have.property('buyerId')
    })

    it('should not create transaction without items', async () => {
      const data = {
        buyer: {
          id: buyerTestId,
        },
        items: [],
        customerType: 'dealer',
        notes: 'Notes',
      }

      const res = await chai
        .request(server)
        .post('/api/transactions')
        .send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create transaction without buyer', async () => {
      const data = {
        items: [
          { id: itemIds[0], quantity: 2 },
          { id: itemIds[1], quantity: 1 },
        ],
        customerType: 'dealer',
        notes: 'Notes',
      }

      const res = await chai
        .request(server)
        .post('/api/transactions')
        .send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })

    it('should not create transaction with insufficient buyer info', async () => {
      const data = {
        buyer: {
          email: 'newbuyer@gmail.com',
          address: 'Test Street 12',
          city: 'Test City',
          country: 'Test Country',
        },
        items: [
          { id: itemIds[0], quantity: 2 },
          { id: itemIds[1], quantity: 1 },
        ],
        customerType: 'dealer',
        notes: 'Notes',
      }

      const res = await chai
        .request(server)
        .post('/api/transactions')
        .send(data)

      res.should.have.status(400)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(false)
      res.body.should.have.property('message')
      res.body.message.should.equal('Bad request!')
      res.body.should.have.property('errors')
    })
  })

  describe('/GET transactions', () => {
    it('should return all items', async () => {
      const res = await chai.request(server).get('/api/transactions')

      res.should.have.status(200)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully retrieved transactions!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('edge')
      res.body.data.edge.should.be.a('array')
      res.body.data.should.have.property('cursor')
      res.body.data.cursor.should.be.a('object')
    })
  })
})
