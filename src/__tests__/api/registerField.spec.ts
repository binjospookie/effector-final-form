import { createStore } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('with base value', async () => {
    const { $formState, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      config: { initialValue: 'defaultValue' },
    });

    expect($formState.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$state.getState().value).toBe('defaultValue');
  });

  test('with value from $', async () => {
    const $initialValue = createStore('defaultValue');

    const { $formState, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      config: { initialValue: $initialValue },
    });
    expect($formState.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$state.getState().value).toBe('defaultValue');
  });
});
