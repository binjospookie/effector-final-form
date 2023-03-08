import { createEffect } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createApi } from './createApi';
import { createFields } from './createFields';
import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';
import type { FormSubscription } from './types';

const baseValidator = () => undefined;

const createForm = <FormValues, T extends FormSubscription>(
  config: Omit<FFConfig<FormValues>, 'debug'> & {
    subscribeOn: T;
  },
) => {
  const { subscribeOn, ...finalFormConfig } = config;

  const validationFx = createEffect(finalFormConfig.validate ?? baseValidator);
  const finalForm = ffCreateForm({
    ...finalFormConfig,
    validate: validationFx,
    mutators: {
      __update__: () => {},
    },
  });

  const validateFx = createEffect(() => {
    // @ts-expect-error
    finalForm.mutators.__update__();
  });

  const { $fields, $registeredFields, fieldsApi } = createFields<FormValues>({ finalForm });
  const { $formState, formStateApi } = createFormState<FormValues, T>({
    finalForm,
    subscribeOn,
  });

  const api = createApi<FormValues, T>({ finalForm, fieldsApi, formStateApi });

  // we need an error in field on start (like in form state)
  validateFx();

  const setValidationFn = (fn: Parameters<typeof validationFx.use>[0]) => {
    validationFx.use(fn);
    validateFx();
  };

  return {
    $formState,
    api: {
      ...api,
      validateFx,
      setValidationFn,
    },
    $fields,
    $registeredFields,
  };
};

export { createForm };
