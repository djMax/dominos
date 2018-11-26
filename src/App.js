import React from 'react';
import logger from 'redux-logger';
import { applyMiddleware } from 'redux';
import { Client } from 'boardgame.io/react';
import { Dominos } from './game';
import { DominoBoard } from './components/board';

import 'semantic-ui-css/semantic.min.css';
import './App.css';
import { Tab } from 'semantic-ui-react';

const DominoClient = Client({
  game: Dominos,
  board: DominoBoard,
  multiplayer: { local: true },
  numPlayers: 4,
  enhancer: applyMiddleware(logger),
});

const App = () => (
  <div>
    <Tab panes={[
      { menuItem: 'Player 1', render: () => <DominoClient playerID="0" /> },
      { menuItem: 'Player 2', render: () => <DominoClient playerID="1" /> },
      { menuItem: 'Player 3', render: () => <DominoClient playerID="2" /> },
      { menuItem: 'Player 4', render: () => <DominoClient playerID="3" /> },
    ]} />
  </div>
);

export default App;
