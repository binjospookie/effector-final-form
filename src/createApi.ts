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
  };

  const pauseValidationHandler = () => {
    formStateApi.setValidationPaused(true);
    form.pauseValidation();
  };
  const resumeValidationHandler = () => {
    formStateApi.setValidationPaused(true);
    form.pauseValidation();
  };

  const api = {
    blurFx: domain.effect(form.blur),
    changeFx: domain.effect(changeHandler),
    focusFx: domain.effect(form.focus),
    initialize: domain.effect(form.initialize),
    pauseValidation: domain.effect(pauseValidationHandler),
    registerField: domain.effect(registerFieldHandler),
    reset: domain.effect(form.reset),
    resetFieldState: domain.effect(form.resetFieldState),
    restart: domain.effect(form.restart),
    resumeValidation: domain.effect(resumeValidationHandler),
    submitFx: domain.effect(form.submit),
  };

  sample({
    clock: [
      api.blurFx.done,
      api.changeFx.done,
      api.focusFx.done,
      api.initialize.done,
      api.registerField.done,
      api.reset.done,
      api.resetFieldState.done,
      api.restart.done,
    ],
    target: fieldsApi.update,
  });

  return api;
};

export { createApi };
