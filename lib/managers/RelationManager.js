const immutable = require('immutable');
const debug = require('debug')('parametric-geometry:managers:RelationManager');

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

  RelationManagerWorker.prototype.add = function addRelation(relation) {
    const relationId = relation && relation.id;

    if (!relation || !relationId) {
      debug('relation', relation);
      throw new Error('RelationManager.add() requires a relation with an ID');
    }

    if (relationsMap.has(relationId) && relationsMap.get(relationId) !== relation) {
      throw new Error(`RelationManager already has a different relation with id "${relationId}"`);
    }

    return this.set(relationId, relation);
  };

  RelationManagerWorker.prototype.set = function setRelation(id, relation) {
    if (typeof id !== 'string') {
      throw new Error('id must be a string');
    }

    if (!relation) {
      throw new Error('relation must be given');
    }

    relationsMap = relationsMap.set(id, relation);
    this.emit('relation', relation);

    return this;
  };

  RelationManagerWorker.prototype.getMap = function getMap() {
    return relationsMap;
  };

  // RelationManagerWorker.prototype.allForGeometry = function (geometryOrId) {
  //   const geometryId = geometryOrId && geometryOrId.id || geometryOrId;
  //
  //   if (typeof geometryId !== 'string' || !geometryId) {
  //     // or throw?
  //     return [];
  //   }
  //
  //   debug(
  //     'pertinent relations',
  //     relationsMap.filter(relation => relation.relatesTo(geometryId))
  //   );
  //   debug('from relations:', relationsMap);
  //
  //   // throw new Error('unimplemented');
  //   // TODO
  //   console.warn('allForGeometry is unfinished, returning empty array for now');
  //   return [];
  // };

  return new RelationManagerWorker();
}

module.exports = RelationManager;
