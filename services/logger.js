const { transports, createLogger, format } = require('winston')

module.exports = (options) => {
  const { configs } = options
  const console = new transports.Console({
    level: 'debug',
    format: format.combine(format.timestamp(), format.simple())
  })

  // More transports can be added if necessary

  const logger = createLogger({
    defaultMeta: { environment: configs.environment },
    transports: [console]
  })

  return logger
}
