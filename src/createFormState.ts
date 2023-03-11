import { createEvent, createStore } from 'effector';
import { formSubscriptionItems } from 'final-form';

import { normalizeSubscriptions, pick, notEquals, normalizeState } from './utils';

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

  const $ = createStore<State>(normalizeState(initialState, subscribeOn), {
    updateFilter: notEquals,
  })
    .on(formStateApi.update, (s, p) => Object.assign({}, s, p))
    .on(formStateApi.setValidationPaused, (s, isValidationPaused) => Object.assign({}, s, { isValidationPaused }));

  finalForm.subscribe((x) => {
    formStateApi.update(normalizeState(x, subscribeOn) as unknown as Omit<State, 'isValidationPaused'>);
    // @ts-expect-error
  }, normalizeSubscriptions(formSubscriptionItems, subscribeOn));

  return { $, formStateApi };
};

export { createFormState };
