import { allSettled, fork } from 'effector';
import { vi } from 'vitest';

import { createForm } from '../../index';

vi.useFakeTimers();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('api.submitFx', () => {
  test('', async () => {
    const { $formState, $fields, domain, api } = createForm({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === '' ? { firstName: 'Submit Error' } : undefined;
      },
      initialValues: { firstName: '' },
      subscribeOn: [
        'values',
        'submitting',
        'modifiedSinceLastSubmit',
        'submitSucceeded',
        'submitFailed',
        'modifiedSinceLastSubmit',
        'submitError',
        'submitErrors',
      ],
    });
    const scope = fork(domain);
    await allSettled(api.registerField, {
      scope,
      params: {
        name: 'firstName',
        subscribeOn: ['submitting', 'submitError', 'submitSucceeded', 'submitFailed', 'modifiedSinceLastSubmit'],
      },
    });

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });
      expect(scope.getState($formState).modifiedSinceLastSubmit).toBe(false);
      expect(scope.getState($fields).firstName.modifiedSinceLastSubmit).toBe(false);

      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false); // can not get correct result with scope
      expect(scope.getState($fields).firstName.submitError).toBe(undefined);
      expect(scope.getState($fields).firstName.submitSucceeded).toBe(true);
      expect(scope.getState($fields).firstName.submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null); // can not get correct result with scope
      expect($formState.getState().submitSucceeded).toBe(true); // can not get correct result with scope
      expect($formState.getState().submitFailed).toBe(false); // can not get correct result with scope
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: '' } });
      expect(scope.getState($formState).modifiedSinceLastSubmit).toBe(true);
      expect(scope.getState($fields).firstName.modifiedSinceLastSubmit).toBe(true);

      const submitPromise = allSettled(api.submitFx, { scope });
      vi.runOnlyPendingTimers();

      expect(scope.getState($formState).submitting).toBe(true);

      await submitPromise;

      expect($formState.getState().submitting).toBe(false); // can not get correct result with scope
      expect(scope.getState($fields).firstName.submitError).toBe('Submit Error');
      expect(scope.getState($fields).firstName.submitSucceeded).toBe(false);
      expect(scope.getState($fields).firstName.submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' }); // can not get correct result with scope
      expect($formState.getState().submitSucceeded).toBe(false); // can not get correct result with scope
      expect($formState.getState().submitFailed).toBe(true); // can not get correct result with scope
    }
  });
});
