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
      expect(form.$.getState().modifiedSinceLastSubmit).toBe(false);
      expect(field.$.getState()?.modifiedSinceLastSubmit).toBe(false);

      const submitPromise = form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect(form.$.getState().submitting).toBe(false);
      });
      expect(field.$.getState()?.submitError).toBe(null);
      expect(field.$.getState()?.submitSucceeded).toBe(true);
      expect(field.$.getState()?.submitFailed).toBe(false);
      expect(form.$.getState().submitErrors).toBe(null);
      expect(form.$.getState().submitSucceeded).toBe(true);
      expect(form.$.getState().submitFailed).toBe(false);
    }

    {
      field.api.changeFx('');
      expect(form.$.getState().modifiedSinceLastSubmit).toBe(true);
      expect(field.$.getState()?.modifiedSinceLastSubmit).toBe(true);

      const submitPromise = form.api.submitFx();

      await waitForExpect(() => {
        expect(form.$.getState().submitting).toBe(true);
      });

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      await waitForExpect(() => {
        expect(form.$.getState().submitting).toBe(false);
      });
      expect(field.$.getState()?.submitError).toBe('Submit Error');
      expect(field.$.getState()?.submitSucceeded).toBe(false);
      expect(field.$.getState()?.submitFailed).toBe(true);
      expect(form.$.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      expect(form.$.getState().submitSucceeded).toBe(false);
      expect(form.$.getState().submitFailed).toBe(true);
    }
  });
});
