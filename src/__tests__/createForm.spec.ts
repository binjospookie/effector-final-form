import { fork } from 'effector';

import { createForm } from '../index';

const onSubmitMock = () => {};

describe('createForm', () => {
  test('without initial values', () => {
    const { $formState, domain, $registeredFields } = createForm<{ firstName: string }, ['initialValues', 'values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['initialValues', 'values'],
    });

    const scope = fork(domain);

    expect(scope.getState($formState)).toStrictEqual({
      initialValues: null,
      isValidationPaused: false,
      values: {},
    });
  });

  test('with initial values', () => {
    const { $formState, domain } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John' },
      subscribeOn: ['initialValues', 'values'],
    });

    const scope = fork(domain);

    expect(scope.getState($formState)).toStrictEqual({
      initialValues: { firstName: 'John' },
      isValidationPaused: false,
      values: { firstName: 'John' },
    });
  });
});
