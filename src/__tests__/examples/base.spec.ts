import { allSettled, fork } from 'effector';
import { vi } from 'vitest';

// import { createForm } from 'effector-final-form';
import { createForm } from '../../index';

vi.useFakeTimers();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('example', () => {
  test('', async () => {
    const { $formState, $fields, domain, api } = createForm({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === 'Incorrect' ? { firstName: 'Submit Error' } : undefined;
      },
      validate: (f) => (f.firstName === '' ? { firstName: 'Can not be empty' } : undefined),
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'errors', 'submitting', 'submitSucceeded', 'submitFailed', 'submitErrors'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, {
      scope,
      params: {
        name: 'firstName',
        subscribeOn: ['value', 'error', 'initial'],
      },
    });

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: '' } });
      expect(scope.getState($fields).firstName.error).toBe('Can not be empty');
      expect(scope.getState($fields).firstName.initial).toBe('');
      expect(scope.getState($fields).firstName.value).toBe('');

      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'Can not be empty' });
      expect(scope.getState($formState).values).toStrictEqual({ firstName: '' });
      expect(scope.getState($formState).submitting).toBe(false);
      expect(scope.getState($formState).submitSucceeded).toBe(false);
      expect(scope.getState($formState).submitFailed).toBe(false);
      expect(scope.getState($formState).submitErrors).toBe(null);
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Incorrect' } });
      expect(scope.getState($fields).firstName.error).toBe(undefined);
      expect(scope.getState($fields).firstName.value).toBe('Incorrect');
      expect(scope.getState($formState).errors).toStrictEqual({});
    }

    {
      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });
      expect(scope.getState($fields).firstName.error).toBe(undefined);
      expect(scope.getState($fields).firstName.value).toBe('John');
      expect(scope.getState($formState).errors).toStrictEqual({});

      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false);
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
    }
  });
});
