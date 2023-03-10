import { vi } from 'vitest';
import waitForExpect from 'wait-for-expect';

// import { createForm } from 'effector-final-form';
import { createForm } from '../../index';

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

describe('example', () => {
  test('', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: async (f) => {
        await sleep(1000);

        return f.firstName === 'Incorrect' ? { firstName: 'Submit Error' } : undefined;
      },
      subscribeOn: ['values', 'errors', 'submitting', 'submitSucceeded', 'submitFailed', 'submitErrors'],
    });

    const field = form.api.registerField({
      name: 'firstName',
      subscribeOn: ['value', 'error', 'initial'],
      initialValue: '',
      validate: (v) => (v === '' ? 'Can not be empty' : undefined),
    });

    field.api.changeFx('');

    await waitForExpect(() => {
      expect(field.$state.getState().error).toBe('Can not be empty');
    });
    expect(field.$state.getState().initial).toBe('');
    expect(field.$state.getState().value).toBe('');

    expect(form.$state.getState().errors).toStrictEqual({ firstName: 'Can not be empty' });
    expect(form.$state.getState().values).toStrictEqual({ firstName: '' });
    expect(form.$state.getState().submitting).toBe(false);
    expect(form.$state.getState().submitSucceeded).toBe(false);
    expect(form.$state.getState().submitFailed).toBe(false);
    expect(form.$state.getState().submitErrors).toBe(null);

    {
      await field.api.changeFx('Incorrect');

      await waitForExpect(() => {
        expect(field.$state.getState().error).toBe(null);
        expect(field.$state.getState().value).toBe('Incorrect');
        expect(form.$state.getState().errors).toStrictEqual({});
      });
    }

    {
      const submitPromise = form.api.submitFx();

      expect(form.$state.getState().submitting).toBe(true);

      vi.useFakeTimers();
      vi.runOnlyPendingTimers();
      await submitPromise;
      vi.useRealTimers();

      expect(form.$state.getState().submitting).toBe(false);
      expect(form.$state.getState().submitSucceeded).toBe(false);
      expect(form.$state.getState().submitFailed).toBe(true);
      expect(form.$state.getState().submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }

    {
      await field.api.changeFx('John');

      expect(field.$state.getState().error).toBe(null);
      expect(field.$state.getState().value).toBe('John');
      expect(form.$state.getState().errors).toStrictEqual({});

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
      expect(form.$state.getState().submitSucceeded).toBe(true);
      expect(form.$state.getState().submitFailed).toBe(false);
      expect(form.$state.getState().submitErrors).toBe(null);
    }
  });
});
