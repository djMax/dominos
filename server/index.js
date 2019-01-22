require('@babel/register');

const Server = require('boardgame.io/server').Server;
const Dominos = require('../src/game').Dominos;
const server = Server({ games: [Dominos] });

const port = process.env.PORT || 8000
console.log('Starting server on', port);
server.run(port, () => {
  console.log('Ready');
});
