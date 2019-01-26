import React from 'react';
import { Domino } from './domino';

import './hand.css';
import { PlayerHand } from '../model/PlayerHand';
import { Button } from '@material-ui/core';

function sorted(pieces) {
  return new PlayerHand(0, pieces).hand;
}

function defaultName(v) {
  switch (v) {
    case 'random':
      return 'AI (Random)';
    case 'highest':
      return 'AI (Highest Piece)';
    default:
      return '???';
  }
}

export const Hand = ({ pieces, id, multiplayer, onClick, onPass, ...rest }) => {
  let finalHand = Array.isArray(pieces) ? sorted(pieces) : Array(pieces).fill({ values: [undefined, undefined] });
  let name = defaultName(id);
  if (id.startsWith('human:')) {
    const mpId = id.substring('human:'.length);
    if (mpId === multiplayer.state.id) {
      name = multiplayer.state.name;
    } else {
      name = mpId;
    }
  }
  return (
    <div className="hand" {...rest}>
      {finalHand.map((p, ix) => <Domino
        key={JSON.stringify(p.values[0] ? p.values : ix)}
        first={p.values[0]}
        second={p.values[1]}
        onClick={() => (onClick && onClick(p))}
      />)}
      <div className="name">{name}</div>
      {onPass && <Button variant="contained" onClick={onPass}>
        Pass
      </Button>}
    </div>
  );
}