const immutable = require('immutable');
const math = require('mathjs');
const debug = require('debug')('parametric-geometry:managers:Equations');

function nextVarName(prevVarName) {
  const prefix = 'param_var_';
  const prev = prevVarName || `${prefix}0`;
  const index = parseInt(/(\d+)$/.exec(prev), 10);
  return `${prefix}${(index || 0) + 1}`;
}

function stringifyEquations(equations) {
  return equations.map(eq => `${eq.get('parameter')} = ${eq.get('expression')}`).toJS();
}

function stringifySolved(solved, instance) {
  return solved.map((value, varName) => `${instance.getParameterFromVar(varName)} = ${value}`).toJS();
}

// Equation magic
function Equations() {
  this.equations = new immutable.List();
  this.varTable = new immutable.Map();
}

Equations.prototype.add = function addEquation(parameter, expression) {
  if (typeof parameter !== 'string' || !parameter) {
    throw new Error('the parameter must be a string');
  }

  this.equations = this.equations.push(immutable.fromJS({
    parameter,
    expression,
  }));

  return this;
};

Equations.prototype.rebuildVarTable = function rebuildVarTable() {
  var varName;
  var varTable = new immutable.Map();
  debug('rebuildVarTable');

  this.equations.forEach((equation) => {
    const parameter = equation.get('parameter');
    if (varTable.has(parameter)) {
      return true;
    }
    varName = nextVarName(varName);
    // const varName = parameter
    //   .replace(/\./g, '_dot_')
    //   .replace(/-/g, '_dash_')
    //   .replace(/\$/g, '_dollar_');
    if (varName !== parameter) {
      // debug(`going to alias "${parameter}" to "${varName}"`);
      varTable = varTable.set(parameter, varName);
    }
    return true; // https://facebook.github.io/immutable-js/docs/#/Map/forEach
  });

  debug('rebuildVarTable, varTable:', varTable.toJS());
  this.varTable = varTable;
  return this;
};

Equations.prototype.getVarFromParameter = function getVarFromParameter(parameter) {
  const varName = this.varTable.get(parameter) || parameter;
  // debug(`translated param "${parameter}" to var "${varName}"`);
  return varName;
};

Equations.prototype.getParameterFromVar = function getParameterFromVar(varName) {
  const parameter = this.varTable.keyOf(varName) || varName;
  // debug(`translated var "${varName}" to param "${parameter}"`);
  return parameter;
};

Equations.prototype.recompileEquations = function recompileEquations() {
  var equations = this.equations;
  var varTable = this.varTable;
  debug('recompileEquations');
  equations = equations.map((equation) => {
    var expression = equation.get('expression');
    if (expression && typeof expression.replace === 'function') {
      // debug('expression', expression);
      varTable.forEach((varName, parameter) => {
        // .replaceAll(...) idea http://stackoverflow.com/a/1141816
        expression = expression.split(parameter).join(varName);
        // debug('expression', expression, `after "${parameter}" --> "${varName}"`);
        return true; // keep going https://facebook.github.io/immutable-js/docs/#/Map/forEach
      });
    }
    return equation.set('compiled', math.compile(expression));
  });

  debug('recompileEquations, equations', stringifyEquations(equations));
  this.equations = equations;
  return this;
};

Equations.prototype.solve = function solve() {
  var equations;
  var solved = new immutable.Map();
  var previouslySolvedCount = solved.count() - 1;
  var equationIndexesToRemove;
  debug('solve, starting');

  this
    .rebuildVarTable()
    .recompileEquations();

  equations = this.equations;
  const attemptToSolveEquation = (equation, index) => {
    // TODO
    var value;
    const compiled = equation.get('compiled');
    debug(`eval'ing ${equation.get('parameter')} = ${equation.get('expression')}`);
    try {
      value = compiled.eval(solved.toJS());
    } catch (e) {
      debug('threw');
      return true;
    }
    debug('value', typeof value, value, stringifySolved(solved, this));

    // is there a different value for this param?
    const varName = this.getVarFromParameter(equation.get('parameter'));
    const existingValue = solved.get(varName);
    if ((typeof existingValue !== 'undefined') && (existingValue !== value)) {
      throw new Error(`value mismatch for ${equation.get('parameter')}: ${existingValue} vs ${value}`);
    }

    solved = solved.set(varName, value);
    equationIndexesToRemove.push(index);
    return true;
  };
  const removeEquationByIndex = (i) => {
    equations = equations.delete(i);
  };

  while (solved.count() > previouslySolvedCount) {
    debug('starting a new round of eval\'ing');
    previouslySolvedCount = solved.count();
    equationIndexesToRemove = [];
    equations.forEach(attemptToSolveEquation);

    // remove solved equations so we don't evaulate them again
    equationIndexesToRemove
      .sort((a, b) => b - a)
      .forEach(removeEquationByIndex);

    debug(`remaining # of equations: ${equations.count()}`);
    debug('solved thus far:', stringifySolved(solved, this));
    debug(`while (${solved.count()} > ${previouslySolvedCount}) {`);
  }

  // solved all or got stuck? check that each parameter has a value
  // check remaining equations to see if there is a value for the parameters
  equations.forEach((equation) => {
    const parameter = equation.get('parameter');
    if (!solved.has(this.getVarFromParameter(parameter))) {
      debug(`solve got stuck, no solution for "${parameter}" ("${this.getVarFromParameter(parameter)}")`);
      debug('solve got stuck, equations & solved:', stringifyEquations(equations), stringifySolved(solved, this));
      // might have two equations for two variables that reference each other
      // how to solve?
      throw new Error('unable to solve equations, got stuck');
    }
    return true;
  });

  debug('solve finished, solved:', solved.toJS());
  const parameterValues = {};
  solved.forEach((value, varName) => {
    parameterValues[this.getParameterFromVar(varName)] = value;
    return true;
  });
  debug('solve finished, parameterValues:', parameterValues);
  return parameterValues;
};

module.exports = Equations;
