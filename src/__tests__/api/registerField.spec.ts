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

    expect(form.$.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$.getState().value).toBe('defaultValue');
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

    expect(form.$.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$.getState().value).toBe('defaultValue');
  });
});
