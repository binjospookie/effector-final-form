import { createForm } from '../../index';

describe('api.resetFieldState', () => {
  test('', async () => {
    const { $fields, api } = createForm<{ firstName: [string] }, ['values']>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['values'],
      validate: (f) => {
        if (f.firstName && f.firstName[0] === 'John') {
          return { firstName: 'StaticError' };
        }
      },
    });

    {
      api.registerField({
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

      await api.focusFx('firstName');

      await api.blurFx('firstName');
      await api.focusFx('firstName');
      await api.changeFx({ name: 'firstName', value: ['John'] });

      const { blur, change, data, focus, ...state } = $fields.getState().firstName;

      expect(state).toStrictEqual({
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
    }

    {
      await api.changeFx({ name: 'firstName', value: ['Doe'] });
      await api.submitFx();

      expect($fields.getState().firstName.submitError).toBe('Submit Error');
    }

    {
      await api.changeFx({ name: 'firstName', value: [''] });

      expect($fields.getState().firstName.modifiedSinceLastSubmit).toBe(true);
      expect($fields.getState().firstName.dirtySinceLastSubmit).toBe(true);
    }

    {
      api.resetFieldState('firstName');

      const { blur, change, data, focus, ...state } = $fields.getState().firstName;

      expect(state).toStrictEqual({
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
