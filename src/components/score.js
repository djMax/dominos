import React from 'react';
import { withStyles } from '@material-ui/core';

const scoreTable = ({ classes, ns, ew }) => (
  <div>
    <table className={classes.root}>
      <thead>
        <tr><th colSpan={2}>Score</th></tr>
      </thead>
      <tbody>
        <tr><td>North/South</td><td>{ns}</td></tr>
        <tr><td>East/West</td><td>{ew}</td></tr>
      </tbody>
    </table>
  </div>
);

export default withStyles({
  root: {
    marginLeft: 20,
    marginTop: 20,
    width: 70,
    border: 'solid 1px #DDEEEE',
    borderCollapse: 'collapse',
    borderSpacing: 0,
    '& thead th': {
      backgroundColor: '#DDEFEF',
      border: 'solid 1px #DDEEEE',
      color: '#336B6B',
      padding: 10,
      textAlign: 'left',
      textShadow: '1px 1px 1px #fff',
    },
    '& tbody td': {
      border: 'solid 1px #DDEEEE',
      color: '#333',
      padding: 10,
      textShadow: '1px 1px 1px #fff'
    },
  },
})(scoreTable);