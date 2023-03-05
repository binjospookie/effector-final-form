import type { O } from 'ts-toolbelt';

const isNil = <T>(x: T | undefined | null): x is undefined | null => x === null || x === undefined;

const pick = <K extends string, T extends Record<string, any>>(propsToPick: K[], input: T): O.Pick<T, K> =>
  // @ts-expect-error
  isNil(input)
    ? {}
    : propsToPick.reduce(
        (acc, name) => (Object.prototype.hasOwnProperty.call(input, name) ? { ...acc, [name]: input[name] } : acc),
        {},
      );

export { pick };
