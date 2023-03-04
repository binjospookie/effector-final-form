import { createEvent } from 'effector';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi, FormState as FFFormState } from 'final-form';

const createFormState = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
) => {
  type State = FFFormState<FormValues, InitialFormValues> & {
    isValidationPaused: boolean;
  };

  const formStateApi = {
    update: createEvent<Omit<State, 'isValidationPaused'>>(),
    setValidationPaused: createEvent<boolean>(),
  };

  const $formState = domain
    .store<State>(Object.assign(form.getState(), { isValidationPaused: false }))
    .on(formStateApi.update, Object.assign)
    .on(formStateApi.setValidationPaused, (s, isValidationPaused) => Object.assign(s, { isValidationPaused }));

  return { $formState, formStateApi };
};

export { createFormState };
