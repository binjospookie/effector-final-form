import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('', async () => {
    const { $formState, api, $fields } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John' },
      subscribeOn: ['values', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'Bob') {
          return { firstName: 'Error' };
        }
      },
      validateOnBlur: true,
    });

    await api.registerField({ name: 'firstName', subscribeOn: ['error'] });

    {
      api.focusFx('firstName');
      await api.changeFx({ name: 'firstName', value: 'Bob' });

      expect($formState.getState().errors).toStrictEqual({});
      expect($fields.getState().firstName.error).toBe(undefined);
    }

    {
      await api.blurFx('firstName');
      expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      expect($fields.getState().firstName.error).toBe('Error');
    }

    {
      api.focusFx('firstName');
      await api.changeFx({ name: 'firstName', value: 'Steve' });
      expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      expect($fields.getState().firstName.error).toBe('Error');
    }

    {
      await api.blurFx('firstName');
      expect($formState.getState().errors).toStrictEqual({});
      expect($fields.getState().firstName.error).toBe(undefined);
    }
  });
});
