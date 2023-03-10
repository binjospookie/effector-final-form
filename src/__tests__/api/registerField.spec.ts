import { createStore } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('with base value', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      initialValue: 'defaultValue',
    });

    expect(form.$state.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$state.getState().value).toBe('defaultValue');
  });

  test('with value from $', async () => {
    const $initialValue = createStore('defaultValue');

    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      initialValue: $initialValue,
    });

    expect(form.$state.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$state.getState().value).toBe('defaultValue');
  });
});
