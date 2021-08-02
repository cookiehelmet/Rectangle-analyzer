const RectangleAnalysis = require('../../routers/rectangle-analysis')
const sinon = require('sinon')
const { assert } = require('chai')

describe('RectangleAnalysis', () => {
  let rectangleAnalysis, logger, _logger, analyser, _analyser

  beforeEach(() => {
    logger = { warn () {} }
    _logger = sinon.mock(logger)
    analyser = { analyse () {} }
    _analyser = sinon.mock(analyser)

    rectangleAnalysis = new RectangleAnalysis({ logger, analyser })
  })

  afterEach(() => {
    _logger.verify()
    _analyser.verify()
  })

  describe('init', () => {
    it('should init', () => {
      rectangleAnalysis.init({ use () {} })
    })
  })

  describe('createAnalysis', () => {
    it('should handle create analysis request', () => {
      _analyser.expects('analyse').withArgs({ foo: 'bar' }).returns({ message: 'Containment' })

      const ctx = {
        request: {
          body: {
            foo: 'bar'
          }
        }
      }
      rectangleAnalysis.createAnalysis(ctx)

      assert.equal(ctx.status, 200)
      assert.deepEqual(ctx.body, { message: 'Containment' })
    })

    it('should handle bad requests', () => {
      const error = new Error('Bad request')
      error.status = 400
      _analyser.expects('analyse').withArgs({ foo: 'bar' }).throws(error)

      const ctx = {
        request: {
          body: {
            foo: 'bar'
          }
        }
      }
      rectangleAnalysis.createAnalysis(ctx)

      assert.equal(ctx.status, 400)
      assert.equal(ctx.body, 'Bad request')
    })

    it('should return 500 for unhandled errors', () => {
      const error = new Error('Server error')
      _analyser.expects('analyse').withArgs({ foo: 'bar' }).throws(error)
      _logger.expects('warn').returns()

      const ctx = {
        request: {
          body: {
            foo: 'bar'
          }
        }
      }
      rectangleAnalysis.createAnalysis(ctx)

      assert.equal(ctx.status, 500)
      assert.equal(ctx.body, 'Server error')
    })
  })
})
