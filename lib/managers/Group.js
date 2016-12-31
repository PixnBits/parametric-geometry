const debug = require('debug')('parametric-geometry:managers:Group');

const MemberManager = require('./MemberManager');
const RelationManager = require('./RelationManager');
const Equations = require('./Equations');

function Group() {
  this.members = new MemberManager();
  this.relations = new RelationManager();

  this.members.on('member', this.memberAdded.bind(this));
  this.relations.on('relation', this.relationAdded.bind(this));
}

Group.prototype.memberAdded = function memberAdded(member) {
  debug('member added', member);
  this.build();
};

Group.prototype.relationAdded = function relationAdded(relation) {
  debug('relation added', relation);
  this.build();
};

Group.prototype.build = function build() {
  const equations = new Equations();

  debug('adding member equations');
  Array.from(this.members.getMap().values()).forEach((member) => {
    // debug(member);
    member.addEquationsFromDefined(equations);
  });
  debug('equations', equations.equations.toJS());

  debug('adding relation equations');
  Array.from(this.relations.getMap().values()).forEach((relation) => {
    // debug(relation);
    relation.addEquations(equations);
  });
  debug('equations', equations.equations.toJS());

  try {
    this.built = equations.solve();
  } catch (e) {
    // no solution
    this.built = null;
  }

  debug('built', this.built);
  // TODO: save equations for the next build (e.g. partial)
  return this.built;
};

module.exports = Group;
