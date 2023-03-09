import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('without initial values', () => {
    const { $formState } = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['initialValues', 'values'],
    });

    expect($formState.getState()).toStrictEqual({
      initialValues: null,
      isValidationPaused: false,
      values: {},
    });
  });
});
