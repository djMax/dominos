import React from 'react';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { Subscribe } from 'unstated';
import { Client } from '@djmax/boardgame.io/react';
import { withStyles, Button } from '@material-ui/core';
import { Dominos } from './game';
import { DominoBoard } from './components/board';
import MultiplayerContainer from './components/MultiplayerContainer';
import SignIn from './components/Signin';
import OrganizeGame from './components/OrganizeGame';

import 'isomorphic-fetch';
import './App.css';

const styles = {
  hidden: {
    display: 'none',
  },
};

class DominoApp extends React.Component {
  clients = {}

  state = {}

  leave = async () => {
    this.setState({ gameID: null, credentials: null });
  }

  go = async (playersRaw) => {
    const players = playersRaw.map((p) => {
      if (p === 'human') {
        return `human:${this.props.multiplayer.state.id}`;
      }
      return p;
    });
    const response = await fetch('/games/Dominos/create', {
      method: 'POST',
      body: JSON.stringify({ setupData: { players }, numPlayers: 4 }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    });
    const { gameID } = await response.json();
    const joinResponse = await fetch(`/games/Dominos/${gameID}/join`, {
      method: 'POST',
      body: JSON.stringify({
        playerID: playersRaw.indexOf('human'),
        playerName: this.props.multiplayer.state.name,
      }),
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    });
    const join = await joinResponse.json();
    this.setState({ gameID, gameMaster: true, players: playersRaw, credentials: join.playerCredentials });
  }

  render() {
    const { multiplayer, playerID } = this.props;
    const { gameID, credentials, gameMaster } = this.state;

    if (gameID && !this.clients[gameID]) {
      this.clients[gameID] = Client({
        game: Dominos,
        board: DominoBoard,
        multiplayer: { server: '' },
        debug: false,
        numPlayers: 4,
        enhancer: applyMiddleware(logger, ({ getState }) => next => action => {
          if (gameMaster && (action.type === 'SYNC' || action.type === 'UPDATE')) {
            const { currentPlayer } = action.state.ctx;
            const { players } = this.state;
            if (!players[currentPlayer].startsWith('human')) {
              console.error('Need to trigger a move for', currentPlayer, players[currentPlayer]);
            }
          }
          return next(action);
        }),
      })
    }
    const DominoClient = this.clients[gameID];

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
        <DominoApp multiplayer={multiplayer} playerID="0" />
      )}
      </Subscribe>
    );
  }
}
export default withStyles(styles)(App);
