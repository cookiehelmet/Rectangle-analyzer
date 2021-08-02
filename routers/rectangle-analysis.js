const { get } = require('lodash')
const Router = require('koa-router')

class RectangleAnalysis extends Router {
  constructor (options) {
    super()
    this.logger = options.logger
    this.analyser = options.analyser
  }

  init (app) {
    this.post('/v1/rectangle-analysis', ctx => this.createAnalysis(ctx))
    app.use(this.routes())
  }

  async createAnalysis (ctx) {
    const payload = get(ctx, 'request.body')

    try {
      ctx.body = this.analyser.analyse(payload)
      ctx.status = 200
    } catch (err) {
      this.logger.warn(`Error occurred, ${err.message}`)
      ctx.body = err.message
      ctx.status = err.status || 500
    }
  }
}

module.exports = RectangleAnalysis
