import { sample } from 'effector';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';
import type { createFields } from './createFields';
import type { createFormState } from './createFormState';
import type { FormSubscription } from './types';

const createApi = <FormValues, T extends FormSubscription>(config: {
  domain: Domain;
  finalForm: FFFormApi<FormValues>;
  fieldsApi: ReturnType<typeof createFields<FormValues>>['fieldsApi'];
  formStateApi: ReturnType<typeof createFormState<FormValues, T>>['formStateApi'];
}) => {
  const { domain, finalForm, fieldsApi, formStateApi } = config;

  type Form = typeof finalForm;
  type FieldNames = keyof FormValues;

  type ChangeConfig<T extends FieldNames> = { name: T; value?: FormValues[T] };
  type RegisterFieldParams = Parameters<Form['registerField']>;
  type RegisterFieldConfig = { name: RegisterFieldParams[0]; config?: RegisterFieldParams[3] };

  const changeHandler = ({ name, value }: ChangeConfig<FieldNames>) => finalForm.change(name, value);
  const registerFieldHandler = ({ name, config }: RegisterFieldConfig) => {
    finalForm.registerField(name, () => {}, {}, config);
  };

  const pauseValidationHandler = () => {
    formStateApi.setValidationPaused(true);
    finalForm.pauseValidation();
  };
  const resumeValidationHandler = () => {
    formStateApi.setValidationPaused(true);
    finalForm.pauseValidation();
  };

  const api = {
    blurFx: domain.effect(finalForm.blur),
    changeFx: domain.effect(changeHandler),
    focusFx: domain.effect(finalForm.focus),
    initialize: domain.effect(finalForm.initialize),
    pauseValidation: domain.effect(pauseValidationHandler),
    registerField: domain.effect(registerFieldHandler),
    reset: domain.effect(finalForm.reset),
    resetFieldState: domain.effect(finalForm.resetFieldState),
    restart: domain.effect(finalForm.restart),
    resumeValidation: domain.effect(resumeValidationHandler),
    submitFx: domain.effect(finalForm.submit),
  };

  sample({
    clock: [
      api.blurFx.done,
      api.changeFx.done,
      api.focusFx.done,
      api.initialize.done,
      api.registerField.done,
      api.reset.done,
      api.resetFieldState.done,
      api.restart.done,
    ],
    target: fieldsApi.update,
  });

  return api;
};

export { createApi };
