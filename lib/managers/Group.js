const MemberManager = require('./MemberManager');
const RelationManager = require('./RelationManager');
const Equations = require('./Equations');

function Group() {
  this.members = new MemberManager();
  this.relations = new RelationManager();

  this.members.on('member', this.memberAdded.bind(this));
  this.relations.on('relation', this.relationAdded.bind(this));
}

Group.prototype.memberAdded = function (member) {
  console.info('member added');
  this.build();
};

Group.prototype.relationAdded = function (relation) {
  console.info('relation added');
  this.build();
};

Group.prototype.build = function () {
  const equations = new Equations();

  for (let member of this.members.getMap().values()) {
    console.log(member);
    let relations = this.relations.allForGeometry(member);
    console.log(`all relations for member geometry "${member.id}"`, relations);

    member.addEquationsFromDefined(equations);
  }

  console.log('equations', equations);

  this.built = equations.solve();
  console.log('built', this.built);
  // TODO: save equations for the next build (e.g. partial)
  return this.built;
};

module.exports = Group;