import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './MultiplayerContainer';

export default class SignIn extends React.Component {
  state = {
  }

  render() {
    const { name } = this.state;

    return (
      <Subscribe to={[MultiplayerContainer]}>
        {multiplayer => (
          <Dialog
            open
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Log In</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter a nickname of your choosing. Do not impersonate someone else
                    and keep it appropriate for school.
                  </DialogContentText>
                  <TextField
                    onChange={({ target: { value }}) => this.setState({ name: value })}
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Nickname"
                    fullWidth
                    onKeyPress={(ev) => {
                      if (ev.key === 'Enter') {
                        multiplayer.signIn(this.state.name);
                      }
                    }}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => multiplayer.signIn(this.state.name)}
                    color="primary"
                    disabled={!name || name.length <= 2}
                  >
                    {name ? `I am ${name}` : '...' }
                  </Button>
                </DialogActions>
          </Dialog>
        )}
      </Subscribe>
    );
  }
}