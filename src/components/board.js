import React from 'react';
import { Hand } from './hand';
import { PlayedTiles } from './played-tiles';
import { Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { enumerate } from '../game/ai';
import LogicalBoard from '../lib/LogicalBoard';

export class DominoBoard extends React.Component {
  playPiece = (piece) => {
    const { moves, isActive } = this.props;
    if (isActive) {
      moves.playDomino(piece);
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

  handleClose = () => {
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
      name: `Player ${player + 1}`,
      pieces: players[player] ? players[player].hand : pieces[player],
    };
    if (String(player) === String(playerID)) {
      hand.onClick = this.playPiece;
      if (board.root && isActive) {
        const possible = new LogicalBoard(board).validPieces;
        if (!players[player].hand.find(p => possible.includes(p.values[0]) || possible.includes(p.values[1]))) {
          hand.onPass = this.pass;
        }
      }
    }
    if (isActive && playerTypes[player] !== 'human' && String(player) === String(playerID)
      && phase === 'play') {
      const validMoves = enumerate(this.props.G, this.props.ctx);
      console.error('AI MOVE FOR', player, validMoves);
      setTimeout(() => {
        const { moves } = this.props;
        const [chosen] = validMoves;
        moves[chosen.move](...(chosen.args || []));
      }, 250);
    }
    return <Hand {...hand} />
  }

  render() {
    const { ctx: { phase, currentPlayer }, G: { board, completed } } = this.props;

    return (
      <div className="board">
        {phase === 'score' && (
          <Dialog
            open
            onClose={this.nextRound}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Game Over</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Player {completed.winner} has won. Their team gets {completed.points} points.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary" autoFocus>
                Ok
              </Button>
            </DialogActions>
          </Dialog>
        )}
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
        <PlayedTiles {...board}/>
      </div>
    );
  }
}