import { createDomain } from 'effector';
import { createForm as ffCreateForm } from 'final-form';

import type { Config as FFConfig } from 'final-form';

type FormConfig<T> = Omit<FFConfig<T>, 'mutators' | 'debug' | 'destroyOnUnregister' | 'keepDirtyOnReinitialize'>;

const createForm = <FormValues>(config: FormConfig<FormValues>) => {
  const domain = createDomain();

  const form = ffCreateForm(config);

  return { form };
};
