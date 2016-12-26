const chai = require('chai');
const parametricGeometry = require('../../../lib/index.js');

const expect = chai.expect;
const Group = parametricGeometry.Group;
const geometry = parametricGeometry.geometry;

describe('lines', () => {
  describe('fully-defined', () => {
    describe('single', () => {
      it('vertical from origin with length', () => {
        const height = 5;

        const group = new Group();
        const line0 = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 0, y: 0 }),
          },
          length: height,
          vertical: true,
        });
        group.members.add(line0);

        expect(group.built[`${line0.id}.points.start.x`]).to.equal(0);
        expect(group.built[`${line0.id}.points.start.y`]).to.equal(0);
        expect(group.built[`${line0.id}.points.end.x`]).to.equal(0);
        expect(group.built[`${line0.id}.points.end.y`]).to.equal(height);
      });
    });
  });
});
