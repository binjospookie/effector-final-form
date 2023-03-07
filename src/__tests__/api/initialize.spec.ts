import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.initialize', () => {
  test('without initialValues', async () => {
    const { $formState, $fields, api } = createForm<{ firstName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });

    {
      api.initialize({ firstName: 'John' });
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }

    {
      api.registerField({ name: 'firstName', subscribeOn: ['initial'] });
      expect($fields.getState().firstName.initial).toStrictEqual('John');
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }
  });

  test('with initialValues', async () => {
    const { $formState, $fields, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });

    {
      api.initialize({ firstName: 'John' });
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }

    {
      api.registerField({ name: 'firstName', subscribeOn: ['initial'] });
      expect($fields.getState().firstName.initial).toStrictEqual('John');
      expect($formState.getState().initialValues).toStrictEqual({ firstName: 'John' });
    }
  });
});
