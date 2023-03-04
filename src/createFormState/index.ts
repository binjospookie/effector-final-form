import { createEvent } from 'effector';

import { subscription } from './subscription';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi, FormState as FFFormState } from 'final-form';
import { createFields } from 'createFields';

const createFormState = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
  updateFields: ReturnType<typeof createFields<FormValues, InitialFormValues>>['updateFields'],
) => {
  type State = FFFormState<FormValues, InitialFormValues> & {
    isValidationPaused: boolean;
  };

  const initialFormState = form.getState();
  const updateState = createEvent<State>();
  const $formState = domain
    .store<State>({
      ...initialFormState,
      isValidationPaused: !Boolean(initialFormState.validating),
    })
    .on(updateState, (_, p) => p);

  form.subscribe((state) => {
    const nextState = { ...$formState.defaultState, ...state };
    // @ts-expect-error okk
    updateState({ ...nextState, isValidationPaused: !Boolean(nextState.validating) });
    updateFields();
  }, subscription);

  return $formState;
};

export { createFormState };
