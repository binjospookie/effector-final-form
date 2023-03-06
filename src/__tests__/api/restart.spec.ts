import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.restart', () => {
  test('with initialValues', async () => {
    const { $fields, domain, api, $formState } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === undefined) {
          return { firstName: 'error' };
        }
      },
    });
    const scope = fork(domain);

    {
      await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: undefined } });

      expect(scope.getState($fields).firstName.value).toBe(undefined);
      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'error' });
    }

    {
      await allSettled(api.restart, { scope, params: undefined });

      expect(scope.getState($fields).firstName.value).toBe('');
      expect(scope.getState($formState).errors).toStrictEqual({});
    }
  });
  test('with initialValues', async () => {
    const { $fields, domain, api, $formState } = createForm<
      { firstName: string },
      ['values', 'initialValues', 'errors']
    >({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'John') {
          return { firstName: 'error' };
        }
      },
    });
    const scope = fork(domain);

    {
      await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });

      expect(scope.getState($fields).firstName.value).toBe('John');
      expect(scope.getState($formState).errors).toStrictEqual({ firstName: 'error' });
    }

    {
      await allSettled(api.restart, { scope, params: undefined });

      expect(scope.getState($fields).firstName.value).toBe(undefined);
      expect(scope.getState($formState).errors).toStrictEqual({});
    }
  });
});
