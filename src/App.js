import React from 'react';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { Subscribe } from 'unstated';
import { Client } from '@djmax/boardgame.io/react';
import { withStyles } from '@material-ui/core';
import { Dominos } from './game';
import { DominoBoard } from './components/board';
import MultiplayerContainer from './components/MultiplayerContainer';
import SignIn from './components/Signin';
import OrganizeGame from './components/OrganizeGame';

import './App.css';

const DominoClient = Client({
  game: Dominos,
  board: DominoBoard,
  multiplayer: { server: '' },
  debug: true,
  numPlayers: 4,
  enhancer: applyMiddleware(logger),
});

const styles = {
  hidden: {
    display: 'none',
  },
};

class DominoApp extends React.Component {
  state = {}

  go = (players) => {
    this.setState({ gameID: this.props.multiplayer.state.name });
  }

  render() {
    const { multiplayer, playerID } = this.props;
    const { gameID } = this.state;
    return (
      <React.Fragment>
        {gameID ? <DominoClient playerID={playerID} gameID={gameID} /> : <OrganizeGame onReady={this.go}/> }
        {!multiplayer.state.name && <SignIn />}
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
