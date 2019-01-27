import React from 'react';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { Subscribe } from 'unstated';
import { Client } from '@djmax/boardgame.io/react';
import { withStyles, Button } from '@material-ui/core';
import { Dominos } from './game';
import DominoBoard from './components/board';
import MultiplayerContainer from './components/MultiplayerContainer';
import SignIn from './components/Signin';
import OrganizeGame from './components/OrganizeGame';

import 'isomorphic-fetch';
import './App.css';
import { sendMove } from './game/ai';
import { ApproveGame } from './components/approveGame';

const styles = {
  hidden: {
    display: 'none',
  },
};

async function apiCall(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
    credentials: 'same-origin',
  });
  return response.json().catch(e => e);
}

class DominoApp extends React.Component {
  clients = {}

  state = {}

  leave = async () => {
    this.setState({ gameID: null, credentials: null });
  }

  onApproval = async (approved) => {
    const { multiplayer } = this.props;
    const { players, gameID } = multiplayer.state.newGame;
    if (approved) {
      const playerID = String(players.indexOf(`human:${multiplayer.state.id}`));
      const join = await apiCall(`/games/Dominos/${gameID}/join`, {
        playerID,
        playerName: this.props.multiplayer.state.name,
      });
      this.setState({ gameID, players, playerID, credentials: join.playerCredentials }, () => {
        multiplayer.clearBroadcast();
      });
    } else {
      multiplayer.clearBroadcast();
    }
  }

  go = async (playersRaw) => {
    const players = playersRaw.map((p) => {
      if (p === 'human') {
        return `human:${this.props.multiplayer.state.id}`;
      }
      return p;
    });
    const { gameID } = await apiCall('/games/Dominos/create', { setupData: { players }, numPlayers: 4 });
    this.props.multiplayer.broadcast({
      type: 'NewGame',
      players,
      gameID,
    });
    const joinUrl = `/games/Dominos/${gameID}/join`;
    const playerID = String(playersRaw.indexOf('human'));
    const join = await apiCall(joinUrl, {
      playerID,
      playerName: this.props.multiplayer.state.name,
    });
    const aiCredentials = {};
    const aiPlayers = players
      .map((player, index) => ({ player, index }))
      .filter(p => !p.player.startsWith('human'));
    await Promise.all(aiPlayers.map(async ({ player, index}) => {
      // TODO pick a better player name
      const { playerCredentials } = await apiCall(joinUrl, { playerID: index, playerName: 'AI' });
      aiCredentials[index] = playerCredentials;
    }));
    const newState = { playerID, gameID, gameMaster: true, players: playersRaw, credentials: join.playerCredentials, aiCredentials };
    window.localStorage.setItem('dominos.currentGame', JSON.stringify(newState));
    this.setState(newState);
  }

  render() {
    const { multiplayer } = this.props;
    const { gameID, credentials, gameMaster, playerID } = this.state;

    if (gameID && !this.clients[gameID]) {
      const clientArgs = {
        game: Dominos,
        board: DominoBoard,
        multiplayer: { server: '' },
        debug: false,
        numPlayers: 4,
        enhancer: applyMiddleware(
          logger,
          ({ getState }) => next => action => {
            if (gameMaster && (action.type === 'SYNC' || action.type === 'UPDATE')) {
              const { currentPlayer } = action.state.ctx;
              const { players, aiCredentials } = this.state;
              if (!players[currentPlayer].startsWith('human')) {
                apiCall(`/games/Dominos/${gameID}/getHand`, {
                  playerID: currentPlayer,
                  credentials: aiCredentials[currentPlayer],
                }).then(({ hand }) => {
                  sendMove({
                    gameID,
                    multiplayer,
                    hand,
                    action,
                    players,
                    credentials: aiCredentials[currentPlayer],
                  });
                });
              }
            }
            return next(action);
          }),
      };
      this.clients[gameID] = Client(clientArgs);
    }
    const DominoClient = this.clients[gameID];

    if (multiplayer.state.newGame) {
      return <ApproveGame multiplayer={multiplayer} onComplete={this.onApproval} />;
    }

    return (
      <React.Fragment>
        {gameID ? <DominoClient playerID={playerID} gameID={gameID} credentials={credentials} /> : <OrganizeGame onReady={this.go}/> }
        {!multiplayer.state.name && <SignIn />}
        {gameID && <Button variant="contained" onClick={this.leave}>Leave Game</Button>}
      </React.Fragment>
    );
  }
}

class App extends React.Component {
  state = {
    selectedPlayer: 0,
  }

  changePlayer = (e, value) => {
    this.setState({ selectedPlayer: value });
  }

  render() {
    return (
      <Subscribe to={[MultiplayerContainer]}>
      {multiplayer => (
        <DominoApp multiplayer={multiplayer} />
      )}
      </Subscribe>
    );
  }
}
export default withStyles(styles)(App);
