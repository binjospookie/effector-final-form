import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

describe('formStateNullable', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'],
    });

    {
      expect(form.$.getState().active).toBe(null);
      expect(form.$.getState().errors).toStrictEqual({});
      expect(form.$.getState().modified).toStrictEqual({});
      expect(form.$.getState().submitErrors).toBe(null);
      expect(form.$.getState().touched).toStrictEqual({});
      expect(form.$.getState().visited).toStrictEqual({});
    }

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: [],
      initialValue: 'John',
      validate: (v) => (v === 'Bob' ? 'Error' : undefined),
    });

    {
      await field.api.focusFx();

      expect(form.$.getState().active).toBe('firstName');
      expect(form.$.getState().errors).toStrictEqual({});
      expect(form.$.getState().modified).toStrictEqual({ firstName: false });
      expect(form.$.getState().submitErrors).toBe(null);
      expect(form.$.getState().touched).toStrictEqual({ firstName: false });
      expect(form.$.getState().visited).toStrictEqual({ firstName: true });
    }

    {
      await field.api.changeFx('Bob');
      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({ firstName: 'Error' });
      });
    }

    {
      await field.api.changeFx('Steve');

      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({});
      }, 3000);

      await form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      });
    }
  });
});
