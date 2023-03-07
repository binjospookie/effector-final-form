import { createEffect } from 'effector';
import { fieldSubscriptionItems } from 'final-form';

import { normalizeSubscriptions } from './utils';

import type { FormApi as FFFormApi } from 'final-form';
import type { createFields } from './createFields';
import type { createFormState } from './createFormState';
import type { FormSubscription } from './types';

const createApi = <FormValues, T extends FormSubscription>(config: {
  finalForm: FFFormApi<FormValues>;
  fieldsApi: ReturnType<typeof createFields<FormValues>>['fieldsApi'];
  formStateApi: ReturnType<typeof createFormState<FormValues, T>>['formStateApi'];
}) => {
  const { finalForm, fieldsApi, formStateApi } = config;

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
      fieldsApi.update,
      // @ts-expect-error
      normalizeSubscriptions(fieldSubscriptionItems, subscribeOn),
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
    blurFx: createEffect(finalForm.blur),
    changeFx: createEffect(changeHandler),
    focusFx: createEffect(finalForm.focus),
    initialize: createEffect(finalForm.initialize),
    pauseValidation: createEffect(pauseValidationHandler),
    registerField: createEffect(registerFieldHandler),
    reset: createEffect(finalForm.reset),
    resetFieldState: createEffect(finalForm.resetFieldState),
    restart: createEffect(finalForm.restart),
    resumeValidation: createEffect(resumeValidationHandler),
    submitFx: createEffect(finalForm.submit),
  };

  return api;
};

export { createApi };
