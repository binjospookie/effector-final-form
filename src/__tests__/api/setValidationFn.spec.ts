import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.setValidationFn', () => {
  test('', async () => {
    const { $formState, api } = createForm<{ firstName: string }, ['values', 'errors']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'errors'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['error'],
      initialValue: 'John',
      validate: (v) => (v === 'Bob' ? 'Error' : undefined),
    });

    {
      field.api.focusFx();
      await field.api.changeFx('Bob');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
        expect(field.$state.getState().error).toBe('Error');
      });
    }

    {
      field.api.setValidationFn(() => 'New validation error');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'New validation error' });
        expect(field.$state.getState().error).toBe('New validation error');
      });
    }
  });
});
