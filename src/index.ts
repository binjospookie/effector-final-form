import { createEffect } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createApi } from './createApi';
import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';
import type { FormSubscription } from './types';

const createForm = <FormValues extends {}, T extends FormSubscription = FormSubscription>(
  config: Omit<FFConfig<FormValues>, 'debug' | 'initialValues' | 'validate'> & {
    subscribeOn: T;
  },
) => {
  const { subscribeOn, ...finalFormConfig } = config;

  const submitFx = createEffect(finalFormConfig.onSubmit);

  const finalForm = ffCreateForm({
    ...finalFormConfig,
    onSubmit: async (x: FormValues) => {
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

  const { $state, formStateApi } = createFormState<FormValues, T>({
    finalForm,
    subscribeOn,
  });

  const baseApi = createApi<FormValues, T>({ finalForm, formStateApi, revalidateFx });

  return {
    api: {
      ...baseApi,
      revalidateFx,
      setSubmitFn: submitFx.use,
    },
    $state,
  };
};

export { createForm };
