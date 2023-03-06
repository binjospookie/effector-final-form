import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.reset', () => {
  test('without initialValues', async () => {
    const { $fields, domain, api } = createForm<{ firstName: string; lastName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });
    const scope = fork(domain);

    {
      await allSettled(api.initialize, { scope, params: { firstName: 'John', lastName: 'Doe' } });
      await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: ['initial'] } });
      await allSettled(api.registerField, { scope, params: { name: 'lastName', subscribeOn: ['initial'] } });

      expect(scope.getState($fields).firstName.initial).toBe('John');
      expect(scope.getState($fields).lastName.initial).toBe('Doe');
    }

    {
      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Bill' } });
      await allSettled(api.changeFx, { scope, params: { name: 'lastName', value: 'Smith' } });

      expect(scope.getState($fields).firstName.value).toBe('Bill');
      expect(scope.getState($fields).lastName.value).toBe('Smith');
    }

    {
      await allSettled(api.reset, { scope, params: { firstName: 'biba', lastName: 'boba' } });

      expect(scope.getState($fields).firstName.value).toBe('biba');
      expect(scope.getState($fields).lastName.value).toBe('boba');
    }

    {
      await allSettled(api.reset, { scope, params: { firstName: undefined, lastName: undefined } });
      expect(scope.getState($fields).firstName.value).toBe(undefined);
      expect(scope.getState($fields).lastName.value).toBe(undefined);
    }

    {
      await allSettled(api.reset, { scope, params: { firstName: 'John' } });
      expect(scope.getState($fields).firstName.value).toBe('John');
      expect(scope.getState($fields).lastName.value).toBe(undefined);
    }
  });

  test('with initialValues', async () => {
    const { $fields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John', lastName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });
    const scope = fork(domain);

    {
      await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: ['initial'] } });
      await allSettled(api.registerField, { scope, params: { name: 'lastName', subscribeOn: ['initial'] } });

      await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'Bill' } });
      await allSettled(api.changeFx, { scope, params: { name: 'lastName', value: 'Smith' } });

      expect(scope.getState($fields).firstName.initial).toBe('John');
      expect(scope.getState($fields).firstName.value).toBe('Bill');
      expect(scope.getState($fields).lastName.initial).toBe('Doe');
      expect(scope.getState($fields).lastName.value).toBe('Smith');
    }

    {
      await allSettled(api.reset, { scope, params: undefined });

      expect(scope.getState($fields).firstName.initial).toBe('John');
      expect(scope.getState($fields).firstName.value).toBe('John');
      expect(scope.getState($fields).lastName.initial).toBe('Doe');
      expect(scope.getState($fields).lastName.value).toBe('Doe');
    }
  });
});
