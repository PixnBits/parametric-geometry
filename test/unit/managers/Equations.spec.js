const expect = require('chai').expect;
const Equations = require('../../../lib/managers/Equations');

describe('managers', () => {
  describe('Equations', () => {
    it('creates instances', () => {
      const eq1 = new Equations();
      expect(eq1).to.be.instanceOf(Equations);

      const eq2 = new Equations();
      expect(eq2).to.not.equal(eq1);
    });

    it('adds expressions', () => {
      const eq = new Equations();

      eq
        .add('var_a', 'var_b')
        .add('var_b', 'var_c')
        .add('var_a', 'var_c');
    });

    it('throws if trying to add a variable with a similar machine name');

    describe('solving', () => {
      var eq;
      beforeEach(() => {
        eq = new Equations();
      });

      it('literals', () => {
        eq.add('var_a', 1);
        const solved1 = eq.solve();
        expect(solved1.var_a).to.equal(1);

        eq.add('var_b', 2);
        const solved2 = eq.solve();
        expect(solved2.var_a).to.equal(1);
        expect(solved2.var_b).to.equal(2);
      });

      it('variables referencing each other', () => {
        eq
          .add('var_a', 'var_b')
          .add('var_b', 'var_c')
          .add('var_c', 3);

        expect(eq.solve()).to.deep.equal({
          var_a: 3,
          var_b: 3,
          var_c: 3,
        });
      });

      it('a chain of references', () => {
        eq
          .add('var_a', 'var_b + var_c')
          .add('var_b', 'var_d + var_e')
          .add('var_c', 'var_f + var_g')
          .add('var_d', 3)
          .add('var_e', 5)
          .add('var_f', 7)
          .add('var_g', 11);

        expect(eq.solve()).to.deep.equal({
          var_d: 3,
          var_e: 5,
          var_f: 7,
          var_g: 11,
          var_b: 8,
          var_c: 18,
          var_a: 26,
        });
      });

      it('throws if there\'s a missing variable', () => {
        eq.add('var_a', '5 + var_b');
        expect(() => eq.solve()).to.throw('unable to solve equations, got stuck');
      });

      it('throws if two equations yield different values', () => {
        eq
          .add('var_a', '5')
          .add('var_a', '7');
        expect(() => eq.solve()).to.throw('value mismatch for var_a: 5 vs 7');
      });

      it('removes the right solved equations', () => {
        eq
          .add('var_a', 'var_e + var_d')
          .add('var_b', 4)
          .add('var_c', 'var_b + 4')
          .add('var_d', 7)
          .add('var_e', 11)
          .add('var_f', 'var_a + 12')
          .add('var_g', 'var_f + 5');

        expect(eq.solve()).to.deep.equal({
          var_b: 4,
          var_d: 7,
          var_e: 11,
          var_a: 11 + 7,
          var_c: 4 + 4,
          var_f: (11 + 7) + 12,
          var_g: (11 + 7 + 12) + 5,
        });
      });
    });
  });
});
