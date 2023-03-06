import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

describe('api.resetFieldState', () => {
  test('', async () => {
    const { $formState, $fields, domain, api } = createForm<{ firstName: [string] }, ['values']>({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      subscribeOn: ['values'],
      validate: (f) => {
        if (f.firstName && f.firstName[0] === 'John') {
          return { firstName: 'StaticError' };
        }
      },
    });
    const scope = fork(domain);

    await allSettled(api.registerField, {
      scope,
      params: { name: 'firstName', subscribeOn: ['submitError'] },
    });

    await allSettled(api.focusFx, { scope, params: 'firstName' });

    await allSettled(api.blurFx, { scope, params: 'firstName' });
    await allSettled(api.focusFx, { scope, params: 'firstName' });
    await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: ['John'] } });

    {
      const { blur, change, data, focus, ...state } = scope.getState($fields).firstName;

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

    await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: ['Doe'] } });
    await allSettled(api.submitFx, { scope });

    expect(scope.getState($fields).firstName.submitError).toBe('Submit Error');

    await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: [''] } });

    expect(scope.getState($fields).firstName.modifiedSinceLastSubmit).toBe(true);
    expect(scope.getState($fields).firstName.dirtySinceLastSubmit).toBe(true);

    await allSettled(api.resetFieldState, { scope, params: 'firstName' });
    {
      const { blur, change, data, focus, ...state } = scope.getState($fields).firstName;

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
