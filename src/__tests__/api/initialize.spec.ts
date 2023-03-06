import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.initialize', () => {
  test('without initialValues', async () => {
    const { $formState, $fields, domain, api } = createForm<{ firstName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });
    const scope = fork(domain);

    await allSettled(api.initialize, { scope, params: { firstName: 'John' } });
    expect(scope.getState($formState).initialValues).toStrictEqual({ firstName: 'John' });

    await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });
    expect(scope.getState($fields).firstName.initial).toStrictEqual('John');
    expect(scope.getState($formState).initialValues).toStrictEqual({ firstName: 'John' });
  });

  test('with initialValues', async () => {
    const { $formState, $fields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });
    const scope = fork(domain);

    await allSettled(api.initialize, { scope, params: { firstName: 'John' } });
    expect(scope.getState($formState).initialValues).toStrictEqual({ firstName: 'John' });

    await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });
    expect(scope.getState($fields).firstName.initial).toStrictEqual('John');
    expect(scope.getState($formState).initialValues).toStrictEqual({ firstName: 'John' });
  });
});
