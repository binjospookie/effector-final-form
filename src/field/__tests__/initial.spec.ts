import { validator } from 'field/__fixtures__';
import { createFormField } from '../index';

describe.each([
  { initialValue: 'John', meta: { dirty: false, errorText: null, modified: false, valid: true } },
  { initialValue: '', meta: { dirty: false, errorText: 'Invalid', modified: false, valid: false } },
])('filed initial values %o', ({ initialValue, meta }) => {
  test('', () => {
    const { $field } = createFormField({
      name: 'name',
      validator,
      initialValue,
    });

    expect($field.getState()).toStrictEqual({
      name: 'name',
      meta,
      value: initialValue,
    });
  });
});
