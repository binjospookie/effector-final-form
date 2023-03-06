import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.changeFx', () => {
  test('without initialValues', async () => {
    const { $formState, $fields, domain, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, { scope, params: { name: 'firstName' } });
    expect(scope.getState($formState).values).toStrictEqual({});
    expect(scope.getState($fields).firstName.value).toBe(undefined);

    await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });
    expect(scope.getState($formState).values).toStrictEqual({ firstName: 'John' });
    expect(scope.getState($fields).firstName.value).toBe('John');
  });

  test('with initialValues', async () => {
    const { $formState, $fields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, { scope, params: { name: 'firstName' } });
    expect(scope.getState($formState).values).toStrictEqual({ firstName: '' });
    expect(scope.getState($fields).firstName.value).toBe('');

    await allSettled(api.changeFx, { scope, params: { name: 'firstName', value: 'John' } });
    expect(scope.getState($formState).values).toStrictEqual({ firstName: 'John' });
    expect(scope.getState($fields).firstName.value).toBe('John');
  });
});
