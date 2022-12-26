import { allSettled, fork } from 'effector';

import { validator } from 'field/__fixtures__';
import { createFormField } from '../index';

test('api.setValue', async () => {
  const scope = fork();
  const { $field, api } = createFormField({
    name: 'name',
    validator,
  });

  await allSettled(api.setValue, { params: 'Jane', scope });
  expect(scope.getState($field)).toStrictEqual({
    meta: { dirty: true, errorText: null, modified: true, valid: true },
    name: 'name',
    value: 'Jane',
  });

  await allSettled(api.setValue, { params: '', scope });
  expect(scope.getState($field)).toStrictEqual({
    meta: { dirty: false, errorText: 'Invalid', modified: true, valid: false },
    name: 'name',
    value: '',
  });
});
