import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('validateOnBlur', () => {
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

    const field = api.registerField({ name: 'firstName', subscribeOn: ['error'] });

    {
      field.api.focusFx();
      await field.api.changeFx('Bob');

      expect($formState.getState().errors).toStrictEqual({});
      expect($fields.getState().firstName.error).toBe(undefined);
    }

    {
      await field.api.blurFx();

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      });

      expect($fields.getState().firstName.error).toBe('Error');
    }

    {
      await field.api.focusFx();
      await field.api.changeFx('Steve');
      expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      expect($fields.getState().firstName.error).toBe('Error');
    }

    {
      await field.api.blurFx();
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      });
      expect($fields.getState().firstName.error).toBe(undefined);
    }
  });
});
