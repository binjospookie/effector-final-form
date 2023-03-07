import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.pause_resume_validation', () => {
  const { $formState, api } = createForm({
    onSubmit: onSubmitMock,
    subscribeOn: [],
  });

  test('api.pauseValidation', async () => {
    expect($formState.getState().isValidationPaused).toBe(false);

    api.pauseValidation();
    expect($formState.getState().isValidationPaused).toBe(true);
  });

  test('api.resumeValidation', async () => {
    expect($formState.getState().isValidationPaused).toBe(true);

    api.resumeValidation();
    expect($formState.getState().isValidationPaused).toBe(false);
  });
});
