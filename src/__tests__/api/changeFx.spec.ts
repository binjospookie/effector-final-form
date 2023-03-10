import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.changeFx', () => {
  test('without initialValues', async () => {
    const form = createForm<{ firstName: string }>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    const field = form.api.registerField({ name: 'firstName', subscribeOn: ['value'] });

    {
      expect(form.$state.getState().values).toStrictEqual({});
      expect(field.$state.getState().value).toBe(undefined);
    }

    {
      await field.api.changeFx('John');
      expect(form.$state.getState().values).toStrictEqual({ firstName: 'John' });
      expect(field.$state.getState().value).toBe('John');
    }
  });
});
