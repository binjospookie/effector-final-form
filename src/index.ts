import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';

import { createApi } from './createApi';
import { createFields } from './createFields';

type FormConfig<FormValues> = Omit<FFConfig<FormValues>, 'mutators' | 'debug'> & {
  subscribeOn: Parameters<typeof createFormState>[0]['subscribeOn'];
};

export const createForm = <FormValues>(config: FormConfig<FormValues>) => {
  const ffForm = ffCreateForm(config);

  const domain = createDomain();
  const { $fields, fieldsApi } = createFields<FormValues>(domain, ffForm);
  const { $formState, formStateApi } = createFormState<FormValues>({
    domain,
    form: ffForm,
    subscribeOn: config.subscribeOn,
  });
  const api = createApi<FormValues>(domain, ffForm, fieldsApi, formStateApi);

  return { $formState, api, $fields, ffForm };
};
