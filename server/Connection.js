const logger = require('pino')();
const EVENT = require('../src/common/event');

export default class Connection {
  static createConnection(client) {
    return new Connection(client);
  }

  constructor(client) {
    // Tell everyone about our new guest
    client.broadcast.emit(EVENT.NewConnection, client.id);
    logger.info('New connection', { id: client.id });

    client.emit(EVENT.ConnectionList, Object.values(Connection.connections)
      .map(({ id, state }) => ({ id, state })));
    Connection.connections[client.id] = { client, id: client.id };

    // This client has asked to send a broadcast message
    client.on(EVENT.Broadcast, (message) => {
      logger.info('Broadcast received', { id: client.id, message });
      if (message.type === 'announce') {
        Connection.connections[client.id].name = message.name;
      }
      client.broadcast.emit(EVENT.Broadcast, {
        id: client.id,
        message,
      });
    });

    // Update persistent values about this connection
    client.on(EVENT.StateUpdate, (state) => {
      const newState = {
        ...Connection.connections[client.id].state,
        ...state,
      };
      logger.info('State updated', {
        id: client.id,
        from: Connection.connections[client.id].state,
        to: newState });
      Connection.connections[client.id].state = newState;
      client.broadcast.emit(EVENT.StateUpdate, {
        id: client.id,
        state: newState,
      });
    })

    // This client has asked to send a message to a specific id
    client.on(EVENT.Message, (toId, message) => {
      if (Connection.connections[toId]) {
        logger.info('Message', { from: client.id, to: toId, message });
        Connection.connections[toId].client.emit(EVENT.Message, {
          id: client.id,
          message,
        });
      } else {
        logger.info('Message to non-existent id', { from: client.id, to: toId, message });
      }
    });

    // The client has disconnected
    client.on('disconnect', () => {
      logger.info('Disconnect', { id: client.id });
      delete Connection.connections[client.id];
      client.broadcast.emit(EVENT.Disconnect, client.id);
    });
  }
};

Connection.connections = {};

module.exports.Connection = Connection;
