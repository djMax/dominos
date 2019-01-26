import React from 'react';
import { Hand } from './hand';
import { PlayedTiles } from './played-tiles';
import { Button, withStyles, Snackbar } from '@material-ui/core';
import LogicalBoard from '../model/LogicalBoard';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './MultiplayerContainer';
import Result from './result';
import Score from './score';

const styles = theme => ({
  ambiguous: {
    '&>div': {
      backgroundColor: theme.palette.error.dark,
    },
  }
});

class DominoBoard extends React.Component {
  state = {}

  playPiece = (piece) => {
    const { moves, isActive, G: { board } } = this.props;
    const possible = new LogicalBoard(board).validPieces;
    if (possible.length === 2 && piece.values[0] !== piece.values[1]
      && possible.includes(piece.values[0]) && possible.includes(piece.values[1])) {
      this.setState({ piece });
      return;
    }
    if (isActive) {
      moves.playDomino(piece);
      this.setState({ side: null, piece: null });
    }
  }

  onEndClick = (clickedPiece, side) => {
    const { moves, isActive } = this.props;
    const { piece } = this.state;

    if (isActive) {
      moves.playDomino(piece, side === 'left');
      this.setState({ piece: null });
    }
  }

  pass = () => {
    const { moves, isActive } = this.props;
    if (isActive) {
      moves.pass();
    }
  }

  getHand = () => {
    const { moves } = this.props;
    moves.takeHand();
  }

  nextGame = () => {
    const { moves } = this.props;
    moves.continue();
  }

  renderHand(player) {
    const { G: { board, pieces, players, playerTypes }, playerID, ctx: { phase }, isActive } = this.props;
    if (phase === 'draw' && isActive && String(player) === String(playerID)) {
      return (
        <Button
          variant="contained"
          onClick={this.getHand}
        >Draw Hand</Button>
      );
    }
    const hand = {
      id: playerTypes[player],
      pieces: players[player] ? players[player].hand : pieces[player],
    };
    if (String(player) === String(playerID) && phase === 'play') {
      hand.onClick = this.playPiece;
      if (board.root && isActive) {
        const possible = new LogicalBoard(board).validPieces;
        if (!players[player].hand.find(p => possible.includes(p.values[0]) || possible.includes(p.values[1]))) {
          hand.onPass = this.pass;
        }
      }
    }
    return (
      <Subscribe to={[MultiplayerContainer]}>
        {multiplayer => <Hand {...hand} multiplayer={multiplayer} />}
      </Subscribe>
    );
  }

  render() {
    const { ctx: { phase, currentPlayer }, G: { scores, board, completed }, classes } = this.props;
    const { piece } = this.state;

    return (
      <div className="board">
        {phase === 'score' && <Result {...completed} onNext={this.nextGame} />}
        <div className={`dplayer p0 ${currentPlayer === '0' ? 'active' : ''}`}>
          {this.renderHand(0)}
        </div>
        <div className={`dplayer p1 ${currentPlayer === '1' ? 'active' : ''}`}>
          {this.renderHand(1)}
        </div>
        <div className={`dplayer p2 ${currentPlayer === '2' ? 'active' : ''}`}>
          {this.renderHand(2)}
        </div>
        <div className={`dplayer p3 ${currentPlayer === '3' ? 'active' : ''}`}>
          {this.renderHand(3)}
        </div>
        <PlayedTiles {...board} onEndClick={this.onEndClick} />
        <Score ns={scores.ns} ew={scores.ew} />
        <Snackbar
          className={classes.ambiguous}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={!!piece}
          autoHideDuration={6000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">Click the end of the board on which this piece should be played.</span>}
        />
        </div>
    );
  }
}

export default withStyles(styles)(DominoBoard);
