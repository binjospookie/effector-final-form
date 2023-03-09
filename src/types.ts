import type { FormSubscription as FFFormSubscription } from 'final-form';

type Nil = null | undefined;
type Key = string | number | symbol;

type __Pick<O extends object, K extends keyof O> = {
  [P in K]: O[P];
} & {};

type _Pick<O extends object, K extends Key> = __Pick<O, keyof O & K>;
type Pick<O extends object, K extends Key> = O extends unknown ? _Pick<O, K> : never;

type FormSubscription = readonly (keyof FFFormSubscription)[];

type ValidationResult = any | undefined | Promise<any> | Promise<undefined>;

export type { FormSubscription, Pick, Nil, ValidationResult };
