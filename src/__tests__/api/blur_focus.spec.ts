import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.blur_focus', () => {
  const { $formState, $fields, api } = createForm({
    onSubmit: onSubmitMock,
    initialValues: { firstName: '' },
    subscribeOn: ['active'],
  });

  test('api.focusFx', async () => {
    {
      await api.registerField({ name: 'firstName', subscribeOn: ['active'] });

      expect($formState.getState().active).toBe(null);
      expect($fields.getState().firstName.active).toBe(false);
    }

    {
      await api.focusFx('firstName');

      expect($formState.getState().active).toBe('firstName');
      expect($fields.getState().firstName.active).toBe(true);
    }
  });

  test('api.blurFx', async () => {
    {
      expect($formState.getState().active).toBe('firstName');
      expect($fields.getState().firstName.active).toBe(true);
    }

    {
      await api.blurFx('firstName');
      expect($formState.getState().active).toBe(null);
      expect($fields.getState().firstName?.active).toBe(false);
    }
  });
});
