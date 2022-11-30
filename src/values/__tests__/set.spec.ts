import { allSettled, fork } from 'effector';

import { createValues } from '../index';

const { api, $values } = createValues([{ id: 'name', value: 'John' }, { id: 'email' }]);

describe('createValues.api.set', () => {
  const scope = fork();

  test('initial state', () => {
    expect(scope.getState($values)).toStrictEqual({
      name: 'John',
      email: '',
    });
  });

  test('valid', async () => {
    await allSettled(api.set, { params: { id: 'name', value: 'Jane' }, scope });
    expect(scope.getState($values)).toStrictEqual({
      name: 'Jane',
      email: '',
    });

    await allSettled(api.set, { params: { id: 'email', value: 'test@pm.me' }, scope });
    expect(scope.getState($values)).toStrictEqual({
      name: 'Jane',
      email: 'test@pm.me',
    });
  });

  test('invalid', async () => {
    await allSettled(api.set, { scope, params: { id: 'phone', value: '123' } });
    expect(scope.getState($values)).toStrictEqual({
      name: 'Jane',
      email: 'test@pm.me',
    });
  });
});
