import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

describe('api.resetFieldState', () => {
  test('', async () => {
    const { api } = createForm<{ firstName: [string] }, ['values']>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['values'],
      validate: (f) => {
        if (f.firstName && f.firstName[0] === 'John') {
          return { firstName: 'StaticError' };
        }
      },
    });

    const field = api.registerField({
      name: 'firstName',
      subscribeOn: [
        'submitError',
        'active',
        'dirty',
        'dirtySinceLastSubmit',
        'error',
        'initial',
        'invalid',
        'length',
        'modified',
        'modifiedSinceLastSubmit',
        'pristine',
        'submitFailed',
        'submitSucceeded',
        'submitting',
        'touched',
        'valid',
        'validating',
        'value',
        'visited',
      ],
    });

    {
      await field.api.focusFx();

      await field.api.blurFx();
      await field.api.focusFx();
      await field.api.changeFx(['John']);

      await waitForExpect(() => {
        expect(field.$state.getState()).toStrictEqual({
          active: true,
          dirty: true,
          dirtySinceLastSubmit: false,
          error: 'StaticError',
          initial: undefined,
          invalid: true,
          length: 1,
          modified: true,
          modifiedSinceLastSubmit: false,
          name: 'firstName',
          pristine: false,
          submitError: undefined,
          submitFailed: false,
          submitSucceeded: false,
          submitting: false,
          touched: true,
          valid: false,
          validating: false,
          value: ['John'],
          visited: true,
        });
      });
    }

    {
      await field.api.changeFx(['Doe']);
      await waitForExpect(() => {
        expect(field.$state.getState().value).toStrictEqual(['Doe']);
      });

      await api.submitFx();
      await waitForExpect(() => {
        expect(field.$state.getState().submitError).toBe('Submit Error');
      });
    }

    {
      await field.api.changeFx(['']);

      expect(field.$state.getState().modifiedSinceLastSubmit).toBe(true);
      expect(field.$state.getState().dirtySinceLastSubmit).toBe(true);
    }

    {
      field.api.resetState();

      expect(field.$state.getState()).toStrictEqual({
        active: false,
        dirty: true,
        dirtySinceLastSubmit: true,
        error: undefined,
        initial: undefined,
        invalid: true,
        length: 1,
        modified: false,
        modifiedSinceLastSubmit: true,
        name: 'firstName',
        pristine: false,
        submitError: 'Submit Error',
        submitFailed: true,
        submitSucceeded: false,
        submitting: false,
        touched: false,
        valid: false,
        validating: false,
        value: [''],
        visited: false,
      });
    }
  });
});
