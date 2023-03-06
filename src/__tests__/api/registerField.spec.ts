import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('without initialValues', async () => {
    const { $fields, domain, api } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, {
      scope,
      params: { name: 'firstName', subscribeOn: ['value'], config: { defaultValue: 'defaultValue' } },
    });

    expect(scope.getState($fields).firstName.value).toBe('defaultValue');
  });

  test('with initialValues', async () => {
    const { $fields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: ['value'] } });

    expect(scope.getState($fields).firstName.value).toBe('');
  });
});
