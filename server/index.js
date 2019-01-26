const logger = require('pino')();
require('@babel/register');

const path = require('path');
const Server = require('@djmax/boardgame.io/server').Server;
const Dominos = require('../src/game').Dominos;
const Connection = require('./Connection').default;
const addHelpers = require('./helperApi').default;
const server = Server({ games: [Dominos], singlePort: true });

const port = Number(process.env.PORT || 8000);

logger.info('Starting server', { port });
server.run(port, () => {
  logger.info('Ready');
});

console.error('DB IS', server.app.context.db);
server.app._io.on('connection', (socket) => Connection.createConnection(socket));
server.app.use(require('koa-static')(path.join(__dirname, '..', 'build')));

addHelpers({ app: server.app });

process.on('unhandledRejection', error => {
  console.log(error);
});