import { Pick } from '../types';
import { equals } from './equals';
import { isNil } from './isNil';
import { normalizeState } from './normalizeState';

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

const notEquals = (a: any, b: any) => !equals(a, b);

export { pick, isNil, normalizeSubscriptions, notEquals, normalizeState };
