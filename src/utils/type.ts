// https://raw.githubusercontent.com/selfrefactor/rambda/master/source/type.spec.js

export function type(input: any) {
  if (input === null) {
    return 'Null';
  } else if (input === undefined) {
    return 'Undefined';
  } else if (Number.isNaN(input)) {
    return 'NaN';
  }
  const typeResult = Object.prototype.toString.call(input).slice(8, -1);

  return typeResult === 'AsyncFunction' ? 'Promise' : typeResult;
}
