import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('api.submitFx', () => {
  test('', async () => {
    const formSubscribeOn = [
      'values',
      'submitting',
      'modifiedSinceLastSubmit',
      'submitSucceeded',
      'submitFailed',
      'modifiedSinceLastSubmit',
      'submitError',
      'submitErrors',
    ] as const;
    const { $formState, api } = createForm<{ firstName: string }, typeof formSubscribeOn>({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === '' ? { firstName: 'Submit Error' } : undefined;
      },
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

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: ['submitting', 'submitError', 'submitSucceeded', 'submitFailed', 'modifiedSinceLastSubmit'],
      initialValue: '',
    });

    {
      field.api.changeFx('John');
      expect($formState.getState().modifiedSinceLastSubmit).toBe(false);
      expect(field.$state.getState()?.modifiedSinceLastSubmit).toBe(false);

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
      expect(field.$state.getState()?.submitError).toBe(undefined);
      expect(field.$state.getState()?.submitSucceeded).toBe(true);
      expect(field.$state.getState()?.submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
    }

    {
      field.api.changeFx('');
      expect($formState.getState().modifiedSinceLastSubmit).toBe(true);
      expect(field.$state.getState()?.modifiedSinceLastSubmit).toBe(true);

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
      expect(field.$state.getState()?.submitError).toBe('Submit Error');
      expect(field.$state.getState()?.submitSucceeded).toBe(false);
      expect(field.$state.getState()?.submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
    }
  });
});
