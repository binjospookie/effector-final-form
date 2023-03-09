import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('without initialValues', async () => {
    const { $formState, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      config: { defaultValue: 'defaultValue' },
    });

    expect($formState.getState().values).toStrictEqual({ firstName: 'defaultValue' });
    expect(field.$state.getState().value).toBe('defaultValue');
  });

  test('with initialValues', async () => {
    const { $formState, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      config: { defaultValue: 'defaultValue' },
    });
    expect($formState.getState().values).toStrictEqual({ firstName: '' });
    expect(field.$state.getState().value).toBe('');
  });
});
