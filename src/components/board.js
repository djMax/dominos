import React from 'react';
import { Hand } from './hand';
import { PlayedTiles } from './played-tiles';
import { Button } from '@material-ui/core';
import getPlayablePieces from '../game/options';

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

  renderHand(player) {
    const { G: { board, pieces, players }, playerID, ctx: { phase }, isActive } = this.props;
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
        const possible = getPlayablePieces(board);
        if (!players[player].hand.find(p => possible.includes(p.values[0]) || possible.includes(p.values[1]))) {
          hand.onPass = this.pass;
        }
      }
    }
    return <Hand {...hand} />
  }

  render() {
    const { ctx: { currentPlayer }, G: { board } } = this.props;
    return (
      <div className="board">
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