import { allSettled, fork } from 'effector';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('', async () => {
    const { $formState, api, domain, $fields } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John' },
      subscribeOn: ['values', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'Bob') {
          return { firstName: 'Error' };
        }
      },
      validateOnBlur: true,
    });

    const scope = fork(domain);

    await allSettled(api.registerField, {
      scope,
      params: { name: 'firstName', subscribeOn: ['error'] },
    });

    {
      await allSettled(api.focusFx, { scope, params: 'firstName' });
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Bob' } });
      expect(scope.getState($formState).errors).toStrictEqual({});
      expect(scope.getState($fields).firstName.error).toBe(undefined);
    }

    {
      await allSettled(api.blurFx, { scope, params: 'firstName' });
      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'Error' });
      expect(scope.getState($fields).firstName.error).toBe('Error');
    }

    {
      await allSettled(api.focusFx, { scope, params: 'firstName' });
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Steve' } });
      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'Error' });
      expect(scope.getState($fields).firstName.error).toBe('Error');
    }

    {
      await allSettled(api.blurFx, { scope, params: 'firstName' });
      expect(scope.getState($formState).errors).toStrictEqual({});
      expect(scope.getState($fields).firstName.error).toBe(undefined);
    }
  });
});
