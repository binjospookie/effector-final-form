import waitForExpect from 'wait-for-expect';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('validateOnBlur', () => {
  test('', async () => {
    const { $formState, api } = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'errors'],
      validateOnBlur: true,
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

      expect($formState.getState().errors).toStrictEqual({});
      expect(field.$state.getState().error).toBe(undefined);
    }

    {
      await field.api.blurFx();

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      });

      expect(field.$state.getState().error).toBe('Error');
    }

    {
      await field.api.focusFx();
      await field.api.changeFx('Steve');
      expect($formState.getState().errors).toStrictEqual({ firstName: 'Error' });
      expect(field.$state.getState().error).toBe('Error');
    }

    {
      await field.api.blurFx();
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      });
      expect(field.$state.getState().error).toBe(undefined);
    }
  });
});
