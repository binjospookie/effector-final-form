import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('without initial values', () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['initialValues', 'values'],
    });

    expect(form.$state.getState()).toStrictEqual({
      initialValues: null,
      isValidationPaused: false,
      values: {},
    });
  });
});
