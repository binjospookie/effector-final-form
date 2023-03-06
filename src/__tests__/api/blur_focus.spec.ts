import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.blur_focus', () => {
  const { $formState, $fields, domain, api } = createForm({
    onSubmit: onSubmitMock,
    initialValues: { firstName: '' },
    subscribeOn: ['active'],
  });
  const scope = fork(domain);

  test('api.focusFx', async () => {
    await allSettled(api.registerField, { scope, params: { name: 'firstName', subscribeOn: [] } });

    expect(scope.getState($formState).active).toBe(null);
    expect(scope.getState($fields).firstName.active).toBe(false);

    await allSettled(api.focusFx, { scope, params: 'firstName' });
    expect(scope.getState($formState).active).toBe('firstName');
    expect(scope.getState($fields).firstName.active).toBe(true);
  });

  test('api.blurFx', async () => {
    expect(scope.getState($formState).active).toBe('firstName');
    expect(scope.getState($fields).firstName.active).toBe(true);

    await allSettled(api.blurFx, { scope, params: 'firstName' });
    expect(scope.getState($formState).active).toBe(null);
    expect(scope.getState($fields).firstName?.active).toBe(false);
  });
});
