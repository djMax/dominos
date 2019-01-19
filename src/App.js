import React from 'react';
import logger from 'redux-logger';
import classnames from 'classnames';
import { applyMiddleware } from 'redux';
import { Client } from 'boardgame.io/react';
import { Tab, Tabs, AppBar, withStyles } from '@material-ui/core';
import { Dominos } from './game';
import { DominoBoard } from './components/board';
import ai from './game/ai';

import './App.css';

const DominoClient = Client({
  game: Dominos,
  board: DominoBoard,
  multiplayer: { server: 'http://localhost:8000' },
  debug: true,
  numPlayers: 4,
  enhancer: applyMiddleware(logger),
});

const styles = {
  hidden: {
    display: 'none',
  },
};

class App extends React.Component {
  state = {
    selectedPlayer: 0,
  }

  changePlayer = (e, value) => {
    this.setState({ selectedPlayer: value });
  }

  renderAllHands() {
    const { selectedPlayer } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <AppBar position="static">
          <Tabs value={selectedPlayer} onChange={this.changePlayer}>
            <Tab label="Player 1" />
            <Tab label="Player 2" />
            <Tab label="Player 3" />
            <Tab label="Player 4" />
          </Tabs>
        </AppBar>
        <div className={classnames({ [classes.hidden]: selectedPlayer !== 0 })}>
          <DominoClient playerID="0" />
        </div>
        <div className={classnames({ [classes.hidden]: selectedPlayer !== 1 })}>
          <DominoClient playerID="1" />
        </div>
        <div className={classnames({ [classes.hidden]: selectedPlayer !== 2 })}>
          <DominoClient playerID="2" />
        </div>
        <div className={classnames({ [classes.hidden]: selectedPlayer !== 3 })}>
          <DominoClient playerID="3" />
        </div>
      </div>
    );
  }

  renderOneHand() {
    const { selectedPlayer } = this.state;
    const { classes } = this.props;
    return (
      <div>
        <div className={classnames({ [classes.hidden]: selectedPlayer !== 0 })}>
          <DominoClient playerID="0" />
        </div>
      </div>
    );
  }

  render() {
    return this.renderOneHand();
  }
}
export default withStyles(styles)(App);
