import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.blur_focus', () => {
  const { $formState, api } = createForm<{ firstName: string }, ['active']>({
    onSubmit: onSubmitMock,

    subscribeOn: ['active'],
  });

  const field = api.registerField({
    name: 'firstName',
    subscribeOn: ['active'],
    initialValue: '',
  });

  test('api.focusFx', async () => {
    expect($formState.getState().active).toBe(null);
    expect(field.$state.getState().active).toBe(false);

    await field.api.focusFx();

    expect($formState.getState().active).toBe('firstName');
    expect(field.$state.getState().active).toBe(true);
  });

  test('api.blurFx', async () => {
    {
      expect($formState.getState().active).toBe('firstName');
      expect(field.$state.getState().active).toBe(true);
    }

    {
      await field.api.blurFx();
      expect($formState.getState().active).toBe(null);
      expect(field.$state.getState().active).toBe(false);
    }
  });
});
