import { createEffect, is } from 'effector';
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

  const initialValues = is.store(config.initialValues) ? config.initialValues.getState() : config.initialValues;

  const validateFx = createEffect(finalFormConfig.validate ?? baseValidator);
  const submitFx = createEffect(finalFormConfig.onSubmit);

  const finalForm = ffCreateForm({
    ...finalFormConfig,
    initialValues,
    validate: validateFx,
    onSubmit: async (x) => {
      try {
        return await submitFx(x);
      } catch (e) {
        return e;
      }
    },
    mutators: {
      __update__: () => {},
    },
  });

  const revalidateFx = createEffect(() => {
    // @ts-expect-error
    finalForm.mutators.__update__();
  });

  const { $fields, $registeredFields, fieldsApi } = createFields<FormValues>({ finalForm });
  const { $formState, formStateApi } = createFormState<FormValues, T>({
    finalForm,
    subscribeOn,
  });

  const baseApi = createApi<FormValues, T>({ finalForm, fieldsApi, formStateApi });

  // we need an error in field on start (like in form state)
  revalidateFx();

  const setValidationFn = (fn: Parameters<typeof validateFx.use>[0]) => {
    validateFx.use(fn);
    revalidateFx();
  };

  const setSubmitFn = (fn: Parameters<typeof submitFx.use>[0]) => {
    submitFx.use(fn);
  };

  return {
    api: {
      ...baseApi,
      revalidateFx,
      setSubmitFn,
      setValidationFn,
    },
    $fields,
    $formState,
    $registeredFields,
  };
};

export { createForm };
