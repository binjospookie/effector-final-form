import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.restart', () => {
  test('with initialValues', async () => {
    const { $fields, api, $formState } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === undefined) {
          return { firstName: 'error' };
        }
      },
    });

    {
      api.registerField({ name: 'firstName', subscribeOn: ['value'] });
      await api.changeFx({ name: 'firstName', value: undefined });

      expect($fields.getState().firstName.value).toBe(undefined);
      expect($formState.getState().errors).toStrictEqual({ firstName: 'error' });
    }

    {
      await api.restart();

      expect($fields.getState().firstName.value).toBe('');
      expect($formState.getState().errors).toStrictEqual({});
    }
  });
  test('with initialValues', async () => {
    const { $fields, api, $formState } = createForm<{ firstName: string }, ['values', 'initialValues', 'errors']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'John') {
          return { firstName: 'error' };
        }
      },
    });

    {
      api.registerField({ name: 'firstName', subscribeOn: ['value'] });
      api.changeFx({ name: 'firstName', value: 'John' });

      expect($fields.getState().firstName.value).toBe('John');
      expect($formState.getState().errors).toStrictEqual({ firstName: 'error' });
    }

    {
      await api.restart();

      expect($fields.getState().firstName.value).toBe(undefined);
      expect($formState.getState().errors).toStrictEqual({});
    }
  });
});
