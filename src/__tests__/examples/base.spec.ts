import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

// import { createForm } from 'effector-final-form';
import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('example', () => {
  test('', async () => {
    const { $formState, $fields, api } = createForm({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === 'Incorrect' ? { firstName: 'Submit Error' } : undefined;
      },
      validate: (f) => (f.firstName === '' ? { firstName: 'Can not be empty' } : undefined),
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'errors', 'submitting', 'submitSucceeded', 'submitFailed', 'submitErrors'],
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['value', 'error', 'initial'],
    });

    field.api.changeFx('');

    await waitForExpect(() => {
      expect($fields.getState().firstName.error).toBe('Can not be empty');
    });
    expect($fields.getState().firstName.initial).toBe('');
    expect($fields.getState().firstName.value).toBe('');

    expect($formState.getState().errors).toStrictEqual({ firstName: 'Can not be empty' });
    expect($formState.getState().values).toStrictEqual({ firstName: '' });
    expect($formState.getState().submitting).toBe(false);
    expect($formState.getState().submitSucceeded).toBe(false);
    expect($formState.getState().submitFailed).toBe(false);
    expect($formState.getState().submitErrors).toBe(null);

    {
      await field.api.changeFx('Incorrect');

      await waitForExpect(() => {
        expect($fields.getState().firstName.error).toBe(undefined);
        expect($fields.getState().firstName.value).toBe('Incorrect');
        expect($formState.getState().errors).toStrictEqual({});
      });
    }

    {
      const submitPromise = api.submitFx();

      expect($formState.getState().submitting).toBe(true);

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await field.api.changeFx('John');

      expect($fields.getState().firstName.error).toBe(undefined);
      expect($fields.getState().firstName.value).toBe('John');
      expect($formState.getState().errors).toStrictEqual({});

      const submitPromise = api.submitFx();

      await waitForExpect(() => {
        expect($formState.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect($formState.getState().submitting).toBe(false);
      });
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }
  });
});
