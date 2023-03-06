import { allSettled, fork } from 'effector';

import { createForm } from '../index';

describe('createForm', () => {
  test('', async () => {
    const { $formState, api, domain } = createForm({
      onSubmit: () => ({ firstName: 'Submit Error' }),
      initialValues: { firstName: 'John' },
      subscribeOn: ['active', 'errors', 'modified', 'submitErrors', 'touched', 'visited'],
      validate: (f) => (f.firstName === 'Bob' ? { firstName: 'Error' } : undefined),
    });

    const scope = fork(domain);

    {
      expect(scope.getState($formState).active).toBe(null);
      expect(scope.getState($formState).errors).toStrictEqual({});
      expect(scope.getState($formState).modified).toStrictEqual({});
      expect(scope.getState($formState).submitErrors).toBe(null);
      expect(scope.getState($formState).touched).toStrictEqual({});
      expect(scope.getState($formState).visited).toStrictEqual({});
    }

    {
      await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });
      await allSettled(api.focusFx, { scope, params: 'firstName' });

      expect(scope.getState($formState).active).toBe('firstName');
      expect(scope.getState($formState).errors).toStrictEqual({});
      expect(scope.getState($formState).modified).toStrictEqual({ firstName: false });
      expect(scope.getState($formState).submitErrors).toBe(null);
      expect(scope.getState($formState).touched).toStrictEqual({ firstName: false });
      expect(scope.getState($formState).visited).toStrictEqual({ firstName: true });
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Bob' } });
      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'Error' });
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Steve' } });

      await allSettled(api.submitFx, { scope, params: undefined });
      expect(scope.getState($formState).submitErrors).toStrictEqual({ firstName: 'Submit Error' });
    }
  });
});
