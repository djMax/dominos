import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions, Button, withStyles, Select, MenuItem } from '@material-ui/core';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './MultiplayerContainer';

const PlayerMenu = ({ value, onChange, index, multiplayer }) => (
  <Select
    displayEmpty
    value={value}
    onChange={({ target: { value } }) => onChange(index, value)}
    inputProps={{
      name: `player${index}`,
      id: `player${index}-simple`,
    }}
  >
  <MenuItem value="human">
    <em>{multiplayer.state.name}</em>
  </MenuItem>
  <MenuItem value="random">
    <em>AI Random</em>
  </MenuItem>
  {Object.entries(multiplayer.state.others)
    .filter(([id, s]) => s.tictactoe)
    .map(([id, { name }]) => (
      <MenuItem key={id} value={`human:${name}`}>{name}'s code</MenuItem>
    ))}
  {Object.entries(multiplayer.state.others)
    .filter(([id, s]) => s.tictactoe)
    .map(([id, { name, dominos }]) => (
      <MenuItem key={id} value={`code:${dominos}`}>{name}</MenuItem>
    ))}
</Select>
)

class OrganizeGame extends React.Component {
  state = {
    players: ['human', 'random', 'random', 'random'],
  }

  setPlayer = (multiplayer, index, value) => {
    const players = this.state.players.slice(0);
    players[index] = value;
    this.setState({ players });
  }

  play = (multiplayer) => {
    const { players } = this.state;
    const { onReady } = this.props;
    this.setState({ loading: true }, () => {
      if (players.find(p => p.startsWith('human:'))) {
        // TODO approvals
      } else {
        onReady(players);
        this.setState({ loading: false });
      }
    });
  }

  render() {
    const { players, loading } = this.state;
    const { classes } = this.props;

    return (
      <Subscribe to={[MultiplayerContainer]}>
        {multiplayer => (
          <Dialog
            open
            aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a Game</DialogTitle>
                <DialogContent>
                  <div className={classes.root}>
                  <div className={classes.c}>
                    Choose your players
                  </div>
                  <div className={classes.t}>
                    <PlayerMenu value={players[0]} onChange={this.setPlayer} index={0} multiplayer={multiplayer} />
                  </div>
                  <div className={classes.l}>
                    <PlayerMenu value={players[3]} onChange={this.setPlayer} index={3} multiplayer={multiplayer} />
                  </div>
                  <div className={classes.r}>
                    <PlayerMenu value={players[1]} onChange={this.setPlayer} index={1} multiplayer={multiplayer} />
                  </div>
                  <div className={classes.b}>
                    <PlayerMenu value={players[2]} onChange={this.setPlayer} index={2} multiplayer={multiplayer} />
                  </div>
                  </div>
                </DialogContent>
                <DialogActions>
                  <Button
                    loading={loading}
                    variant="contained"
                    onClick={() => this.play(multiplayer)}
                    color="primary"
                  >
                  Let's Play
                  </Button>
                </DialogActions>
          </Dialog>
        )}
      </Subscribe>
    );
  }
}

export default withStyles({
  root: {
    width: 600,
    height: 400,
    position: 'relative',
  },
  c: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    width: 200,
    marginLeft: -120,
    marginTop: -20,
    textAlign: 'center',
  },
  l: {
    position: 'absolute',
    bottom: '50%',
    left: 20,
  },
  b: {
    position: 'absolute',
    bottom: 20,
    left: '40%',
  },
  t: {
    position: 'absolute',
    top: 20,
    left: '40%',
  },
  r: {
    position: 'absolute',
    bottom: '50%',
    right: 60,
  },
})(OrganizeGame);
