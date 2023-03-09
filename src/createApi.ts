import { createEffect, createEvent, createStore, is, sample, Store } from 'effector';
import { FieldState, fieldSubscriptionItems } from 'final-form';

import { normalizeSubscriptions, pick } from './utils';

import type { FormApi as FFFormApi } from 'final-form';
import type { createFormState } from './createFormState';
import type { FormSubscription } from './types';

const createApi = <FormValues, T extends FormSubscription>(config: {
  finalForm: FFFormApi<FormValues>;
  formStateApi: ReturnType<typeof createFormState<FormValues, T>>['formStateApi'];
}) => {
  const { finalForm, formStateApi } = config;

  type Form = typeof finalForm;
  type FieldNames = keyof FormValues;

  type RegisterFieldParams = Parameters<Form['registerField']>;
  type RegisterFieldConfig<P, T extends readonly (keyof RegisterFieldParams[2])[]> = {
    name: RegisterFieldParams[0];
    subscribeOn: T;
    config?: Omit<NonNullable<RegisterFieldParams[3]>, 'initialValue'> & {
      initialValue?: P | Store<P>;
    };
  };

  const makeChangeHandler =
    <T extends FieldNames>(name: T) =>
    (value?: FormValues[T]) =>
      finalForm.change(name, value);
  const registerField = <P, T extends readonly (keyof RegisterFieldParams[2])[]>({
    name,
    subscribeOn,
    config = {},
  }: RegisterFieldConfig<P, T>) => {
    const { initialValue, ...restConfig } = config;
    const parsedConfig = {
      ...restConfig,
      initialValue: is.store(initialValue) ? initialValue.getState() : initialValue,
    };

    type State = Pick<FieldState<P>, 'value' | (typeof subscribeOn)[number]>;

    const subscriber = createEvent<any>();

    finalForm.registerField(
      name,
      subscriber,
      normalizeSubscriptions(fieldSubscriptionItems, [...subscribeOn, 'value']),
      parsedConfig,
    );

    // @ts-expect-error
    const normalizedState = pick([...subscribeOn, 'value'], finalForm.getFieldState(name));
    // fixme: remove keys that not presented in subscribeOn
    const $state = createStore<State>(normalizedState as unknown as State);

    sample({
      clock: subscriber.filterMap(({ blur, change, focus, ...rest }) => (rest.name === name ? rest : undefined)),
      target: $state,
    });

    const changeHandler = makeChangeHandler(name);

    const api = {
      blurFx: createEffect(() => {
        finalForm.blur(name);
      }),
      changeFx: createEffect(changeHandler),
      focusFx: createEffect(() => {
        finalForm.focus(name);
      }),
      resetState: createEffect(() => {
        finalForm.resetFieldState(name);
      }),
    };

    return { api, $state };
  };

  const pauseValidationHandler = () => {
    finalForm.pauseValidation();
    formStateApi.setValidationPaused(true);
  };
  const resumeValidationHandler = () => {
    finalForm.resumeValidation();
    formStateApi.setValidationPaused(false);
  };

  const api = {
    pauseValidation: createEffect(pauseValidationHandler), // form api
    resumeValidation: createEffect(resumeValidationHandler), // form api

    registerField, // form api
    reset: createEffect(finalForm.reset), // form api
    restart: createEffect(finalForm.restart), // form api
    submitFx: createEffect(finalForm.submit), // form api
  };

  return api;
};

export { createApi };
