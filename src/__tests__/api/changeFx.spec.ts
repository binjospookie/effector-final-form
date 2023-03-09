import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.changeFx', () => {
  test('without initialValues', async () => {
    const { $formState, api } = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = api.registerField({ name: 'firstName', subscribeOn: ['value'] });

    {
      expect($formState.getState().values).toStrictEqual({});
      expect(field.$state.getState().value).toBe(undefined);
    }

    {
      await field.api.changeFx('John');
      expect($formState.getState().values).toStrictEqual({ firstName: 'John' });
      expect(field.$state.getState().value).toBe('John');
    }
  });
});
