import { Pick, Nil } from './types';

const isNil = <T>(x: T | Nil): x is Nil => x === null || x === undefined;

const pick = <K extends string, T extends Record<string, any>>(propsToPick: K[], input: T): Pick<T, K> =>
  // @ts-expect-error
  isNil(input)
    ? {}
    : propsToPick.reduce(
        (acc, name) => (Object.prototype.hasOwnProperty.call(input, name) ? { ...acc, [name]: input[name] } : acc),
        {},
      );

const normalizeSubscriptions = <T extends readonly string[]>(a: T, b: T) =>
  a.reduce((acc, k) => ({ ...acc, [k]: b.includes(k) }), {});

export { pick, isNil, normalizeSubscriptions };
