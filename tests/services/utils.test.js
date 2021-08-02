const { assert } = require('chai')
const { makeError } = require('../../services/utils')

describe('utils', () => {
  it('should make error', () => {
    const err = makeError('I am an error', 400)
    assert.equal(err.message, 'I am an error')
    assert.equal(err.status, 400)
  })
})
