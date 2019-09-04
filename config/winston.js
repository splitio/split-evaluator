const winston = require('winston');

const myFormat = winston.format.printf((info) => {
  if (info.error && info.error instanceof Error) {
    return `${info.level} - ${info.timestamp}: ${info.message} ${JSON.stringify(info.error)}`;
  }
  return `${info.level} - ${info.timestamp}: ${info.message}`;
});

const options = {
  console: {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json(),
      myFormat,
    ),
    colorize: true,
  },
};

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});

module.exports = logger;