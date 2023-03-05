import { createEvent } from 'effector';

import { pick } from './utils';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi, FormState as FFFormState } from 'final-form';
import type { FormSubscription } from './types';

const createFormState = <FormValues, T extends FormSubscription>(config: {
  domain: Domain;
  form: FFFormApi<FormValues>;
  subscribeOn: T;
}) => {
  type State = Pick<FFFormState<FormValues>, T[number]> & {
    isValidationPaused: boolean;
  };

  const initialState = pick([...config.subscribeOn, 'isValidationPaused'], {
    ...config.form.getState(),
    isValidationPaused: false,
  });

  const formStateApi = {
    update: createEvent<Omit<State, 'isValidationPaused'>>(),
    setValidationPaused: createEvent<boolean>(),
  };

  const $formState = config.domain
    .store<State>(initialState)
    .on(formStateApi.update, (s, p) => Object.assign({}, s, p))
    .on(formStateApi.setValidationPaused, (s, isValidationPaused) => Object.assign({}, s, { isValidationPaused }));

  config.form.subscribe(
    // @ts-expect-error
    formStateApi.update,
    config.subscribeOn.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
  );

  return { $formState, formStateApi };
};

export { createFormState };
