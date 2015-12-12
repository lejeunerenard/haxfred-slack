let onError = require('../lib/onerror')

describe('onError', () => {
  it('calls console.error with the error', () => {
    sandbox.stub(console, 'error')

    onError('error message')

    expect(console.error).to.be.calledWith('error message')
  })
})
