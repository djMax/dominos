import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from '@material-ui/core';

export const ApproveGame = ({ multiplayer, onComplete }) => (
  <Dialog
    open
    aria-labelledby="form-dialog-title">
    <DialogTitle id="form-dialog-title">Would You Join a Game?</DialogTitle>
    <DialogContent>
    </DialogContent>
    <DialogActions>
    <Button
        variant="contained"
        color="secondary"
        onClick={() => onComplete(false)}
      >
      No
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => onComplete(true)}
      >
      Yes
      </Button>
    </DialogActions>
  </Dialog>
);
