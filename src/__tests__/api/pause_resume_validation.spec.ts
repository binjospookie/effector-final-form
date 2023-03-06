import { allSettled, fork } from 'effector';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.pause_resume_validation', () => {
  const { $formState, domain, api } = createForm({
    onSubmit: onSubmitMock,
    subscribeOn: [],
  });
  const scope = fork(domain);

  test('api.pauseValidation', async () => {
    expect(scope.getState($formState).isValidationPaused).toBe(false);

    await allSettled(api.pauseValidation, { scope });
    expect(scope.getState($formState).isValidationPaused).toBe(true);
  });

  test('api.resumeValidation', async () => {
    expect(scope.getState($formState).isValidationPaused).toBe(true);

    await allSettled(api.resumeValidation, { scope });
    expect(scope.getState($formState).isValidationPaused).toBe(false);
  });
});
