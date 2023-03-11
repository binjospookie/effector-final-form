import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('validateOnBlur', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'errors'],
      validateOnBlur: true,
    });

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['error'],
      initialValue: 'John',
      validate: (v) => (v === 'Bob' ? 'Error' : undefined),
    });

    {
      field.api.focusFx();
      await field.api.changeFx('Bob');

      expect(form.$.getState().errors).toStrictEqual({});
      expect(field.$.getState().error).toBe(null);
    }

    {
      await field.api.blurFx();

      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({ firstName: 'Error' });
      });

      expect(field.$.getState().error).toBe('Error');
    }

    {
      await field.api.focusFx();
      await field.api.changeFx('Steve');
      expect(form.$.getState().errors).toStrictEqual({ firstName: 'Error' });
      expect(field.$.getState().error).toBe('Error');
    }

    {
      await field.api.blurFx();
      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({});
      });
      expect(field.$.getState().error).toBe(null);
    }
  });
});
