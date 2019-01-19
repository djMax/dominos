require('@babel/register');

const Server = require('boardgame.io/server').Server;
const Dominos = require('../src/game').Dominos;
const server = Server({ games: [Dominos] });

const port = process.env.PORT || 8000
server.run(port);
