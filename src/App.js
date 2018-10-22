import React from 'react';
import { Client } from 'boardgame.io/react';
import { Dominos } from './game';

const DominoClient = Client({
  game: Dominos,
  multiplayer: { local: true },
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
