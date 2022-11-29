import { allSettled, fork } from 'effector';

import { createValues } from '../index';

const { api, $values } = createValues([{ id: 'name', value: 'John' }, { id: 'email' }]);

describe('createValues.api.update', () => {
  const scope = fork();

  test('valid', async () => {
    await allSettled(api.update, {
      params: [{ id: 'password', value: '123' }, { id: 'name' }],
      scope,
    });
    expect(scope.getState($values)).toStrictEqual({
      password: '123',
      name: 'John',
    });

    await allSettled(api.update, {
      scope,
      params: [
        { id: 'password', value: '123' },
        { id: 'name', value: 'Jane' },
      ],
    });
    expect(scope.getState($values)).toStrictEqual({
      password: '123',
      name: 'Jane',
    });
  });
});
