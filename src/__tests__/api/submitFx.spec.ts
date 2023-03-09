import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('api.submitFx', () => {
  test('', async () => {
    const { $formState, $fields, api } = createForm({
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

    const fields = api.registerField({
      name: 'firstName',
      subscribeOn: ['submitting', 'submitError', 'submitSucceeded', 'submitFailed', 'modifiedSinceLastSubmit'],
    });

    {
      fields.api.changeFx('John');
      expect($formState.getState().modifiedSinceLastSubmit).toBe(false);
      expect($fields.getState().firstName.modifiedSinceLastSubmit).toBe(false);

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
      expect($fields.getState().firstName.submitError).toBe(undefined);
      expect($fields.getState().firstName.submitSucceeded).toBe(true);
      expect($fields.getState().firstName.submitFailed).toBe(false);
      expect($formState.getState().submitErrors).toBe(null);
      expect($formState.getState().submitSucceeded).toBe(true);
      expect($formState.getState().submitFailed).toBe(false);
    }

    {
      fields.api.changeFx('');
      expect($formState.getState().modifiedSinceLastSubmit).toBe(true);
      expect($fields.getState().firstName.modifiedSinceLastSubmit).toBe(true);

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
      expect($fields.getState().firstName.submitError).toBe('Submit Error');
      expect($fields.getState().firstName.submitSucceeded).toBe(false);
      expect($fields.getState().firstName.submitFailed).toBe(true);
      expect($formState.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
      expect($formState.getState().submitSucceeded).toBe(false);
      expect($formState.getState().submitFailed).toBe(true);
    }
  });
});
