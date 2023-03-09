import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.reset', () => {
  test('without initialValues', async () => {
    const { api } = createForm<{ firstName: string; lastName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });

    await api.initialize({ firstName: 'John', lastName: 'Doe' });
    const firstNameField = api.registerField({ name: 'firstName', subscribeOn: ['initial', 'value'] });
    const lastNameField = api.registerField({ name: 'lastName', subscribeOn: ['initial', 'value'] });

    expect(firstNameField.$state.getState().initial).toBe('John');
    expect(lastNameField.$state.getState().initial).toBe('Doe');

    {
      await firstNameField.api.changeFx('Bill');
      await lastNameField.api.changeFx('Smith');

      expect(firstNameField.$state.getState().value).toBe('Bill');
      expect(lastNameField.$state.getState().value).toBe('Smith');
    }

    {
      await api.reset({ firstName: 'biba', lastName: 'boba' });

      expect(firstNameField.$state.getState().value).toBe('biba');
      expect(lastNameField.$state.getState().value).toBe('boba');
    }

    {
      await api.reset({ firstName: undefined, lastName: undefined });
      expect(firstNameField.$state.getState().value).toBe(undefined);
      expect(lastNameField.$state.getState().value).toBe(undefined);
    }

    {
      await api.reset({ firstName: 'John' });
      expect(firstNameField.$state.getState().value).toBe('John');
      expect(lastNameField.$state.getState().value).toBe(undefined);
    }
  });

  test('with initialValues', async () => {
    const { api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John', lastName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });

    const firstNameField = api.registerField({ name: 'firstName', subscribeOn: ['initial', 'value'] });
    const lastNameField = api.registerField({ name: 'lastName', subscribeOn: ['initial', 'value'] });

    {
      await firstNameField.api.changeFx('Bill');
      await lastNameField.api.changeFx('Smith');

      expect(firstNameField.$state.getState().initial).toBe('John');
      expect(firstNameField.$state.getState().value).toBe('Bill');
      expect(lastNameField.$state.getState().initial).toBe('Doe');
      expect(lastNameField.$state.getState().value).toBe('Smith');
    }

    {
      await api.reset();

      expect(firstNameField.$state.getState().initial).toBe('John');
      expect(firstNameField.$state.getState().value).toBe('John');
      expect(lastNameField.$state.getState().initial).toBe('Doe');
      expect(lastNameField.$state.getState().value).toBe('Doe');
    }
  });
});
