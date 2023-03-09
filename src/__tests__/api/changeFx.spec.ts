import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.changeFx', () => {
  test('without initialValues', async () => {
    const { $formState, $fields, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = api.registerField({ name: 'firstName', subscribeOn: ['value'] });

    {
      expect($formState.getState().values).toStrictEqual({});
      expect($fields.getState().firstName.value).toBe(undefined);
    }

    {
      await field.api.changeFx('John');
      expect($formState.getState().values).toStrictEqual({ firstName: 'John' });
      expect($fields.getState().firstName.value).toBe('John');
    }
  });

  test('with initialValues', async () => {
    const { $formState, $fields, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });

    const field = api.registerField({ name: 'firstName', subscribeOn: ['value'] });

    {
      expect($formState.getState().values).toStrictEqual({ firstName: '' });
      expect($fields.getState().firstName.value).toBe('');
    }

    {
      await field.api.changeFx('John');
      expect($formState.getState().values).toStrictEqual({ firstName: 'John' });
      expect($fields.getState().firstName.value).toBe('John');
    }
  });
});
