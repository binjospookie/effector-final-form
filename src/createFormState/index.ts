import { launch } from 'effector';

import { subscription } from './subscription';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi, FormState as FFFormState } from 'final-form';

const createFormState = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
) => {
  type State = FFFormState<FormValues, InitialFormValues> & {
    isValidationPaused: boolean;
  };

  const initialFormState = form.getState();
  const $formState = domain.store<State>({
    ...initialFormState,
    isValidationPaused: !Boolean(initialFormState.validating),
  });

  form.subscribe((state) => {
    const nextState = { ...$formState.defaultState, ...state };
    // @ts-expect-error okk
    launch($formState, { ...nextState, isValidationPaused: !Boolean(nextState.validating) });
  }, subscription);

  return $formState;
};

export { createFormState };
