import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.pause_resume_validation', () => {
  const form = createForm({
    onSubmit: onSubmitMock,
    subscribeOn: [],
  });

  test('api.pauseValidation', async () => {
    expect(form.$state.getState().isValidationPaused).toBe(false);

    form.api.pauseValidation();
    expect(form.$state.getState().isValidationPaused).toBe(true);
  });

  test('api.resumeValidation', async () => {
    expect(form.$state.getState().isValidationPaused).toBe(true);

    form.api.resumeValidation();
    expect(form.$state.getState().isValidationPaused).toBe(false);
  });
});
