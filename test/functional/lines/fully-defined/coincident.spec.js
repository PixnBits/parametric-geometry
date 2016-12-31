const chai = require('chai');
const parametricGeometry = require('../../../../lib/index.js');

const expect = chai.expect;
const Group = parametricGeometry.Group;
const geometry = parametricGeometry.geometry;
const relations = parametricGeometry.relations;

describe('lines', () => {
  describe('fully-defined', () => {
    describe('coincident', () => {
      it('vertical from origin with length', () => {
        const height = 5;
        const width = 7;

        const group = new Group();
        const line0 = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 0, y: 0 }),
          },
          length: height,
          vertical: true,
        });
        group.members.add(line0);

        const line1 = new geometry.Line({
          length: width,
          horizontal: true,
        });
        group.members.add(line1);

        group.relations.add(new relations.CoincidentPoint([line0, 'end'], [line1, 'start']));

        expect(group.built[`${line0.id}.points.start.x`]).to.equal(0);
        expect(group.built[`${line0.id}.points.start.y`]).to.equal(0);

        expect(group.built[`${line0.id}.points.end.x`]).to.equal(group.built[`${line1.id}.points.start.x`]);
        expect(group.built[`${line0.id}.points.end.y`]).to.equal(group.built[`${line1.id}.points.start.y`]);

        expect(group.built[`${line1.id}.points.end.x`]).to.equal(width);
        expect(group.built[`${line1.id}.points.end.y`]).to.equal(height);
      });
    });
  });
});
