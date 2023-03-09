import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

describe('formStateNullable', () => {
  test('', async () => {
    const { $formState, api } = createForm<{ firstName: string }>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'],
    });

    {
      expect($formState.getState().active).toBe(null);
      expect($formState.getState().errors).toStrictEqual({});
      expect($formState.getState().modified).toStrictEqual({});
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().touched).toStrictEqual({});
      expect($formState.getState().visited).toStrictEqual({});
    }

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: [],
      initialValue: 'John',
      validate: (v) => (v === 'Bob' ? 'Error' : undefined),
    });

    {
      await field.api.focusFx();

      expect($formState.getState().active).toBe('firstName');
      expect($formState.getState().errors).toStrictEqual({});
      expect($formState.getState().modified).toStrictEqual({ firstName: false });
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().touched).toStrictEqual({ firstName: false });
      expect($formState.getState().visited).toStrictEqual({ firstName: true });
    }

    {
      await field.api.changeFx('Bob');
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      });
    }

    {
      await field.api.changeFx('Steve');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      }, 3000);

      await api.submitFx();

      await waitForExpect(() => {
        expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      });
    }
  });
});
