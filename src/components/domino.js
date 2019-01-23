import React from 'react';
import classnames from 'classnames';
import { Tooltip } from '@material-ui/core';
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

function withTooltip(c, title) {
  return title ? <Tooltip title={title}>{c}</Tooltip> : c;
}

function ordinal(i) {
  var j = i % 10,
      k = i % 100;
  if (j === 1 && k !== 11) {
      return i + "st";
  }
  if (j === 2 && k !== 12) {
      return i + "nd";
  }
  if (j === 3 && k !== 13) {
      return i + "rd";
  }
  return i + "th";
}

export const Domino = ({ first, second, by, sequence, highlight, ...rest }) => withTooltip((
  <div className={classnames({ highlight })}>
    <div className="domino" {...rest}>
      {renderPips(first, 'T')}
      {first !== undefined && <span className="line" />}
      {renderPips(second, 'B')}
    </div>
  </div>
), sequence ? `Played ${ordinal(sequence)} by ${by}` : null);
