import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.initialize', () => {
  test('without initialValues', async () => {
    const { $formState, api } = createForm<{ firstName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });

    {
      api.initialize({ firstName: 'John' });
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }

    {
      const field = api.registerField({ name: 'firstName', subscribeOn: ['initial'] });
      expect(field.$state.getState().initial).toStrictEqual('John');
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }
  });

  test('with initialValues', async () => {
    const { $formState, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });

    {
      api.initialize({ firstName: 'John' });
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }

    {
      const field = api.registerField({ name: 'firstName', subscribeOn: ['initial'] });
      expect(field.$state.getState().initial).toStrictEqual('John');
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }
  });
});
