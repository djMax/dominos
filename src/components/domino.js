import React from 'react';
import './domino.css';

// Based on the excellent work at http://dominocodes.net/
const pips = [
  [],
  ['C135'],
  ['L23456', 'R23456'],
  ['L23456', 'C135', 'R23456'],
  ['L456', 'L23456', 'R23456', 'R456'],
  ['L456', 'L23456', 'C135', 'R23456', 'R456'],
  ['L456', 'L6', 'L23456', 'R6', 'R23456', 'R456']
];

function renderPips(num, prefix) {
  return (pips[Number(num)] || []).map(c => <span key={c} className={`${prefix}${c}`} />);
}

export const Domino = ({ first, second, ...rest }) => (
  <div className="domino" {...rest}>
    {renderPips(first, 'T')}
    {first !== undefined && <span className="line" />}
    {renderPips(second, 'B')}
  </div>
);
