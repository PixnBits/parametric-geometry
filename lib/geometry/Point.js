const isNumber = require('is-number');

function Point(xOrAll, argY) {
  this.defined = {
    x: undefined,
    y: undefined,
  };

  // this.guessed = {}

  if (isNumber(xOrAll) && isNumber(argY)) {
    this.defined.x = xOrAll;
    this.defined.y = argY;
  } else if (xOrAll && typeof xOrAll === 'object') {
    if (isNumber(xOrAll.x)) {
      this.defined.x = xOrAll.x;
    }
    if (isNumber(xOrAll.y)) {
      this.defined.y = xOrAll.y;
    }
  }
}

module.exports = Point;
