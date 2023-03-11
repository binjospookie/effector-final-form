import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.reset', () => {
  test('base', async () => {
    const { api } = createForm<{ firstName: string; lastName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });

    const firstNameField = api.registerField({
      name: 'firstName',
      subscribeOn: ['initial', 'value'],
      initialValue: 'John',
    });
    const lastNameField = api.registerField({
      name: 'lastName',
      subscribeOn: ['initial', 'value'],
      initialValue: 'Doe',
    });

    expect(firstNameField.$.getState().initial).toBe('John');
    expect(lastNameField.$.getState().initial).toBe('Doe');

    {
      await firstNameField.api.changeFx('Bill');
      await lastNameField.api.changeFx('Smith');

      expect(firstNameField.$.getState().value).toBe('Bill');
      expect(lastNameField.$.getState().value).toBe('Smith');
    }

    {
      await api.reset({ firstName: 'biba', lastName: 'boba' });

      expect(firstNameField.$.getState().value).toBe('biba');
      expect(lastNameField.$.getState().value).toBe('boba');
    }

    {
      await api.reset({ firstName: undefined, lastName: undefined });
      expect(firstNameField.$.getState().value).toBe(null);
      expect(lastNameField.$.getState().value).toBe(null);
    }

    {
      await api.reset({ firstName: 'John' });
      expect(firstNameField.$.getState().value).toBe('John');
      expect(lastNameField.$.getState().value).toBe(null);
    }
  });
});
