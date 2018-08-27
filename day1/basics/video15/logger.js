/* eslint import/no-extraneous-dependencies: ["error", {"devDependencies": true}] */
const winston = require('winston');

const myTimestamp = () => (new Date()).toLocaleString();
module.exports.logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      level: 'info',
      timestamp: myTimestamp,
      colorize: true,
    }),
    new winston.transports.File({
      filename: 'sample.log',
      timestamp: myTimestamp,
    }),
  ],
});
