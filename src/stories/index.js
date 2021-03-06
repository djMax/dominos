import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs/react';

import { Domino } from '../components/domino';
import { Hand } from '../components/hand';
import { PlayedTiles } from '../components/played-tiles';
import DominoBoard from '../components/board';

const dRange = { range: true, min: 0, max: 6, step: 1 };

function randomPiece() {
  return { values: [Math.floor(Math.random() * 6), Math.floor(Math.random() * 6)] };
}

storiesOf('Domino', module)
  .addDecorator(withKnobs)
  .add('standard domino', () =>
    <Domino
      first={number('First Number', 5, dRange)}
      second={number('Second Number', 6, dRange)}
      onClick={action('clicked')} />
  )
  .add('hidden domino', () =>
    <Domino onClick={action('clicked')} />
  );

storiesOf('Hand', module)
  .addDecorator(withKnobs)
  .add('player hand', () =>
    <Hand
      pieces={new Array(7).fill(true).map(() => randomPiece())}
    />
  )
  .add('other hand', () =>
    <Hand
      pieces={number('Pieces', 7)}
    />)
  .add('scaled hand', () =>
    <Hand
      style={{ fontSize: `${number('Scale', .75)}em` }}
      pieces={new Array(7).fill(true).map(() => randomPiece())}
    />
  )
  .add('left rotated hand', () =>
    <div style={{
      transform: 'rotate(-90deg)',
      bottom: 0,
      right: '30%',
      position: 'absolute',
      border: '1px solid black',
      transformOrigin: 'left bottom',
    }}>
      <Hand
        style={{ fontSize: `${number('Scale', .75)}em` }}
        pieces={new Array(7).fill(true).map(() => randomPiece())}
      />
    </div>
  )
  .add('right rotated hand', () =>
  <div style={{
    transform: 'rotate(90deg)',
    bottom: 0,
    right: '30%',
    position: 'absolute',
    border: '1px solid black',
    transformOrigin: 'right bottom',
  }}>
    <Hand
      style={{ fontSize: `${number('Scale', .75)}em` }}
      pieces={new Array(7).fill(true).map(() => randomPiece())}
    />
  </div>
);

function toValues(str) {
  const pieces = str.split(' ');
  return pieces.map((p) => {
    const pips = p.split(',');
    return { values: pips };
  });
}

const sampleGame = toValues('6,5 5,5 5,4 4,3 3,5 5,5 5,3 3,3 3,2 2,1 1,1 1,0 0,0 0,2 2,4 4,1 1,1 1,3 3,6 6,2 2,2 2,3 3,4 4,5 5,2 2,1');

storiesOf('Played Tiles', module)
    .add('double six starts', () =>
      <PlayedTiles root={{ values: [6, 6], by: 0, sequence: 1 }} />
    )
    .add('1 piece', () =>
      <PlayedTiles root={{ values: [3, 6], sequence: 1 }} />
    )
    .add('L piece', () =>
      <PlayedTiles
        root={{ values: [6, 6], sequence: 1 }}
        left={[{ values: [6, 1], sequence: 2 }]}
      />
    )
    .add('R piece', () =>
      <PlayedTiles
        root={{ values: [6, 6], sequence: 1 }}
        right={[{ values: [6, 1], sequence: 2}]}
      />
    )
    .add('R pieces', () =>
      <PlayedTiles
        root={{ values: [6, 6], sequence: 1 }}
        right={[{ values: [6, 3], sequence: 2 }, { values: [3, 2], sequence: 3 }]}
      />
    )
    .add('3 pieces', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        left={[{ values: [6, 1]}]}
        right={[{ values: [6, 3]}]}
      />
    )
    .add('3 pieces no double', () =>
      <PlayedTiles
        root={{ values: [6, 4] }}
        left={[{ values: [4, 1]}]}
        right={[{ values: [6, 3]}]}
      />
    )
    .add('all the dominoes left', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        left={sampleGame}
      />
    )
    .add('all the dominoes right', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        right={sampleGame.slice(0, 18)}
      />
    )
    .add('all the dominoes', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        left={sampleGame}
        right={sampleGame}
      />
    );


  function fakeContext(player) {
    return {
      currentPlayer: player,
    };
  }

  function fakeGame(player, numPieces) {
    const G = {
      pieces: [[6, 6]],
      players: [
        { hand: [[6, 5]] },
        { hand: [[6, 5]] },
        { hand: [[6, 5]] },
        { hand: [[6, 5]] },
      ]
    };
    return G;
  }

  storiesOf('Board', module)
    .add('one piece per, player 0 turn', () =>
      <DominoBoard ctx={fakeContext(0)} G={fakeGame(0, 1)} playerID={0}/>
    )