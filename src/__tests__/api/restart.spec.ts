import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.restart', () => {
  test('base', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues', 'errors'],
    });

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      initialValue: '',
      validate: (v) => (v === undefined ? 'error' : undefined),
    });

    {
      await field.api.changeFx(undefined);

      expect(field.$state.getState().value).toBe(null);
      await waitForExpect(() => {
        expect(form.$state.getState().errors).toStrictEqual({ firstName: 'error' });
      });
    }

    {
      await form.api.restart();

      expect(field.$state.getState().value).toBe('');

      await waitForExpect(() => {
        expect(form.$state.getState().errors).toStrictEqual({});
      });
    }
  });
});
