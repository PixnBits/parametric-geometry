const immutable = require('immutable');

function MemberManager() {
  const listeners = {};
  var memberMap = new immutable.Map();

  function MemberManagerWorker() {}

  MemberManagerWorker.prototype.on = function addListener(eventName, listener) {
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

  MemberManagerWorker.prototype.off = function removeListener(eventName, listener) {
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

  MemberManagerWorker.prototype.emit = function triggerListeners(eventName, data) {
    if (!eventName || typeof eventName !== 'string') {
      throw new Error('event name must be a string');
    }

    if (!listeners[eventName]) {
      return this;
    }

    listeners[eventName].forEach(l => l.apply(this, [data]));

    return this;
  };

  MemberManagerWorker.prototype.add = function addMember(member) {
    const memberId = member && member.id;

    if (!member || !memberId) {
      throw new Error('MemberManager.add() requires a member with an ID');
    }

    if (memberMap.has(memberId) && memberMap.get(memberId) !== member) {
      throw new Error(`MemberManager already has a different member with id "${memberId}"`);
    }

    return this.set(memberId, member);
  };

  MemberManagerWorker.prototype.set = function setMember(id, member) {
    if (typeof id !== 'string') {
      throw new Error('id must be a string');
    }

    if (!member) {
      throw new Error('member must be given');
    }

    memberMap = memberMap.set(id, member);
    this.emit('member', member);

    return this;
  };

  MemberManagerWorker.prototype.getMap = () => memberMap;

  return new MemberManagerWorker();
}

module.exports = MemberManager;
