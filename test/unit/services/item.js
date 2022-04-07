// // required devDependencies
// const chai = require('chai')
// const chaiHttp = require('chai-http')
// const server = require('../../../src/index')
// const should = chai.should()
// // define model
// const { Item, User } = require('../../../src/models')

// chai.use(chaiHttp)

// describe('Stock Management', () => {
//   beforeEach(() => {
//     console.log = function () {}
//   })

//   afterEach(() => {
//     delete console.log
//   })

//   before((done) => {
//     // Empty table to avoid unique violation
//     Item.destroy({ where: {}, truncate: true })
//     User.destroy({ where: {}, truncate: true })
//     done()
//   })

//   let itemId

//   // Test create item
//   describe('/POST items', () => {
//     let userId

//     before(async (done) => {
//       const user = await User.create({
//         username: 'testuser1',
//         password: 'testeduser',
//         firstName: 'Test',
//         lastName: 'Distributor',
//         role: 'distributor',
//       })
//       userId = user.id
//       done()
//     })

//     it('create item with valid input', (done) => {
//       // Setup
//       const data = {
//         code: 'TST001',
//         name: 'Test Item 1',
//         description: 'This item is cool.',
//         picture: 'http://cdn.onlinewebfonts.com/svg/img_137275.png',
//         quantity: 20,
//         cogs: '100000.00',
//         normalPrice: '140000.00',
//         dealerPrice: '125000.00',
//         createdBy: userId,
//       }
//       // Exercise
//       chai
//         .request(server)
//         .post('/api/items')
//         .send(data)
//         .end((err, res) => {
//           // Verify
//           itemId = res.body.data.id
//           res.should.have.status(201)
//           res.body.should.be.a('object')
//           res.body.should.have.property('success')
//           res.body.success.should.equal(true)
//           res.body.should.have.property('message')
//           res.body.should.have.property('data')
//           res.body.data.should.equal(data)
//           done()
//         })
//     })
//   })

//   // Test get item
//   describe('/PUT items', () => {
//     it('update item with valid input', (done) => {
//       // Setup
//       const data = {
//         name: 'Test Item 1',
//         description: 'This item is really cool.',
//         quantity: 30,
//       }
//       // Exercise
//       chai
//         .request(server)
//         .post(`/api/items${itemId}`)
//         .send(data)
//         .end((err, res) => {
//           // Verify
//           res.should.have.status(201)
//           res.body.should.be.a('object')
//           res.body.should.have.property('success')
//           res.body.success.should.equal(true)
//           res.body.should.have.property('message')
//           res.body.should.have.property('data')
//           res.body.data.should.equal(data)
//           done()
//         })
//     })
//   })
// })
