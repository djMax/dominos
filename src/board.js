import React from 'react';
import { Hand } from './components/hand';

export class DominoBoard extends React.Component {
  playPiece = (piece) => {
    const { moves, events, isActive } = this.props;
    if (isActive) {
      moves.addDomino(piece);
      setTimeout(() => events.endTurn(), 1000);
    }
  }

  renderHand(player) {
    const { G: { pieces, players }, playerID} = this.props;
    const hand = {
      pieces: players[player] ? players[player].hand : pieces[player],
    };
    if (String(player) === String(playerID)) {
      hand.onClick = this.playPiece;
    }
    return <Hand {...hand} />
  }

  render() {
    return (
      <div className="board">
        <div className="player p0">
          {this.renderHand(0)}
        </div>
        <div className="player p1">
          {this.renderHand(1)}
        </div>
        <div className="player p2">
          {this.renderHand(2)}
        </div>
        <div className="player p3">
          {this.renderHand(3)}
        </div>
      </div>
    );
  }
}