const { format, createLogger, transports } = require('winston');
const { combine, errors, json, prettyPrint, timestamp, printf } = format;

function Logger() {
  const logFormat = printf(({ level, message, timestamp, stack }) => `${timestamp} ${level}: ${stack || message}`);

  return createLogger({
    format: combine(format.colorize(), timestamp(), prettyPrint(), errors({ stack: true }), logFormat),
    transports: [new transports.Console()]
  });
}

let logger = Logger();

module.exports = logger;
