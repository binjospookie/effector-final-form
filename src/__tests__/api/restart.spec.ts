import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.restart', () => {
  test('base', async () => {
    const { api, $formState } = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues', 'errors'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value'],
      initialValue: '',
      validate: (v) => (v === undefined ? 'error' : undefined),
    });

    {
      await field.api.changeFx(undefined);

      expect(field.$state.getState().value).toBe(undefined);
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'error' });
      });
    }

    {
      await api.restart();

      expect(field.$state.getState().value).toBe('');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      });
    }
  });
});
