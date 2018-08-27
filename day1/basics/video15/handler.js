const { logger } = require('./logger');

const handler = (request, response) => {
  request.on('error', (error) => {
    logger.error(error);
    response.statusCode = 400;
    response.end();
  });
  response.on('error', (err) => {
    logger.error(err);
  });

  if (request.url === '/favicon.ico') {
    return;
  }

  if (request.method === 'GET' && request.url === '/') {
    logger.info('Successful GET method for "/"');
    response.statusCode = 200;
    response.end('Hello from Node.js');
  } else {
    logger.warn('404 error');
    response.statusCode = 404;
    response.end();
  }
};

module.exports = handler;
