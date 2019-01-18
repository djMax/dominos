import React from 'react';
import { Hand } from './hand';
import { PlayedTiles } from './played-tiles';
import { Button } from '@material-ui/core';

export class DominoBoard extends React.Component {
  playPiece = (piece) => {
    const { moves, isActive } = this.props;
    if (isActive) {
      moves.playDomino(piece);
    }
  }

  getHand = () => {
    const { moves } = this.props;
    moves.takeHand();
  }

  renderHand(player) {
    const { G: { pieces, players }, playerID, ctx: { phase, actionPlayers }, moves, isActive } = this.props;
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
    }
    return <Hand {...hand} />
  }

  render() {
    const { ctx: { currentPlayer }, G: { board, pieces } } = this.props;
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