import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import { withKnobs, number } from '@storybook/addon-knobs/react';

import { Domino } from '../components/domino';
import { Hand } from '../components/hand';
import { PlayedTiles } from '../components/played-tiles';

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
  .add('rotated hand', () =>
    <div style={{
      transform: 'rotate(90deg)',
      border: '1px solid black',
      transformOrigin: 'left bottom',
    }}>
      <Hand
        style={{ fontSize: `${number('Scale', .75)}em` }}
        pieces={new Array(7).fill(true).map(() => randomPiece())}
      />
    </div>
  );

storiesOf('Played Tiles', module)
    .add('double six starts', () =>
      <PlayedTiles root={{ values: [6, 6] }} />
    )
    .add('1 piece', () =>
      <PlayedTiles root={{ values: [3, 6] }} />
    )
    .add('L piece', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        left={[{ values: [6, 1]}]}
      />
    )
    .add('R pieces', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        right={[{ values: [6, 3]}, { values: [3, 2] }]}
      />
    )
    .add('3 pieces', () =>
      <PlayedTiles
        root={{ values: [6, 6] }}
        left={[{ values: [6, 1]}]}
        right={[{ values: [6, 3]}]}
      />
    );