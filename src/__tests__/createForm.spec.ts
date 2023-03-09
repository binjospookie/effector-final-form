import { createStore } from 'effector';
import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('without initial values', () => {
    const { $formState } = createForm<{ firstName: string }, ['initialValues', 'values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['initialValues', 'values'],
    });

    expect($formState.getState()).toStrictEqual({
      initialValues: null,
      isValidationPaused: false,
      values: {},
    });
  });

  test('with initial values from kv', () => {
    const { $formState } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John' },
      subscribeOn: ['initialValues', 'values'],
    });

    expect($formState.getState()).toStrictEqual({
      initialValues: { firstName: 'John' },
      isValidationPaused: false,
      values: { firstName: 'John' },
    });
  });

  test('with initial values from $', () => {
    const $initialValues = createStore({ firstName: 'John' });

    const { $formState } = createForm({
      onSubmit: onSubmitMock,
      initialValues: $initialValues,
      subscribeOn: ['initialValues', 'values'],
    });

    expect($formState.getState()).toStrictEqual({
      initialValues: { firstName: 'John' },
      isValidationPaused: false,
      values: { firstName: 'John' },
    });
  });
});
