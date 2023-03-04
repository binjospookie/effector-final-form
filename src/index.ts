import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';

import { createApi } from './createApi';
import { createFields } from 'createFields';

type FormConfig<FormValues> = Omit<
  FFConfig<FormValues>,
  'mutators' | 'debug' | 'destroyOnUnregister' | 'keepDirtyOnReinitialize'
>;

const createForm = <FormValues>(config: FormConfig<FormValues>) => {
  const ffForm = ffCreateForm(config);

  const domain = createDomain();
  const { $fields, updateFields } = createFields(domain, ffForm);
  const $formState = createFormState(domain, ffForm, updateFields);
  const api = createApi(domain, ffForm, updateFields);

  return { $formState, api, $fields, ffForm };
};

export { createForm };
