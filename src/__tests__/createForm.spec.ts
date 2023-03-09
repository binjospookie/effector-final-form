import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('without initial values', () => {
    const { $formState } = createForm<{ firstName: string }, ['initialValues', 'values']>({
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
