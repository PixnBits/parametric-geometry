const debug = require('debug')('parametric-geometry:relations:CoincidentPoint');

var id = 0;
function createId() {
  id += 1;
  return `$CoincidentPointRelation-${id}`;
}

function getGeometryId(idOrGeometry) {
  var geometryId = (idOrGeometry && idOrGeometry.id) || idOrGeometry;
  if (typeof geometryId !== 'string' || !geometryId) {
    throw new Error('geometry must be an instance with an id or the id string');
  }
  return geometryId;
}


function CoincidentPointRelation(...pointList) {
  this.id = createId();
  this.pointList = [];
  this.addAll(pointList);
  debug('creation, pointList', this.pointList);
}

CoincidentPointRelation.prototype.add = function add([idOrGeometry, definesPointsName]) {
  const geometryId = getGeometryId(idOrGeometry);
  debug('add', geometryId, definesPointsName);

  if (typeof definesPointsName !== 'string' || !definesPointsName) {
    throw new Error('CoincidentPointRelation requires a point name');
  }

  this.pointList.push([geometryId, definesPointsName]);

  return this;
};

CoincidentPointRelation.prototype.addAll = function addAll(pointList) {
  pointList.forEach(v => this.add(v));
  return this;
};

// CoincidentPointRelation.prototype.relatesTo = function (idOrGeometry) {
//   const geometryIdSearchFor = getGeometryId(idOrGeometry);
//   debug('geometryIdSearchFor', geometryIdSearchFor);
//   debug('from', this.pointList);
//   debug('found', this.pointList.filter(([geometryId]) => geometryId === geometryIdSearchFor));
//
//   return this.pointList
//     .filter(([geometryId]) => geometryId === geometryIdSearchFor).length >= 1;
// };

CoincidentPointRelation.prototype.addEquations = function addEquations(equations) {
  this.pointList.forEach((a, i, arr) => {
    const b = arr[i + 1];
    if (!b) {
      return;
    }
    equations
      .add(`${a[0]}.points.${a[1]}.x`, `${b[0]}.points.${b[1]}.x`)
      .add(`${b[0]}.points.${b[1]}.x`, `${a[0]}.points.${a[1]}.x`)
      .add(`${a[0]}.points.${a[1]}.y`, `${b[0]}.points.${b[1]}.y`)
      .add(`${b[0]}.points.${b[1]}.y`, `${a[0]}.points.${a[1]}.y`);
  });
};

module.exports = CoincidentPointRelation;
