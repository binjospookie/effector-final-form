import { allSettled, fork } from 'effector';
import { createFormField } from '../index';

const validator = (x: string) =>
  x.length > 0 ? { isValid: true as const } : { isValid: false as const, errorText: 'Invalid' };

describe.each([
  { initialValue: 'John', meta: { dirty: false, error: null, modified: false, valid: true }, fieldValue: 'John' },
  { initialValue: '', meta: { dirty: false, error: 'Invalid', modified: false, valid: false }, fieldValue: '' },
])('filed initial values %o', ({ initialValue, meta, fieldValue }) => {
  test('', () => {
    const { $field } = createFormField({
      name: 'name',
      validator,
      initialValue,
    });

    expect($field.getState()).toStrictEqual({
      name: 'name',
      meta,
      value: fieldValue,
    });
  });
});

test('api.setValue', async () => {
  const scope = fork();
  const { $field, api } = createFormField({
    name: 'name',
    validator,
  });

  expect(scope.getState($field).value).toBe('');
  expect(scope.getState($field).meta.dirty).toBe(false);
  expect(scope.getState($field).meta.error).toBe('Invalid');
  expect(scope.getState($field).meta.modified).toBe(false);
  expect(scope.getState($field).meta.valid).toBe(false);

  await allSettled(api.setValue, { params: 'Jane', scope });
  expect(scope.getState($field).value).toBe('Jane');
  expect(scope.getState($field).meta.dirty).toBe(true);
  expect(scope.getState($field).meta.error).toBe(null);
  expect(scope.getState($field).meta.modified).toBe(true);
  expect(scope.getState($field).meta.valid).toBe(true);

  await allSettled(api.setValue, { params: '', scope });
  expect(scope.getState($field).value).toBe('');
  expect(scope.getState($field).meta.dirty).toBe(false);
  expect(scope.getState($field).meta.error).toBe('Invalid');
  expect(scope.getState($field).meta.modified).toBe(true);
  expect(scope.getState($field).meta.valid).toBe(false);
});
