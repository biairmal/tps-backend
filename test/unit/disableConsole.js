module.exports = () => {
  before((done) => {
    console.log = function () {}
    done()
  })

  after((done) => {
    delete console.log
    done()
  })
}
