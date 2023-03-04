import { launch } from 'effector';

import { subscription } from './subscription';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi, FormState as FFFormState } from 'final-form';

const createFormState = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
) => {
  type State = FFFormState<FormValues, InitialFormValues>;

  const $formState = domain.store<State>(form.getState());

  form.subscribe((state) => {
    // @ts-expect-error okk
    launch($formState, { ...$formState.defaultState, ...state });
  }, subscription);

  return $formState;
};

export { createFormState };
