const immutable = require('immutable');
const isNumber = require('is-number');
const math = require('mathjs');

// 'a'
// 'b'
// 'z'
// 'aa'
// 'ab'
// 'az'
// 'ba'
// 'bb'
// 'za'
// 'zz'
// 'aaa'
function nextVarName(prevVarName) {
  const varRecord = prevVarName
    .split('')
    .map(v => v.charCodeAt() - 97);

  varRecord[varRecord.length - 1] += 1;

  return varRecord
    .map(v => String.fromCharCode(v + 97))
    .join('');
};

// replace all parameters with their variable names
function parseExpressions(expressions) {
  const parsedExpressions = {};
  const parameterToVarMap = {};
  const varToParameterMap = {};
  const parameters = Object.keys(expressions);

  var varName = String.fromCharCode('a'.charCodeAt(0) - 1);
  parameters.forEach((parameter) => {
    varName = nextVarName(varName);
    parameterToVarMap[parameter] = varName;
    varToParameterMap[varName] = parameter;
  });

  const vars = parameters.map(parameter => parameterToVarMap[parameter]);
  parameters.forEach((parameter) => {
    const varName = parameterToVarMap[parameter];
    parsedExpressions[varName] = expressions[parameter]
      .map((expression) => {
        if (isNumber(expression)) {
          return expression;
        }

        return vars.reduce((accumulator, varToReplaceWith) => {
          const parameterToReplace = varToParameterMap[varToReplaceWith];
          var expressionProcessing = accumulator;
          while (expressionProcessing.indexOf(parameterToReplace) !== -1) {
            expressionProcessing = expressionProcessing.replace(parameterToReplace, varToReplaceWith);
          }
          return expressionProcessing;
        }, expression);
      })
      .map((expression) => math.compile(expression));
  });

  return {
    parsedExpressions,
    parameterToVarMap,
    varToParameterMap,
    // parameters,
    // vars,
  };
}

// Equation magic
function Equations() {
  this.expressions = {};
}

Equations.prototype.add = function (parameter, expression) {
  if (typeof parameter !== 'string' || !parameter) {
    throw new Error('the parameter must be a string');
  }

  const expressions = this.expressions;

  if (!expressions[parameter]) {
    expressions[parameter] = [];
  }

  expressions[parameter].push(expression);

  return this;
};

Equations.prototype.solve = function attemptToSolve() {
  const preparsed = parseExpressions(this.expressions);
  const parsedExpressions = preparsed.parsedExpressions;
  const varToParameterMap = preparsed.varToParameterMap;

  const firstValuesFound = {};
  Object.keys(parsedExpressions).forEach(varName => {
    parsedExpressions[varName].forEach(expression => {
      var result;
      try {
        result = expression.eval(firstValuesFound);
      } catch(e) {
        // usually "Undefined symbol <other variable>"
        return;
      }
      console.log(`${varName} expression eval:`, result);
      firstValuesFound[varName] = result;
    });
  });

  console.log('preparsed', preparsed);
  console.log('firstValuesFound', firstValuesFound);

  // TODO: loop to find some others
  // FIXME: keep track of progress and if we've stalled

  // translate var values to parameter values
  const parameterValues = {};
  Object.keys(firstValuesFound).forEach((varName) => {
    parameterValues[varToParameterMap[varName]] = firstValuesFound[varName];
  });

  return parameterValues;
};

module.exports = Equations;
