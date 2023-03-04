import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createFormState } from './createFormState';

import type { Config as FFConfig } from 'final-form';

import { createApi } from './createApi';
import { createFields } from 'createFields';
import { subscription } from 'createFormState/subscription';

type FormConfig<FormValues> = Omit<
  FFConfig<FormValues>,
  'mutators' | 'debug' | 'destroyOnUnregister' | 'keepDirtyOnReinitialize'
>;

const createForm = <FormValues>(config: FormConfig<FormValues>) => {
  const ffForm = ffCreateForm(config);

  const domain = createDomain();
  const { $fields, fieldsApi } = createFields(domain, ffForm);
  const { $formState, formStateApi } = createFormState(domain, ffForm);
  const formApi = createApi(domain, ffForm, fieldsApi, formStateApi);

  ffForm.subscribe((state) => {
    formStateApi.update(state);
    fieldsApi.update();
  }, subscription);

  return { $formState, api: formApi, $fields, ffForm };
};

export { createForm };
