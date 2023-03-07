import { allSettled, fork } from 'effector';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('without initialValues', async () => {
    const { domain, api, $registeredFields } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    expect(scope.getState($registeredFields)).toStrictEqual([]);

    await allSettled(api.registerField, {
      scope,
      params: { name: 'firstName', subscribeOn: ['value'], config: { defaultValue: 'defaultValue' } },
    });
    expect(scope.getState($registeredFields)).toStrictEqual(['firstName']);
  });

  test('with initialValues', async () => {
    const { $registeredFields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });
    const scope = fork(domain);

    expect(scope.getState($registeredFields)).toStrictEqual([]);
    await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: ['value'] } });
    expect(scope.getState($registeredFields)).toStrictEqual(['firstName']);
  });
});
