const debug = require('debug')('parametric-geometry:geometry:Line');
const isNumber = require('is-number');

const Point = require('./Point');

var idCounter = 0;
function generateId() {
  idCounter += 1;
  return `$Line-${idCounter}`;
}

// function isDefined(v) { return typeof v !== 'undefined'; }

function Line(opts) {
  this.id = generateId();

  this.defined = {
    points: {
      start: new Point(),
      end: new Point(),
    },
    // save memory, don't create until needed
    // length: undefined,
    // vertical: undefined,
    // horizontal: undefined,
  };

  if (opts) {
    if (opts.points) {
      if (opts.points.start && opts.points.start instanceof Point) {
        this.defined.points.start = opts.points.start;
      }
      if (opts.points.end && opts.points.end instanceof Point) {
        this.defined.points.end = opts.points.end;
      }
    }

    if (isNumber(opts.length)) {
      this.defined.length = opts.length;
    }

    if (opts.vertical === true || opts.vertical === false) {
      this.defined.vertical = opts.vertical;
    }

    if (opts.horizontal === true || opts.horizontal === false) {
      this.defined.horizontal = opts.horizontal;
    }
  }

  debug(`created Line ${this.id}`);
}

Line.prototype.addEquationsFromDefined = function addEquationsFromDefined(equations) {
  const id = this.id;
  const defined = this.defined;
  debug('defined', defined);

  // points
  // start
  if (isNumber(defined.points.start.defined.x)) {
    equations.add(`${id}.points.start.x`, defined.points.start.defined.x);
  }
  if (isNumber(defined.points.start.defined.y)) {
    equations.add(`${id}.points.start.y`, defined.points.start.defined.y);
  }

  // end
  if (isNumber(defined.points.end.defined.x)) {
    equations.add(`${id}.points.end.x`, defined.points.end.defined.x);
  }
  if (isNumber(defined.points.end.defined.y)) {
    equations.add(`${id}.points.end.y`, defined.points.end.defined.y);
  }

  // others
  if (defined.vertical === true) {
    equations
      .add(`${id}.points.start.x`, `${id}.points.end.x`)
      .add(`${id}.points.end.x`, `${id}.points.start.x`);
  }
  if (defined.horizontal === true) {
    equations
      .add(`${id}.points.start.y`, `${id}.points.end.y`)
      .add(`${id}.points.end.y`, `${id}.points.start.y`);
  }

  if (isNumber(defined.length)) {
    const length = defined.length;
    equations
      .add(`${id}.points.end.x`, `${id}.points.start.x + sqrt(${length}^2 - (${id}.points.end.y - ${id}.points.start.y)^2)`)
      .add(`${id}.points.start.x`, `${id}.points.end.x   - sqrt(${length}^2 - (${id}.points.end.y - ${id}.points.start.y)^2)`)
      .add(`${id}.points.end.y`, `${id}.points.start.y + sqrt(${length}^2 - (${id}.points.end.x - ${id}.points.start.x)^2)`)
      .add(`${id}.points.start.y`, `${id}.points.end.y   - sqrt(${length}^2 - (${id}.points.end.x - ${id}.points.start.x)^2)`);
  }
};

module.exports = Line;
