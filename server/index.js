require('@babel/register');

const path = require('path');
const Server = require('@djmax/boardgame.io/server').Server;
const Dominos = require('../src/game').Dominos;
const server = Server({ games: [Dominos], singlePort: true });

const port = Number(process.env.PORT || 8000);
console.log('Starting server on', port);
server.run(port, () => {
  console.log('Ready');
});
server.app.use(require('koa-static')(path.join(__dirname, '..', 'build')));
