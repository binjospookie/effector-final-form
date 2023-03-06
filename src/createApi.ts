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
  type RegisterFieldConfig<T extends readonly (keyof RegisterFieldParams[2])[]> = {
    name: RegisterFieldParams[0];
    subscribeOn: T;
    config?: RegisterFieldParams[3];
  };

  const changeHandler = ({ name, value }: ChangeConfig<FieldNames>) => finalForm.change(name, value);
  const registerFieldHandler = <T extends readonly (keyof RegisterFieldParams[2])[]>({
    name,
    subscribeOn,
    config,
  }: RegisterFieldConfig<T>) => {
    finalForm.registerField(
      name,
      () => {},
      subscribeOn.reduce((acc, k) => ({ ...acc, [k]: true }), {}),
      config,
    );
  };

  const pauseValidationHandler = () => {
    finalForm.pauseValidation();
    formStateApi.setValidationPaused(true);
  };
  const resumeValidationHandler = () => {
    finalForm.resumeValidation();
    formStateApi.setValidationPaused(false);
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
      api.blurFx.finally,
      api.changeFx.finally,
      api.focusFx.finally,
      api.initialize.finally,
      api.registerField.finally,
      api.reset.finally,
      api.resetFieldState.finally,
      api.restart.finally,
      api.submitFx.finally,
    ],
    target: fieldsApi.update,
  });

  return api;
};

export { createApi };
