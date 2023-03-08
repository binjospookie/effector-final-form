import { createEvent, createStore } from 'effector';
import { formSubscriptionItems } from 'final-form';

import { isNil, normalizeSubscriptions, pick, notEquals } from './utils';

import type {
  FormApi as FFFormApi,
  FormState as FFFormState,
  FormSubscription as FFFormSubscription,
} from 'final-form';
import type { FormSubscription } from './types';

const createFormState = <FormValues, T extends FormSubscription>(config: {
  finalForm: FFFormApi<FormValues>;
  subscribeOn: T;
}) => {
  const { finalForm, subscribeOn } = config;

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
    update: createEvent<Omit<State, 'isValidationPaused'>>(),
    setValidationPaused: createEvent<boolean>(),
  };

  const $formState = createStore<State>(initialState, {
    updateFilter: notEquals,
  })
    .on(formStateApi.update, (s, p) => Object.assign({}, s, p))
    .on(formStateApi.setValidationPaused, (s, isValidationPaused) => Object.assign({}, s, { isValidationPaused }));

  finalForm.subscribe((x) => {
    const normalizedState = subscribeOn.reduce((acc, sub) => (isNil(x[sub]) ? { ...acc, [sub]: null } : acc), x);

    formStateApi.update(normalizedState as unknown as Omit<State, 'isValidationPaused'>);
    // @ts-expect-error
  }, normalizeSubscriptions(formSubscriptionItems, subscribeOn));

  return { $formState, formStateApi };
};

export { createFormState };
