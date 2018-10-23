import React from 'react';
import { Domino } from './domino';

export const Hand = ({ pieces, onClick, ...rest }) => {
  let finalHand = Array.isArray(pieces) ? pieces : Array(pieces).fill({ values: [undefined, undefined] });
  return (
    <div className="hand" {...rest}>
      {finalHand.map((p) => <Domino
        first={p.values[0]}
        second={p.values[1]}
        onClick={() => (onClick && onClick(p))}
      />)}
    </div>
  );
}