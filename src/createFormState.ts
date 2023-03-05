import { isNil, pick } from './utils';

import type { Domain } from 'effector';
import type {
  FormApi as FFFormApi,
  FormState as FFFormState,
  FormSubscription as FFFormSubscription,
} from 'final-form';
import type { FormSubscription } from './types';

const createFormState = <FormValues, T extends FormSubscription>(config: {
  domain: Domain;
  finalForm: FFFormApi<FormValues>;
  subscribeOn: T;
}) => {
  const { domain, finalForm, subscribeOn } = config;

  type NormalizedState<K extends keyof FFFormSubscription> = Omit<FFFormState<FormValues>, K> & {
    [k in K]: null | Exclude<FFFormState<FormValues>[k], undefined>;
  };

  type State = Pick<
    NormalizedState<'active' | 'errors' | 'modified' | 'submitErrors' | 'touched' | 'visited'>,
    T[number]
  > & {
    isValidationPaused: boolean;
  };

  const initialState = pick([...subscribeOn, 'isValidationPaused'], {
    ...finalForm.getState(),
    isValidationPaused: false,
  });

  const formStateApi = {
    update: domain.event<Omit<State, 'isValidationPaused'>>(),
    setValidationPaused: domain.event<boolean>(),
  };

  const $formState = domain
    .store<State>(initialState)
    .on(formStateApi.update, (s, p) => Object.assign({}, s, p))
    .on(formStateApi.setValidationPaused, (s, isValidationPaused) => Object.assign({}, s, { isValidationPaused }));

  finalForm.subscribe(
    (x) => {
      const normalizedState = subscribeOn.reduce((acc, sub) => (isNil(x[sub]) ? { ...acc, [sub]: null } : acc), x);

      formStateApi.update(normalizedState as unknown as Omit<State, 'isValidationPaused'>);
    },
    subscribeOn.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
  );

  return { $formState, formStateApi };
};

export { createFormState };