import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.setValidationFn', () => {
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
    });

    const field = api.registerField({ name: 'firstName', subscribeOn: ['error'] });

    {
      field.api.focusFx();
      await field.api.changeFx('Bob');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
        expect($fields.getState().firstName.error).toBe('Error');
      });
    }

    {
      api.setValidationFn(() => ({ firstName: 'New validation error' }));

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'New validation error' });
        expect($fields.getState().firstName.error).toBe('New validation error');
      });
    }
  });
});
