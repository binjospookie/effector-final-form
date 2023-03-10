import { Nil } from '../types';

const isNil = <T>(x: T | Nil): x is Nil => x === null || x === undefined;

export { isNil };
