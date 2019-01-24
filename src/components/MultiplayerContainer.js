import { Container } from 'unstated';
import Api from '../lib/Api';

let api;
let subs;

export default class MultiplayerContainer extends Container {
  state = {
    others: {},
    name: window.localStorage.getItem('player.name'),
  }

  constructor(props = {}) {
    super();
    if (!api) {
      api = new Api();
      subs = api.subscribe(this);
    }
  }

  tearDownApi = () => {
    if (api) {
      api.unsubscribe(subs);
      api = null;
    }
  }

  signIn = (name) => {
    window.localStorage.setItem('player.name', name);
    api.updateState({ name });
    this.setState({ name });
  }

  signOut = () => this.setState({ name: null })

  newCode = (game, code) => {
    api.updateState({ [game]: code });
  }

  async onStateUpdate(id, playerState) {
    const { others } = this.state;
    await this.setState({
      others: {
        [id]: {
          ...others[id],
          ...playerState,
        },
      },
    });
  }

  onBroadcast(id, message) {
    switch (message.type) {
      default:
        console.log('Unknown message', message);
        break;
    }
  }

  onConnectionList(idAndStateArray) {
    const { others } = this.state;
    const updatedOthers = {};
    idAndStateArray.forEach(({ id, state }) => {
      updatedOthers[id] = {
        ...others[id],
        ...state,
      };
    });
    this.setState({ id: api.socket.id, others: updatedOthers });
  }

  onNewGame({ gameID, players }) {
    console.log('NEW GAME');
  }
}