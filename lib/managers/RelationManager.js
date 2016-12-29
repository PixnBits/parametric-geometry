const immutable = require('immutable');

function RelationManager() {
  const listeners = {};
  var relationsMap = new immutable.Map();

  function RelationManagerWorker() {

  }

  RelationManagerWorker.prototype.on = function addListener(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener must be a function');
    }

    if (!eventName || typeof eventName !== 'string') {
      throw new Error('event name must be a string');
    }

    listeners[eventName] = listeners[eventName] || [];
    listeners[eventName].push(listener);

    return this;
  };

  RelationManagerWorker.prototype.off = function removeListener(eventName, listener) {
    if (typeof listener !== 'function') {
      throw new Error('listener must be a function');
    }

    if (!eventName || typeof eventName !== 'string') {
      throw new Error('event name must be a string');
    }

    if (!listeners[eventName]) {
      return this;
    }

    const index = listeners[eventName].indexOf(listener);
    listeners[eventName] = listeners[eventName].splice(index, 1);

    return this;
  };

  RelationManagerWorker.prototype.emit = function triggerListeners(eventName, data) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('event name must be a string');
    }

    if (!listeners[eventName]) {
      return this;
    }

    listeners[eventName].forEach(l => l.apply(this, [data]));

    return this;
  };

  RelationManagerWorker.prototype.add = function addMember(member) {
    const memberId = member && member.id;

    if (!member || !memberId) {
      throw new Error('RelationManager.add() requires a member with an ID');
    }

    if (relationsMap[memberId] !== member) {
      throw new Error(`RelationManager already has a different member with id "${memberId}"`);
    }

    return this.set(memberId, member);
  };

  RelationManagerWorker.prototype.set = function setMember(id, member) {
    if (typeof id !== 'string') {
      throw new Error('id must be a string');
    }

    if (!member) {
      throw new Error('member must be given');
    }

    relationsMap = relationsMap.set(id, member);

    return this;
  };

  RelationManagerWorker.prototype.allForGeometry = function (geometry) {
    // throw new Error('unimplemented');
    // TODO
    console.warn('allForGeometry is unfinished, returning empty array for now', geometry);
    return [];
  };

  return new RelationManagerWorker();
}

module.exports = RelationManager;
