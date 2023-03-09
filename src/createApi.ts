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

  type RegisterFieldParams = Parameters<Form['registerField']>;
  type RegisterFieldConfig<T extends readonly (keyof RegisterFieldParams[2])[]> = {
    name: RegisterFieldParams[0];
    subscribeOn: T;
    config?: RegisterFieldParams[3];
  };

  const makeChangeHandler =
    <T extends FieldNames>(name: T) =>
    (value?: FormValues[T]) =>
      finalForm.change(name, value);
  const registerFieldHandler = <T extends readonly (keyof RegisterFieldParams[2])[]>({
    name,
    subscribeOn,
    config,
  }: RegisterFieldConfig<T>) => {
    finalForm.registerField(
      name,
      fieldsApi.update,
      normalizeSubscriptions(fieldSubscriptionItems, [...subscribeOn, 'value']),
      config,
    );

    const changeHandler = makeChangeHandler(name);

    const api = {
      blurFx: createEffect(() => {
        finalForm.blur(name);
      }),
      changeFx: createEffect(changeHandler),
      focusFx: createEffect(() => {
        finalForm.focus(name);
      }),
      resetState: createEffect(() => {
        finalForm.resetFieldState(name);
      }),
    };

    return { api };
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
    initialize: createEffect(finalForm.initialize), // form api
    pauseValidation: createEffect(pauseValidationHandler), // form api
    registerField: registerFieldHandler, // form api
    reset: createEffect(finalForm.reset), // form api
    restart: createEffect(finalForm.restart), // form api
    resumeValidation: createEffect(resumeValidationHandler), // form api
    submitFx: createEffect(finalForm.submit), // form api
  };

  return api;
};

export { createApi };
