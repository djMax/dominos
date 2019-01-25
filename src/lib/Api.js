import openSocket from 'socket.io-client';
import EVENT from '../common/event';

function callOptional(subscriber, method, ...args) {
  if (typeof subscriber[method] === 'function') {
    subscriber[method](...args);
  }
}

export default class Api {
  constructor() {
    this.playerState = {
      name: window.localStorage.getItem('player.name'),
    };
    this.socket = openSocket();
    this.socket.on('reconnect', () => {
      const name = window.localStorage.getItem('player.name');
      if (name) {
        this.socket.emit(EVENT.StateUpdate, this.playerState);
      }
    });
    this.socket.on('connect', () => {
      const name = window.localStorage.getItem('player.name');
      if (name) {
        this.socket.emit(EVENT.StateUpdate, this.playerState);
      }
    });
    this.socket.on('error', (e) => {
      console.error('Socket error', e);
    });
  }

  subscribe(subscriber) {
    console.log('Subscribing to socket');
    const fns = {
      [EVENT.NewConnection]: id => callOptional(subscriber, 'onNewConnection', id),
      [EVENT.Broadcast]: ({ id, message }) => callOptional(subscriber, 'onBroadcast', id, message),
      [EVENT.StateUpdate]: ({ id, state }) => callOptional(subscriber, 'onStateUpdate', id, state),
      [EVENT.Message]: ({ id, message }) => callOptional(subscriber, 'onMessage', id, message),
      [EVENT.Disconnect]: id => callOptional(subscriber, 'onDisconnect', id),
      [EVENT.ConnectionList]: ids => callOptional(subscriber, 'onConnectionList', ids),
    };
    Object.entries(fns).forEach(([eventName, fn]) => {
      this.socket.on(eventName, fn);
    });
    return fns;
  }

  unsubscribe(thunk) {
    console.log('Unsubscribing from socket');
    Object.entries(thunk || {}).forEach(([eventName, fn]) => {
      this.socket.off(eventName, fn);
    })
  }

  updateState(state) {
    this.playerState = {
      ...this.playerState,
      ...state,
    };
    this.socket.emit(EVENT.StateUpdate, state);
  }

  sendBroadcast(message) {
    this.socket.emit(EVENT.Broadcast, message);
  }

  sendMessage(id, message) {
    this.socket.emit(EVENT.Message, id, message);
  }

  sendRaw(message, args) {
    const tmp = openSocket(`/Dominos`);
    tmp.once('connect', () => {
      tmp.emit(message, ...args);
    });
  }

  disconnect() {
    console.error('Socket disconnecting');
    this.socket.disconnect();
    delete this.socket;
  }
}
