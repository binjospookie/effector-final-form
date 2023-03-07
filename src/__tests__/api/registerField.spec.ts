import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('without initialValues', async () => {
    const { $formState, $fields, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    api.registerField({ name: 'firstName', subscribeOn: ['value'], config: { defaultValue: 'defaultValue' } });
    expect($formState.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect($fields.getState().firstName.value).toBe('defaultValue');
  });

  test('with initialValues', async () => {
    const { $formState, $fields, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });

    api.registerField({ name: 'firstName', subscribeOn: ['value'], config: { defaultValue: 'defaultValue' } });
    expect($formState.getState().values).toStrictEqual({ firstName: '' });
    expect($fields.getState().firstName.value).toBe('');
  });
});
