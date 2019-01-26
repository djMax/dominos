import React from 'react';
import { Domino } from './domino';

import './played-tiles.css';
import { Layout } from '../lib/layout';

function isDouble(piece) {
  return piece && piece.values[0] === piece.values[1];
}

// Combine this into some better object
function isSamePiece(p1, p2) {
  if (p1.values[0] === p2.values[0] && p1.values[1] === p2.values[1]) {
    return true;
  }
  if (p1.values[1] === p2.values[0] && p1.values[0] === p2.values[1]) {
    return true;
  }
  return false;
}

const DominoPiece = ({ piece, maxSequence, isRight, onClick }) => (
  <Domino
    first={piece.values[isRight ? 1 : 0]}
    second={piece.values[isRight ? 0 : 1]}
    by={Number(piece.by) + 1}
    sequence={piece.sequence}
    highlight={piece.sequence === maxSequence}
    onClick={() => onClick(piece)}
  />
);

export class PlayedTiles extends React.Component {
  onClick = (piece) => {
    const { onEndClick, root, left, right } = this.props;
    if (left.length && isSamePiece(piece, left[left.length - 1])) {
      onEndClick(piece, 'left');
    }
    if (right.length && isSamePiece(piece, right[right.length - 1])) {
      onEndClick(piece, 'right');
    }
    if (isSamePiece(piece, root)) {
      if (left.length === 0) {
        onEndClick(piece, 'left');
      } else if (right.length === 0) {
        onEndClick(piece, 'right');
      }
    }
  }

  render() {
    const { root, left, right } = this.props;

    const rootTransform = { zIndex: 29 };
    const start = { y: -6, rx: 0, lx: 0 };
    const maxSequence = root ? [root, ...left || [], ...right || []].reduce((prev, cur) => Math.max(prev, cur.sequence), 0) : 0;

    if (isDouble(root)) {
      rootTransform.transform = 'translate(-2em,-3em)';
      Object.assign(start, { rx: 7.6, lx: 1, y: -3 });
    } else {
      rootTransform.transform = 'rotate(90deg) translate(-3em,0em)';
      Object.assign(start, { rx: 12.5, lx: -0.5, y: -3 });
    }

    const leftLayout = new Layout({ left: true, max: 45, up: true, x: start.lx, y: start.y });
    const rightLayout = new Layout({ left: false, max: 45, up: false, x: start.rx, y: start.y });
    return (
      <div className="playspace">
        {root &&
        <div
          className="rootTile"
          style={rootTransform}
        >
          <DominoPiece piece={root} maxSequence={maxSequence} isRight onClick={this.onClick} />
        </div>}
        {left && left.map(p =>
          <div key={p.values.join('-')} style={leftLayout.getTransform(p)}>
            <DominoPiece piece={p} maxSequence={maxSequence} onClick={this.onClick} />
          </div>)}
        {right && right.map(p =>
          <div style={rightLayout.getTransform(p)}>
            <DominoPiece piece={p} maxSequence={maxSequence} isRight onClick={this.onClick} />
          </div>)}
      </div>
    )
  }
}
