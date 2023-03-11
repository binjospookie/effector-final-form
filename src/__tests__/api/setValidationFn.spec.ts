import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.setValidationFn', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'errors'],
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

      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({ firstName: 'Error' });
        expect(field.$.getState().error).toBe('Error');
      });
    }

    {
      field.api.setValidationFn(() => 'New validation error');

      await waitForExpect(() => {
        expect(form.$.getState().errors).toStrictEqual({ firstName: 'New validation error' });
        expect(field.$.getState().error).toBe('New validation error');
      });
    }
  });
});
