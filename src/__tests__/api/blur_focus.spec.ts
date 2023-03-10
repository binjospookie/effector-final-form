import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.blur_focus', () => {
  const form = createForm<{ firstName: string }>({
    onSubmit: onSubmitMock,

    subscribeOn: ['active'],
  });

  const field = form.api.registerField({
    name: 'firstName',
    subscribeOn: ['active'],
    initialValue: '',
  });

  test('api.focusFx', async () => {
    expect(form.$state.getState().active).toBe(null);
    expect(field.$state.getState().active).toBe(false);

    await field.api.focusFx();

    expect(form.$state.getState().active).toBe('firstName');
    expect(field.$state.getState().active).toBe(true);
  });

  test('api.blurFx', async () => {
    {
      expect(form.$state.getState().active).toBe('firstName');
      expect(field.$state.getState().active).toBe(true);
    }

    {
      await field.api.blurFx();
      expect(form.$state.getState().active).toBe(null);
      expect(field.$state.getState().active).toBe(false);
    }
  });
});
