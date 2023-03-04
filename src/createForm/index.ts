import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import { createFormState } from 'createFormState';

import type { Config as FFConfig } from 'final-form';

type FormConfig<FormValues> = Omit<
  FFConfig<FormValues>,
  'mutators' | 'debug' | 'destroyOnUnregister' | 'keepDirtyOnReinitialize'
>;

const createForm = <FormValues>(config: FormConfig<FormValues>) => {
  const ffForm = ffCreateForm(config);

  const domain = createDomain();
  const $formState = createFormState(domain, ffForm);
  ffForm.getRegisteredFields()
  // const $fields = domain.store();

  ffForm.getState()?.validating

  return { ffForm, $formState };
};

export { createForm };
