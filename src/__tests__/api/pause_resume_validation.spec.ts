import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.pause_resume_validation', () => {
  const form = createForm({
    onSubmit: onSubmitMock,
    subscribeOn: [],
  });

  test('api.pauseValidation', async () => {
    expect(form.$.getState().isValidationPaused).toBe(false);

    form.api.pauseValidation();
    expect(form.$.getState().isValidationPaused).toBe(true);
  });

  test('api.resumeValidation', async () => {
    expect(form.$.getState().isValidationPaused).toBe(true);

    form.api.resumeValidation();
    expect(form.$.getState().isValidationPaused).toBe(false);
  });
});
