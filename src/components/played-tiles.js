import React from 'react';
import { Domino } from './domino';

import './played-tiles.css';

function isDouble(piece) {
  return piece && piece.values[0] === piece.values[1];
}

function transformFor(piece, offsets, dir) {
  if (!dir) {
    // Root piece
    if (isDouble(piece)) {
      offsets.left.x = -9;
      offsets.right.x = 9.6;
      return {
        zIndex: 29,
        transform: 'translate(-3em,-6em)',
      };
    }
    offsets.left.x = -12.5;
    offsets.right.x = 12.5;
    return {
      zIndex: 29,
      transform: 'rotate(90deg) translate(-6em,3em)',
    };
  }
  let rotate = 0;
  if (!isDouble(piece)) {
    rotate = 90 * (offsets[dir].flip ? -1 : 1);
  }
  // Do we fit in the same direction?
  const newXExtent = offsets[dir].x + (offsets[dir].multiplier * (isDouble(piece) ? 3 : 12));
  console.error('START AT', offsets[dir].x, 'CHECK TO', newXExtent);
  console.error('Layout', dir, offsets[dir], newXExtent, rotate);

  const ops = [];
  if (newXExtent > -40 && newXExtent < 40) {
    ops.push(`translate(${offsets[dir].x - 3}em,${offsets[dir].y - 6}em)`);
    offsets[dir].x = newXExtent;
  } else {
    // Otherwise we need to turn
    console.log('NEED TO TURN');
    offsets[dir].multiplier *= -1;
    offsets[dir].flip = !offsets[dir].flip;
    ops.push(`translate(${offsets[dir].x - .5}em,${offsets[dir].y - 8.5}em)`);
    offsets[dir].y -= 12;
    offsets[dir].x += 5;
    rotate = rotate ? 180 : 90;
  }

  if (rotate) {
    ops.push(`rotate(${rotate}deg)`);
  }
  offsets[dir].z -= 1;
  return {
    zIndex: offsets[dir].z,
    transform: ops.join(' '),
  };
}

export class PlayedTiles extends React.Component {
  render() {
    const { root, left, right } = this.props;
    const offsets = {
      left: { x: 0, y: 0, z: 29, multiplier: -1, flip: false },
      right: { x: 0, y: 0, z: 29, multiplier: 1, flip: false },
    };
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
          <div style={transformFor(p, offsets, 'left')}>
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
