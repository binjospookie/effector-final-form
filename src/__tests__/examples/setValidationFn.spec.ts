import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('setValidationFn', () => {
  test('', async () => {
    const { $formState, api, $fields, setValidationFn } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John' },
      subscribeOn: ['values', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'Bob') {
          return { firstName: 'Error' };
        }
      },
    });

    await api.registerField({ name: 'firstName', subscribeOn: ['error'] });

    {
      api.focusFx('firstName');
      await api.changeFx({ name: 'firstName', value: 'Bob' });

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
        expect($fields.getState().firstName.error).toBe('Error');
      });
    }

    {
      setValidationFn(() => ({ firstName: 'New validation error' }));

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'New validation error' });
        expect($fields.getState().firstName.error).toBe('New validation error');
      });
    }
  });
});
