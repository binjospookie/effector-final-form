import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';

const createApi = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
) => {
  type Form = typeof form;

  const api = {
    blurFx: domain.effect(form.blur),
    changeFx: domain.effect(form.change),
    focusFx: domain.effect(form.focus),
    initialize: domain.event<Form['initialize']>(),
    pauseValidation: domain.event(),
    registerField: domain.event<Form['registerField']>(),
    reset: domain.event<Form['reset']>(),
    resetFieldState: domain.event<Form['resetFieldState']>(),
    restart: domain.event<Form['restart']>(),
    resumeValidation: domain.event(),
    submitFx: domain.effect(form.submit),
  };

  // @ts-expect-error
  api.initialize.watch(form.initialize);
  api.pauseValidation.watch(form.pauseValidation);
  // @ts-expect-error
  api.registerField.watch(form.registerField);
  // @ts-expect-error
  api.reset.watch(form.reset);
  // @ts-expect-error
  api.resetFieldState.watch(form.resetFieldState);
  // @ts-expect-error
  api.restart.watch(form.restart);
  api.resumeValidation.watch(form.resumeValidation);

  return api;
};

export { createApi };
