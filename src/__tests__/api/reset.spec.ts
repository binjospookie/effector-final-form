import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.reset', () => {
  test('without initialValues', async () => {
    const { $fields, api } = createForm<{ firstName: string; lastName: string }, ['values', 'initialValues']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues'],
    });

    {
      await api.initialize({ firstName: 'John', lastName: 'Doe' });
      api.registerField({ name: 'firstName', subscribeOn: ['initial', 'value'] });
      api.registerField({ name: 'lastName', subscribeOn: ['initial', 'value'] });

      expect($fields.getState().firstName.initial).toBe('John');
      expect($fields.getState().lastName.initial).toBe('Doe');
    }

    {
      await api.changeFx({ name: 'firstName', value: 'Bill' });
      await api.changeFx({ name: 'lastName', value: 'Smith' });

      expect($fields.getState().firstName.value).toBe('Bill');
      expect($fields.getState().lastName.value).toBe('Smith');
    }

    {
      await api.reset({ firstName: 'biba', lastName: 'boba' });

      expect($fields.getState().firstName.value).toBe('biba');
      expect($fields.getState().lastName.value).toBe('boba');
    }

    {
      await api.reset({ firstName: undefined, lastName: undefined });
      expect($fields.getState().firstName.value).toBe(undefined);
      expect($fields.getState().lastName.value).toBe(undefined);
    }

    {
      await api.reset({ firstName: 'John' });
      expect($fields.getState().firstName.value).toBe('John');
      expect($fields.getState().lastName.value).toBe(undefined);
    }
  });

  test('with initialValues', async () => {
    const { $fields, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: 'John', lastName: 'Doe' },
      subscribeOn: ['values', 'initialValues'],
    });

    {
      api.registerField({ name: 'firstName', subscribeOn: ['initial', 'value'] });
      api.registerField({ name: 'lastName', subscribeOn: ['initial', 'value'] });

      await api.changeFx({ name: 'firstName', value: 'Bill' });
      await api.changeFx({ name: 'lastName', value: 'Smith' });

      expect($fields.getState().firstName.initial).toBe('John');
      expect($fields.getState().firstName.value).toBe('Bill');
      expect($fields.getState().lastName.initial).toBe('Doe');
      expect($fields.getState().lastName.value).toBe('Smith');
    }

    {
      await api.reset();

      expect($fields.getState().firstName.initial).toBe('John');
      expect($fields.getState().firstName.value).toBe('John');
      expect($fields.getState().lastName.initial).toBe('Doe');
      expect($fields.getState().lastName.value).toBe('Doe');
    }
  });
});
