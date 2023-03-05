import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createApi } from './createApi';
import { createFields } from './createFields';
import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';
import type { FormSubscription } from './types';

export const createForm = <FormValues, T extends FormSubscription>(
  config: Omit<FFConfig<FormValues>, 'mutators' | 'debug'> & {
    subscribeOn: T;
  },
) => {
  const ffForm = ffCreateForm(config);

  const domain = createDomain();
  const { $fields, fieldsApi } = createFields<FormValues>(domain, ffForm);
  const { $formState, formStateApi } = createFormState<FormValues, T>({
    domain,
    form: ffForm,
    subscribeOn: config.subscribeOn,
  });

  const api = createApi<FormValues, T>(domain, ffForm, fieldsApi, formStateApi);

  return { $formState, api, $fields, ffForm };
};
