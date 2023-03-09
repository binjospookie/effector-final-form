import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.blur_focus', () => {
  const { $formState, $fields, api } = createForm({
    onSubmit: onSubmitMock,
    initialValues: { firstName: '' },
    subscribeOn: ['active'],
  });

  const field = api.registerField({ name: 'firstName', subscribeOn: ['active'] });

  test('api.focusFx', async () => {
    expect($formState.getState().active).toBe(null);
    expect($fields.getState().firstName.active).toBe(false);

    await field.api.focusFx();

    expect($formState.getState().active).toBe('firstName');
    expect($fields.getState().firstName.active).toBe(true);
  });

  test('api.blurFx', async () => {
    {
      expect($formState.getState().active).toBe('firstName');
      expect($fields.getState().firstName.active).toBe(true);
    }

    {
      await field.api.blurFx();
      expect($formState.getState().active).toBe(null);
      expect($fields.getState().firstName?.active).toBe(false);
    }
  });
});
