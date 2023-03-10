import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

describe('formStateNullable', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'],
    });

    {
      expect(form.$state.getState().active).toBe(null);
      expect(form.$state.getState().errors).toStrictEqual({});
      expect(form.$state.getState().modified).toStrictEqual({});
      expect(form.$state.getState().submitErrors).toBe(null);
      expect(form.$state.getState().touched).toStrictEqual({});
      expect(form.$state.getState().visited).toStrictEqual({});
    }

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: [],
      initialValue: 'John',
      validate: (v) => (v === 'Bob' ? 'Error' : undefined),
    });

    {
      await field.api.focusFx();

      expect(form.$state.getState().active).toBe('firstName');
      expect(form.$state.getState().errors).toStrictEqual({});
      expect(form.$state.getState().modified).toStrictEqual({ firstName: false });
      expect(form.$state.getState().submitErrors).toBe(null);
      expect(form.$state.getState().touched).toStrictEqual({ firstName: false });
      expect(form.$state.getState().visited).toStrictEqual({ firstName: true });
    }

    {
      await field.api.changeFx('Bob');
      await waitForExpect(() => {
        expect(form.$state.getState().errors).toStrictEqual({ firstName: 'Error' });
      });
    }

    {
      await field.api.changeFx('Steve');

      await waitForExpect(() => {
        expect(form.$state.getState().errors).toStrictEqual({});
      }, 3000);

      await form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$state.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      });
    }
  });
});
