import { sample } from 'effector';
import { createFields } from './createFields';
import { createFormState } from './createFormState';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';

const createApi = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
  fieldsApi: ReturnType<typeof createFields<FormValues, InitialFormValues>>['fieldsApi'],
  formStateApi: ReturnType<typeof createFormState<FormValues, InitialFormValues>>['formStateApi'],
) => {
  type Form = typeof form;
  type FieldNames = keyof FormValues;

  type ChangeConfig<F extends FieldNames> = { name: F; value?: FormValues[F] };
  type RegisterFieldParams = Parameters<Form['registerField']>;
  type RegisterFieldConfig = { name: RegisterFieldParams[0]; config?: RegisterFieldParams[3] };

  const changeHandler = ({ name, value }: ChangeConfig<FieldNames>) => form.change(name, value);
  const registerFieldHandler = ({ name, config }: RegisterFieldConfig) => {
    form.registerField(name, () => {}, {}, config);
    fieldsApi.update();
  };

  const api = {
    blurFx: domain.effect(form.blur),
    changeFx: domain.effect(changeHandler),
    focusFx: domain.effect(form.focus),
    initialize: domain.event<Parameters<Form['initialize']>[0]>(),
    pauseValidation: domain.event(),
    registerField: domain.event<RegisterFieldConfig>(),
    reset: domain.event<Parameters<Form['reset']>[0]>(),
    resetFieldState: domain.event<FieldNames>(),
    restart: domain.event<Parameters<Form['restart']>[0]>(),
    resumeValidation: domain.event(),
    submitFx: domain.effect(form.submit),
  };

  sample({
    clock: api.pauseValidation,
    fn: () => true,
    target: formStateApi.setValidationPaused,
  }).watch(form.pauseValidation);

  sample({
    clock: api.pauseValidation,
    fn: () => false,
    target: formStateApi.setValidationPaused,
  }).watch(form.resumeValidation);

  api.initialize.watch(form.initialize);
  api.registerField.watch(registerFieldHandler);
  api.reset.watch(form.reset);
  api.resetFieldState.watch(form.resetFieldState);
  api.restart.watch(form.restart);

  return api;
};

export { createApi };
