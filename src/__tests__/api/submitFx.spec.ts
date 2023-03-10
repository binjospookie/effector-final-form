import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('api.submitFx', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
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

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['submitting', 'submitError', 'submitSucceeded', 'submitFailed', 'modifiedSinceLastSubmit'],
      initialValue: '',
    });

    {
      field.api.changeFx('John');
      expect(form.$state.getState().modifiedSinceLastSubmit).toBe(false);
      expect(field.$state.getState()?.modifiedSinceLastSubmit).toBe(false);

      const submitPromise = form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$state.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect(form.$state.getState().submitting).toBe(false);
      });
      expect(field.$state.getState()?.submitError).toBe(undefined);
      expect(field.$state.getState()?.submitSucceeded).toBe(true);
      expect(field.$state.getState()?.submitFailed).toBe(false);
      expect(form.$state.getState().submitErrors).toBe(null);
      expect(form.$state.getState().submitSucceeded).toBe(true);
      expect(form.$state.getState().submitFailed).toBe(false);
    }

    {
      field.api.changeFx('');
      expect(form.$state.getState().modifiedSinceLastSubmit).toBe(true);
      expect(field.$state.getState()?.modifiedSinceLastSubmit).toBe(true);

      const submitPromise = form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$state.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect(form.$state.getState().submitting).toBe(false);
      });
      expect(field.$state.getState()?.submitError).toBe('Submit Error');
      expect(field.$state.getState()?.submitSucceeded).toBe(false);
      expect(field.$state.getState()?.submitFailed).toBe(true);
      expect(form.$state.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      expect(form.$state.getState().submitSucceeded).toBe(false);
      expect(form.$state.getState().submitFailed).toBe(true);
    }
  });
});
