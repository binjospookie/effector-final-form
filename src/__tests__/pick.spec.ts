import { pick } from '../utils';

const obj = {
  a: 1,
  b: 2,
  c: 3,
};

describe('pick', () => {
  test('props to pick is a string', () => {
    const result = pick(['a', 'c'], obj);
    const expectedResult = {
      a: 1,
      c: 3,
    };

    expect(result).toEqual(expectedResult);
  });

  test('when prop is missing', () => {
    const result = pick(['a', 'd', 'f'], obj);
    expect(result).toEqual({ a: 1 });
  });

  test('props to pick is an array', () => {
    expect(
      pick(['a', 'c'], {
        a: 'foo',
        b: 'bar',
        c: 'baz',
      }),
    ).toEqual({
      a: 'foo',
      c: 'baz',
    });

    expect(
      pick(['a', 'd', 'e', 'f'], {
        a: 'foo',
        b: 'bar',
        c: 'baz',
      }),
    ).toEqual({ a: 'foo' });

    // @ts-expect-error test
    expect(pick(['a', 'd', 'e', 'f'], null)).toMatchObject({});
  });
});
