import React from 'react';

export class DominoBoard extends React.Component {
  playPiece = (piece) => {
    const { moves, events, isActive } = this.props;
    if (isActive) {
      moves.addDomino(piece);
      events.endTurn();
    }
  }

  renderHand(player) {
    const { G: { pieces, players }, playerID} = this.props;
    if (String(player) === String(playerID)) {
      // It's my hand
      return (
        <div>
          {players[player].hand.map(p =>
            <div
              key={JSON.stringify(p.values)}
              onClick={() => this.playPiece(p)}
              className="piece">{p.values[0]} | {p.values[1]}
            </div>)}
        </div>
      );
    }
    return (
      <div>
        {new Array(pieces[player]).fill(true).map((p, ix) => <div
          key={`player${player}-${ix}`}
          className="piece">&nbsp;</div>)}
      </div>
    );
  }

  render() {
    return (
      <table>
        <tbody>
          <tr className="row1">
            <td className="vert" rowSpan="3">
              {this.renderHand(3)}
            </td>
            <td align="center">
              {this.renderHand(0)}
            </td>
            <td className="vert" rowSpan="3">
              {this.renderHand(1)}
            </td>
          </tr>
          <tr className="row2">
            <td>main board</td>
          </tr>
          <tr className="row3">
            <td align="center">{this.renderHand(2)}</td>
          </tr>
        </tbody>
      </table>
    )
  }
}