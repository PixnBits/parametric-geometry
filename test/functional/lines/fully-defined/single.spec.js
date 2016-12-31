const chai = require('chai');
const parametricGeometry = require('../../../../lib/index.js');

const expect = chai.expect;
const Group = parametricGeometry.Group;
const geometry = parametricGeometry.geometry;

describe('lines', () => {
  describe('fully-defined', () => {
    describe('single', () => {
      it('start and end defined', () => {
        const group = new Group();
        const line = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 1, y: 3 }),
            end: new geometry.Point({ x: 5, y: 7 }),
          },
        });
        group.members.add(line);

        expect(group.built[`${line.id}.points.start.x`]).to.equal(1);
        expect(group.built[`${line.id}.points.start.y`]).to.equal(3);
        expect(group.built[`${line.id}.points.end.x`]).to.equal(5);
        expect(group.built[`${line.id}.points.end.y`]).to.equal(7);
      });

      it('vertical from origin with length', () => {
        const height = 5;

        const group = new Group();
        const line = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 0, y: 0 }),
          },
          length: height,
          vertical: true,
        });
        group.members.add(line);

        expect(group.built[`${line.id}.points.start.x`]).to.equal(0);
        expect(group.built[`${line.id}.points.start.y`]).to.equal(0);
        expect(group.built[`${line.id}.points.end.x`]).to.equal(0);
        expect(group.built[`${line.id}.points.end.y`]).to.equal(height);
      });

      it('vertical from non-origin with length', () => {
        const height = 5;

        const group = new Group();
        const line = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 2, y: 3 }),
          },
          length: height,
          vertical: true,
        });
        group.members.add(line);

        expect(group.built[`${line.id}.points.start.x`]).to.equal(2);
        expect(group.built[`${line.id}.points.start.y`]).to.equal(3);
        expect(group.built[`${line.id}.points.end.x`]).to.equal(2);
        expect(group.built[`${line.id}.points.end.y`]).to.equal(3 + height);
      });

      it('horizontal from origin with length', () => {
        const width = 5;

        const group = new Group();
        const line = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 0, y: 0 }),
          },
          length: width,
          horizontal: true,
        });
        group.members.add(line);

        expect(group.built[`${line.id}.points.start.x`]).to.equal(0);
        expect(group.built[`${line.id}.points.start.y`]).to.equal(0);
        expect(group.built[`${line.id}.points.end.x`]).to.equal(width);
        expect(group.built[`${line.id}.points.end.y`]).to.equal(0);
      });

      it('horizontal from non-origin with length', () => {
        const width = 5;

        const group = new Group();
        const line = new geometry.Line({
          points: {
            start: new geometry.Point({ x: 2, y: 3 }),
          },
          length: width,
          horizontal: true,
        });
        group.members.add(line);

        expect(group.built[`${line.id}.points.start.x`]).to.equal(2);
        expect(group.built[`${line.id}.points.start.y`]).to.equal(3);
        expect(group.built[`${line.id}.points.end.x`]).to.equal(2 + width);
        expect(group.built[`${line.id}.points.end.y`]).to.equal(3);
      });
    });
  });
});
