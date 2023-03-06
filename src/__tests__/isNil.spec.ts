import { isNil } from '../utils';

test('isNil', () => {
  expect(isNil(null)).toBeTruthy();
  expect(isNil(undefined)).toBeTruthy();
  expect(isNil([])).toBeFalsy();
});
