const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const disableConsole = require('../disableConsole')
const server = require('../../../src/index')
const { DailyReport, SoldItem, Transaction } = require('../../../src/models')

chai.use(chaiHttp)

describe('Daily Reports', () => {
  let buyerId

  disableConsole()
  before(async () => {
    await DailyReport.destroy({ where: {} })
    await Transaction.destroy({ where: {} })
    await SoldItem.destroy({ where: {} })

    const transaction = await Transaction.create({
      totalProducts: 2,
      totalQuantity: 3,
      subtotalPrice: 200000,
      totalPrice: 220000,
    })

    const now = new Date()
    const yesterday = new Date(now - 24 * 60 * 60 * 1000)
    const dailyReport = await DailyReport.create({ date: yesterday })

    await SoldItem.create({
      transactionId: transaction.id,
      dateId: dailyReport.id,
      quantity: 1,
      priceATT: 100000,
      cogsATT: 80000,
    })
    await SoldItem.create({
      transactionId: transaction.id,
      dateId: dailyReport.id,
      quantity: 2,
      priceATT: 50000,
      cogsATT: 30000,
    })
  })

  describe('/POST dailyReports', () => {
    it('should create empty daily report date', async () => {
      const res = await chai.request(server).post('/api/dailyReports/date')

      res.should.have.status(201)
      res.body.should.be.a('object')
      res.body.should.have.property('success')
      res.body.success.should.equal(true)
      res.body.should.have.property('message')
      res.body.message.should.equal('Successfully created daily report!')
      res.body.should.have.property('data')
      res.body.data.should.be.a('object')
      res.body.data.should.have.property('transactions')
      res.body.data.transactions.should.equal(0)
      res.body.data.should.have.property('soldItems')
      res.body.data.soldItems.should.equal(0)
      res.body.data.should.have.property('grossProfit')
      res.body.data.grossProfit.should.equal(0)
      res.body.data.should.have.property('totalCogs')
      res.body.data.totalCogs.should.equal(0)
    })

    it('should calculate daily report', async () => {
        const res = await chai.request(server).post('/api/dailyReports/calculate')

        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('success')
        res.body.success.should.equal(true)
        res.body.should.have.property('message')
        res.body.message.should.equal('Successfully updated daily report!')
        res.body.should.have.property('data')
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('transactions')
        res.body.data.transactions.should.equal(1)
        res.body.data.should.have.property('soldItems')
        res.body.data.soldItems.should.equal(3)
        res.body.data.should.have.property('grossProfit')
        res.body.data.grossProfit.should.equal(200000)
        res.body.data.should.have.property('totalCogs')
        res.body.data.totalCogs.should.equal(140000)
    })
  })

    describe('/GET dailyReports', () => {
      it('should return all daily reports', async () => {
        const res = await chai.request(server).get('/api/dailyReports')

        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('success')
        res.body.success.should.equal(true)
        res.body.should.have.property('message')
        res.body.message.should.equal('Successfully retrieved daily reports!')
        res.body.should.have.property('data')
        res.body.data.should.be.a('object')
        res.body.data.should.have.property('edge')
        res.body.data.edge.should.be.a('array')
        res.body.data.should.have.property('cursor')
        res.body.data.cursor.should.be.a('object')
      })
    })
})
