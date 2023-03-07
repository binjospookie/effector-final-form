import { allSettled } from 'effector';
import { vi } from 'vitest';

// import { createForm } from 'effector-final-form';
import { createForm } from '../../index';

vi.useFakeTimers();

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

    api.registerField({
      name: 'firstName',
      subscribeOn: ['value', 'error', 'initial'],
    });

    {
      await api.changeFx({ name: 'firstName', value: '' });
      expect($fields.getState().firstName.error).toBe('Can not be empty');
      expect($fields.getState().firstName.initial).toBe('');
      expect($fields.getState().firstName.value).toBe('');

      expect($formState.getState().errors).toStrictEqual({ firstName: 'Can not be empty' });
      expect($formState.getState().values).toStrictEqual({ firstName: '' });
      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }

    {
      await api.changeFx({ name: 'firstName', value: 'Incorrect' });

      expect($fields.getState().firstName.error).toBe(undefined);
      expect($fields.getState().firstName.value).toBe('Incorrect');
      expect($formState.getState().errors).toStrictEqual({});
    }

    {
      const submitPromise = api.submitFx();
      vi.runOnlyPendingTimers();

      expect($formState.getState().submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await api.changeFx({ name: 'firstName', value: 'John' });

      expect($fields.getState().firstName.error).toBe(undefined);
      expect($fields.getState().firstName.value).toBe('John');
      expect($formState.getState().errors).toStrictEqual({});

      const submitPromise = api.submitFx();
      vi.runOnlyPendingTimers();

      expect($formState.getState().submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }
  });
});
