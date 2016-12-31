const expect = require('chai').expect;
// const immutable = require('immutable');

const CoincidentPointRelation = require('../../../lib/relations/CoincidentPointRelation');

describe('relations', () => {
  describe('CoincidentPointRelation', () => {
    it('creates instances', () => {
      const coincidentPoint1 = new CoincidentPointRelation();
      expect(coincidentPoint1).to.be.instanceOf(CoincidentPointRelation);

      const coincidentPoint2 = new CoincidentPointRelation();
      expect(coincidentPoint2).to.not.equal(coincidentPoint1);
    });

    it('adds points on creation', () => {
      const coincidentPoint = new CoincidentPointRelation(['$Geom1', 'end'], ['$Geom2', 'start']);
      const pointList = [
        ['$Geom1', 'end'],
        ['$Geom2', 'start'],
      ];
      expect(coincidentPoint.pointList).to.deep.equal(pointList);
    });

    it('uses the id property from a geometry object', () => {
      const coincidentPoint = new CoincidentPointRelation([{ id: '$Geom3' }, 'start']);
      expect(coincidentPoint.pointList).to.deep.equal([
        ['$Geom3', 'start'],
      ]);
    });

    it('throws if an id is not a string', () => {
      const createCoincidentPoint = () => new CoincidentPointRelation([2, 'start']);
      expect(createCoincidentPoint).to.throw('geometry must be an instance with an id or the id string');
    });

    it('throws if an id is not found', () => {
      const createCoincidentPoint = () => new CoincidentPointRelation([{ hello: 'world' }, 'start']);
      expect(createCoincidentPoint).to.throw('geometry must be an instance with an id or the id string');
    });

    it('writes equations', () => {
      const coincidentPoint = new CoincidentPointRelation(['$Geom4', 'end'], ['$Geom5', 'start']);
      const equationList = [];
      const equations = {
        add: (p, e) => { equationList.push([p, e]); return equations; },
      };
      coincidentPoint.addEquations(equations);
      expect(equationList).to.deep.equal([
        ['$Geom4.points.end.x', '$Geom5.points.start.x'],
        ['$Geom5.points.start.x', '$Geom4.points.end.x'],
        ['$Geom4.points.end.y', '$Geom5.points.start.y'],
        ['$Geom5.points.start.y', '$Geom4.points.end.y'],
      ]);
    });
  });
});
