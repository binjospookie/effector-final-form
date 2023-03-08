import { equals } from '../equals';

function foo() {}
function bar() {}
const baz = () => {};

describe.each([
  {
    params: [foo, foo],
    expected: true,
  },
  {
    params: [foo, bar],
    expected: false,
  },
  {
    params: [foo, baz],
    expected: false,
  },
  {
    params: [
      [{ a: 1 }, [{ b: 2 }]],
      [{ a: 1 }, [{ b: 2 }]],
    ],
    expected: true,
  },
  {
    params: [
      [{ a: 1 }, [{ b: 2 }]],
      [{ a: 1 }, [{ b: 3 }]],
    ],
    expected: false,
  },
  {
    params: [/s/, /s/],
    expected: true,
  },
  {
    params: [/s/, /d/],
    expected: false,
  },
  {
    params: [/a/gi, /a/gi],
    expected: true,
  },
  {
    params: [/a/gim, /a/gim],
    expected: true,
  },
  {
    params: [/a/gi, /a/i],
    expected: false,
  },
  {
    params: [[NaN], [NaN]],
    expected: true,
  },
  {
    params: [new Number(0), new Number(0)],
    expected: true,
  },
  {
    params: [new Number(0), new Number(1)],
    expected: false,
  },
  {
    params: [new Number(1), new Number(0)],
    expected: false,
  },
])('R.equals(%o)', ({ params, expected }) => {
  test('', () => {
    // @ts-expect-error stipid jest
    expect(equals(...params)).toBe(expected);
  });
});

describe('R.equals', () => {
  test('new string', () => {
    expect(equals(new String(''), new String(''))).toEqual(true);
    expect(equals(new String(''), new String('x'))).toEqual(false);
    expect(equals(new String('x'), new String(''))).toEqual(false);
    expect(equals(new String('foo'), new String('foo'))).toEqual(true);
    expect(equals(new String('foo'), new String('bar'))).toEqual(false);
    expect(equals(new String('bar'), new String('foo'))).toEqual(false);
  });

  test('new Boolean', () => {
    expect(equals(new Boolean(true), new Boolean(true))).toEqual(true);
    expect(equals(new Boolean(false), new Boolean(false))).toEqual(true);
    expect(equals(new Boolean(true), new Boolean(false))).toEqual(false);
    expect(equals(new Boolean(false), new Boolean(true))).toEqual(false);
  });

  test('new Error', () => {
    expect(equals(new Error('XXX'), {})).toEqual(false);
    expect(equals(new Error('XXX'), new TypeError('XXX'))).toEqual(false);
    expect(equals(new Error('XXX'), new Error('YYY'))).toEqual(false);
    expect(equals(new Error('XXX'), new Error('XXX'))).toEqual(true);
    expect(equals(new Error('XXX'), new TypeError('YYY'))).toEqual(false);
  });

  test('with dates', () => {
    expect(equals(new Date(0), new Date(0))).toEqual(true);
    expect(equals(new Date(1), new Date(1))).toEqual(true);
    expect(equals(new Date(0), new Date(1))).toEqual(false);
    expect(equals(new Date(1), new Date(0))).toEqual(false);
    expect(equals(new Date(0), {})).toEqual(false);
    expect(equals({}, new Date(0))).toEqual(false);
  });

  test('ramda spec', () => {
    expect(equals({}, {})).toEqual(true);

    expect(
      equals(
        {
          a: 1,
          b: 2,
        },
        {
          a: 1,
          b: 2,
        },
      ),
    ).toEqual(true);

    expect(
      equals(
        {
          a: 2,
          b: 3,
        },
        {
          b: 3,
          a: 2,
        },
      ),
    ).toEqual(true);

    expect(
      equals(
        {
          a: 2,
          b: 3,
        },
        {
          a: 3,
          b: 3,
        },
      ),
    ).toEqual(false);

    expect(
      equals(
        {
          a: 2,
          b: 3,
          c: 1,
        },
        {
          a: 2,
          b: 3,
        },
      ),
    ).toEqual(false);
  });

  test('works with boolean tuple', () => {
    expect(equals([true, false], [true, false])).toBeTruthy();
    expect(equals([true, false], [true, true])).toBeFalsy();
  });

  test('works with equal objects within array', () => {
    const objFirst = {
      a: {
        b: 1,
        c: 2,
        d: [1],
      },
    };
    const objSecond = {
      a: {
        b: 1,
        c: 2,
        d: [1],
      },
    };

    const x = [1, 2, objFirst, null, '', []];
    const y = [1, 2, objSecond, null, '', []];
    expect(equals(x, y)).toBeTruthy();
  });

  test('works with different objects within array', () => {
    const objFirst = { a: { b: 1 } };
    const objSecond = { a: { b: 2 } };

    const x = [1, 2, objFirst, null, '', []];
    const y = [1, 2, objSecond, null, '', []];
    expect(equals(x, y)).toBeFalsy();
  });

  test('works with undefined as second argument', () => {
    expect(equals(1, undefined)).toBeFalsy();

    expect(equals(undefined, undefined)).toBeTruthy();
  });

  test('various examples', () => {
    expect(equals([1, 2, 3], [1, 2, 3])).toBeTruthy();

    expect(equals([1, 2, 3], [1, 2])).toBeFalsy();

    expect(equals(1, 1)).toBeTruthy();

    expect(equals(1, '1')).toBeFalsy();

    expect(equals({}, {})).toBeTruthy();

    expect(
      equals(
        {
          a: 1,
          b: 2,
        },
        {
          b: 2,
          a: 1,
        },
      ),
    ).toBeTruthy();

    expect(
      equals(
        {
          a: 1,
          b: 2,
        },
        {
          a: 1,
          b: 1,
        },
      ),
    ).toBeFalsy();

    expect(
      equals(
        {
          a: 1,
          b: false,
        },
        {
          a: 1,
          b: 1,
        },
      ),
    ).toBeFalsy();

    expect(
      equals(
        {
          a: 1,
          b: 2,
        },
        {
          b: 2,
          a: 1,
          c: 3,
        },
      ),
    ).toBeFalsy();

    expect(
      equals(
        {
          x: {
            a: 1,
            b: 2,
          },
        },
        {
          x: {
            b: 2,
            a: 1,
            c: 3,
          },
        },
      ),
    ).toBeFalsy();

    expect(
      equals(
        {
          a: 1,
          b: 2,
        },
        {
          b: 3,
          a: 1,
        },
      ),
    ).toBeFalsy();

    expect(equals({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBeTruthy();

    expect(equals({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBeFalsy();

    expect(equals({ a: {} }, { a: {} })).toBeTruthy();

    expect(equals('', '')).toBeTruthy();

    expect(equals('foo', 'foo')).toBeTruthy();

    expect(equals('foo', 'bar')).toBeFalsy();

    expect(equals(0, false)).toBeFalsy();

    expect(equals(/\s/g, null)).toBeFalsy();

    expect(equals(null, null)).toBeTruthy();

    expect(equals(false, null)).toBeFalsy();
  });

  test('with custom functions', () => {
    function foo() {
      return 1;
    }
    foo.prototype.toString = () => '';
    const result = equals(foo, foo);

    expect(result).toBeTruthy();
  });

  test('with classes', () => {
    class Foo {}
    const foo = new Foo();
    const result = equals(foo, foo);

    expect(result).toBeTruthy();
  });

  test('with negative zero', () => {
    expect(equals(-0, -0)).toBeTruthy();
    expect(equals(-0, 0)).toBeFalsy();
    expect(equals(0, 0)).toBeTruthy();
    expect(equals(-0, 1)).toBeFalsy();
  });
});
