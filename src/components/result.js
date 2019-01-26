import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@material-ui/core';
import { Domino } from './domino';

export default ({ winner, points, hands, onNext }) => {
  return (
    <Dialog
      open
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Game Over</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Player {winner} has won. Their team gets {points} points.
        </DialogContentText>
        <div className="hand" style={{ fontSize: 8 }}>
          {hands.map(d => (
            <Domino
              key={`${d.values[0]}-${d.values[1]}`}
              first={d.values[0]}
              second={d.values[1]}
            />
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onNext} color="primary" autoFocus>
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  );
};
