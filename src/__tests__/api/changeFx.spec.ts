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
      expect(form.$.getState().values).toStrictEqual({});
      expect(field.$.getState().value).toBe(null);
    }

    {
      await field.api.changeFx('John');
      expect(form.$.getState().values).toStrictEqual({ firstName: 'John' });
      expect(field.$.getState().value).toBe('John');
    }
  });
});
