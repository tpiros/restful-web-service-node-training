const http = require('http');
const handler = require('./handler');
const { logger } = require('./logger');

const server = http.createServer(handler);
server.listen(3000, () => logger.info('Server is up on port 3000'));
