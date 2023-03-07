import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

describe('formStateNullable', () => {
  test('', async () => {
    const { $formState, api } = createForm({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      initialValues: { firstName: 'John' },
      subscribeOn: ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'],
      validate: (f) => (f.firstName === 'Bob' ? { firstName: 'Error' } : undefined),
    });

    {
      expect($formState.getState().active).toBe(null);
      expect($formState.getState().errors).toStrictEqual({});
      expect($formState.getState().modified).toStrictEqual({});
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().touched).toStrictEqual({});
      expect($formState.getState().visited).toStrictEqual({});
    }

    {
      await api.registerField({ name: 'firstName', subscribeOn: [] });
      await api.focusFx('firstName');

      expect($formState.getState().active).toBe('firstName');
      expect($formState.getState().errors).toStrictEqual({});
      expect($formState.getState().modified).toStrictEqual({ firstName: false });
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().touched).toStrictEqual({ firstName: false });
      expect($formState.getState().visited).toStrictEqual({ firstName: true });
    }

    {
      await api.changeFx({ name: 'firstName', value: 'Bob' });
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      });
    }

    {
      await api.changeFx({ name: 'firstName', value: 'Steve' });

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
