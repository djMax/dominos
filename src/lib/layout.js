function isDouble(piece) {
  return piece && piece.values[0] === piece.values[1];
}

function log(lines) {
  // console.log(lines.join('\n'));
}

export class Layout {
  static longSide = 12;
  static shortSide = 6;

  constructor({ left, max, up, x, y }) {
    this.maxExtent = max;
    this.goingLeft = left;
    this.pathGoesUp = up;
    this.currentX = x || 0;
    this.currentY = y || 0;
    this.currentZ = 28;
  }

  getTransform(piece) {
    this.currentZ -= 1;
    let endX;
    let x = this.currentX;
    let y = this.currentY;
    let rotate;
    if (this.goingLeft) {
      rotate = this.pathGoesUp ? 90 : -90;
    } else {
      rotate = this.pathGoesUp ? -90 : 90;
    }
    const debugLines = [
      `${piece.values[0]},${piece.values[1]} layout start @ ${this.currentX},${this.currentY} going ${this.goingLeft ? 'left' : 'right'} and ${this.pathGoesUp ? 'up' : 'down'}`,
    ];

    if (isDouble(piece) && this.fitsAsDouble() && !this.lastWasVertical) {
      debugLines.push(`  fits as double`);
      endX = this.getNewX(Layout.shortSide);
      if (this.goingLeft && !this.pathGoesUp) {
        endX -= 3;
      } else if (this.goingLeft) {
        endX -= 3;
      } else if (this.pathGoesUp) {
        x -= 3;
      } else {
        x -= 3;
      }
      rotate = 0;
      this.currentX = this.getNewX(Layout.shortSide);
    } else if (this.fitsLengthWise()) {
      endX = this.getNewX(Layout.longSide);
      this.currentX = endX;
    } else {
      // Turn required
      this.lastWasVertical = true;
      if (this.pathGoesUp && this.goingLeft) {
        return this.turnUpRight(piece, debugLines);
      }
      if (this.pathGoesUp) {
        return this.turnUpLeft(piece, debugLines);
      }
      if (this.goingLeft) {
        return this.turnDownLeft(piece, debugLines);
      }
      return this.turnDownRight(piece, debugLines);
    }
    this.lastWasVertical = false;
    debugLines.push(`  ends at ${endX}`);
    log(debugLines);
    return this.getRules(x, endX, y, rotate);
  }

  turnDownRight(piece, debugLines) {
    debugLines.push(`  turn down and right`);
    log(debugLines);
    const rules = this.getRules(this.currentX - 2.5, 0, this.currentY + 3.2, 180);
    this.goingLeft = !this.goingLeft;
    this.currentY += Layout.longSide + 0.6;
    this.currentX += Layout.shortSide + 0.2;
    return rules;
  }

  turnDownLeft(piece, debugLines) {
    debugLines.push(`  turn down and left`);
    log(debugLines);
    const rules = this.getRules(0, this.currentX - Layout.shortSide - 3, this.currentY + 2.9, 180);
    this.goingLeft = !this.goingLeft;
    this.currentY += Layout.longSide - 0.6;
    this.currentX -= Layout.shortSide;
    return rules;
  }

  turnUpRight(piece, debugLines) {
    debugLines.push(`  turn up and right`);
    log(debugLines);
    const rules = this.getRules(0, this.currentX - Layout.shortSide - 3.5, this.currentY - 2.5, 180);
    this.goingLeft = !this.goingLeft;
    this.currentY -= Layout.longSide;
    this.currentX -= Layout.shortSide + 0.8;
    return rules;
  }

  turnUpLeft(piece, debugLines) {
    debugLines.push(`  turn up and left`);
    log(debugLines);
    const rules = this.getRules(this.currentX - Layout.shortSide + 3.5, 0, this.currentY - 2.9, 180);
    this.goingLeft = !this.goingLeft;
    this.currentY -= Layout.longSide;
    this.currentX += Layout.shortSide + 0.5;
    return rules;
  }

  getRules(startX, endX, y, rotate) {
    const transformX = this.goingLeft ? endX : startX;
    const ops = [`translate(${transformX}em,${y}em)`];
    if (rotate) {
      ops.push(`rotate(${rotate}deg)`);
    }
    return {
      zIndex: this.currentZ,
      transform: ops.join(' '),
    };
  }

  fitsAsDouble() {
    // A double will require a short side, a non-double long side, and a short side
    // for the following piece. If that's not available, we must treat this as a regular
    // piece
    return this.fitsSizeWithoutTurn(Layout.longSide + (2 * Layout.shortSide));
  }

  fitsLengthWise() {
    // A regular lengthwise piece just needs a long side and a short side for the next
    // piece. If that isn't available, we need to turn
    return this.fitsSizeWithoutTurn(Layout.longSide + Layout.shortSide);
  }

  fitsSizeWithoutTurn(size) {
    const endX = this.getNewX(size)
    if (Math.abs(endX) < this.maxExtent) {
      return true;
    }
    return false;
  }

  getNewX(size) {
    const startingX = this.currentX;
    return startingX + ((this.goingLeft ? -1 : 1) * size);
  }
}