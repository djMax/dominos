import React from 'react';
import { Client } from 'boardgame.io/react';
import { Dominos } from './game';
import { DominoBoard } from './components/board';

import './App.css';

const DominoClient = Client({
  game: Dominos,
  board: DominoBoard,
  multiplayer: { local: true },
  numPlayers: 4,
});

const App = () => (
  <div>
    <DominoClient playerID="0" />
    <DominoClient playerID="1" />
    <DominoClient playerID="2" />
    <DominoClient playerID="3" />
  </div>
);

export default App;
