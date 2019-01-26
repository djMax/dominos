import React from 'react';
import { Hand } from './hand';
import { PlayedTiles } from './played-tiles';
import { Button } from '@material-ui/core';
import LogicalBoard from '../model/LogicalBoard';
import { Subscribe } from 'unstated';
import MultiplayerContainer from './MultiplayerContainer';
import Result from './result';
import Score from './score';

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
    if (String(player) === String(playerID)) {
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
    const { ctx: { phase, currentPlayer }, G: { scores, board, completed } } = this.props;

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
        <PlayedTiles {...board}/>
        <Score ns={scores.ns} ew={scores.ew} />
      </div>
    );
  }
}