module.exports = () => {
  beforeEach(() => {
    console.log = function () {}
  })

  afterEach(() => {
    delete console.log
  })
}
