import { createEffect, createEvent, createStore, is, sample } from 'effector';
import { fieldSubscriptionItems } from 'final-form';

import { normalizeSubscriptions, pick } from './utils';

import type { Store } from 'effector';
import type { FormApi as FFFormApi, FieldState as FFFieldState } from 'final-form';
import type { createFormState } from './createFormState';
import type { FormSubscription, ValidationResult } from './types';

const baseValidator = <P>(_?: P) => undefined;

const createApi = <FormValues, T extends FormSubscription>(config: {
  finalForm: FFFormApi<FormValues>;
  formStateApi: ReturnType<typeof createFormState<FormValues, T>>['formStateApi'];
  revalidateFx: () => void;
}) => {
  const { finalForm, formStateApi, revalidateFx } = config;

  type Form = typeof finalForm;
  type FieldNames = keyof FormValues;

  type RegisterFieldParams = Parameters<Form['registerField']>;
  type RegisterFieldConfig<P, T extends readonly (keyof RegisterFieldParams[2])[]> = {
    name: RegisterFieldParams[0];
    subscribeOn: T;
    initialValue?: P | Store<P>;
    validate?: (value?: P) => ValidationResult;
    config?: Omit<NonNullable<RegisterFieldParams[3]>, 'initialValue' | 'getValidator'>;
  };

  const makeChangeHandler =
    <T extends FieldNames>(name: T) =>
    (value?: FormValues[T]) =>
      finalForm.change(name, value);
  const registerField = <
    P,
    T extends readonly (keyof RegisterFieldParams[2])[] = readonly (keyof RegisterFieldParams[2])[],
  >({
    name,
    subscribeOn,
    config = {},
    initialValue,
    validate,
  }: RegisterFieldConfig<P, T>) => {
    const validateFx = createEffect<P | undefined, ValidationResult>(validate ?? baseValidator);

    const parsedConfig = {
      ...config,
      initialValue: is.store(initialValue) ? initialValue.getState() : initialValue,
      getValidator: (_?: P) => validateFx,
    };

    type State = Pick<FFFieldState<P>, 'value' | (typeof subscribeOn)[number]>;

    const subscriber = createEvent<any>();

    finalForm.batch(() => {
      finalForm.registerField(
        name,
        subscriber,
        normalizeSubscriptions(fieldSubscriptionItems, [...subscribeOn, 'name', 'value']),
        // @ts-expect-error
        parsedConfig,
      );

      revalidateFx();
    });

    // @ts-expect-error
    const normalizedState = pick([...subscribeOn, 'value'], finalForm.getFieldState(name));
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
      setValidationFn: (fn: Required<typeof validate>) => {
        // @ts-expect-error 123
        validateFx.use(fn);
        revalidateFx();
      },
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
    registerField, // form api
    reset: createEffect(finalForm.reset), // form api
    restart: createEffect(finalForm.restart), // form api
    resumeValidation: createEffect(resumeValidationHandler), // form api
    submitFx: createEffect(finalForm.submit), // form api
  };

  return api;
};

export { createApi };
