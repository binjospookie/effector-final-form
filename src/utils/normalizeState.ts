import { isNil } from './isNil';

const normalizeState = <S extends {}, T>(state: S, subscribeOn: readonly T[]) =>
  // @ts-expect-error
  subscribeOn.reduce((acc, sub) => (isNil(state[sub]) ? { ...acc, [sub]: null } : acc), state);

export { normalizeState };
