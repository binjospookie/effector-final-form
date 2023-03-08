// copied from https://github.com/selfrefactor/rambda/blob/master/source/equals.js

import { type } from './type';

const parseError = (maybeError: any) => {
  const typeofError = maybeError.__proto__.toString();

  return !['Error', 'TypeError'].includes(typeofError) ? [] : [typeofError, maybeError.message];
};

const parseDate = (maybeDate: any) => {
  if (!maybeDate.toDateString) return [false];

  return [true, maybeDate.getTime()];
};

const parseRegex = (maybeRegex: any) => {
  if (maybeRegex.constructor !== RegExp) return [false];

  return [true, maybeRegex.toString()];
};

/**
 * Returns true if its arguments are equivalent, false otherwise. Dispatches to an equals method if present.
 * Handles cyclical data structures.
 */
export const equals = (a: any, b: any): boolean => {
  const aType = type(a);

  if (aType !== type(b)) {
    return false;
  }

  if (aType === 'Function') {
    return a.name === undefined ? false : a.name === b.name;
  }

  if (['NaN', 'Undefined', 'Null'].includes(aType)) {
    return true;
  }

  if (aType === 'Number') {
    return Object.is(-0, a) !== Object.is(-0, b) ? false : a - b === 0;
  }

  if (['String', 'Boolean'].includes(aType)) {
    return a.toString() === b.toString();
  }

  if (aType === 'Array') {
    const aClone = Array.from(a);
    const bClone = Array.from(b);

    if (aClone.toString() !== bClone.toString()) {
      return false;
    }

    return aClone.every((item, aCloneIndex) => {
      return item === bClone[aCloneIndex] || equals(item, bClone[aCloneIndex]);
    });
  }

  const aRegex = parseRegex(a);
  const bRegex = parseRegex(b);

  if (aRegex[0]) {
    return bRegex[0] ? aRegex[1] === bRegex[1] : false;
  } else if (bRegex[0]) {
    return false;
  }

  const aDate = parseDate(a);
  const bDate = parseDate(b);

  if (aDate[0]) {
    return bDate[0] ? aDate[1] === bDate[1] : false;
  } else if (bDate[0]) return false;

  const aError = parseError(a);
  const bError = parseError(b);

  if (aError[0]) {
    return bError[0] ? aError[0] === bError[0] && aError[1] === bError[1] : false;
  }

  if (aType === 'Object') {
    const aKeys = Object.keys(a);

    return aKeys.length !== Object.keys(b).length
      ? false
      : aKeys.every((aKey) => {
          const aValue = a[aKey];
          const bValue = b[aKey];

          return aValue === bValue || equals(aValue, bValue);
        });
  }

  return false;
};
