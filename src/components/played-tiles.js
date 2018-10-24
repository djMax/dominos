import React from 'react';
import { Domino } from './domino';

import './played-tiles.css';

function isDouble(piece) {
  return piece.values[0] === piece.values[1];
}

function transformFor(piece, offsets, dir = 'left') {
  const mult = dir === 'left' ? 1 : -1;
  const ops = [`translate(${offsets[dir].x - 3}em,${offsets[dir].y - 6}em)`];
  if (!isDouble(piece) || offsets[dir].dir === 'v') {
    ops.push('rotate(90deg)');
    if (offsets[dir].dir === 'h') {
      offsets[dir].x += 12 * mult;
    }
  } else {
    if (offsets[dir].dir === 'h') {
      offsets[dir].x += -9 * mult;
    }
  }
  return {
    transform: ops.join(' '),
    transformOrigin: 'center center',
  };
}

export class PlayedTiles extends React.Component {
  render() {
    const { root, left, right } = this.props;
    const offsets = {
      left: { x: 0, y: 0, dir: 'h' },
      right: { x: 0, y: 0, dir: 'h' },
    };
    // Advance rightwards and leftwards for root piece (left happens later)
    transformFor(root, offsets, 'right');
    return (
      <div className="playspace">
        {root &&
        <div
          className="rootTile"
          style={transformFor(root, offsets)}
        >
          <Domino first={root.values[0]} second={root.values[1]} />
        </div>}
        {left && left.map(p =>
          <div style={transformFor(p, offsets)}>
            <Domino first={p.values[0]} second={p.values[1]} />
          </div>)}
        {right && right.map(p =>
          <div style={transformFor(p, offsets, 'right')}>
            <Domino first={p.values[1]} second={p.values[0]} />
          </div>)}
      </div>
    )
  }
}
