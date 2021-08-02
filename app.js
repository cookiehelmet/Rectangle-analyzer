const Koa = require('koa')
const app = new Koa()
const PORT = 8080
const bodyParser = require('koa-bodyparser')

const configs = require('./configs.json')
const logger = require('./services/logger')({ configs })

const Analyser = require('./services/analyzer')
const analyser = new Analyser()

const RectangleAnalysis = require('./routers/rectangle-analysis')
const rectangleAnalysis = new RectangleAnalysis({ configs, logger, analyser })

async function run () {
  app.use(bodyParser({ enableTypes: ['json'] }))
  rectangleAnalysis.init(app)

  app.listen(PORT)
  logger.verbose('App started')
}

run().catch(err => {
  logger.error('Uncaught error', err)
})
