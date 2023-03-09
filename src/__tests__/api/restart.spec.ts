import waitForExpect from 'wait-for-expect';

import { createForm } from '../../index';

const onSubmitMock = () => {};

describe('api.restart', () => {
  test('with initialValues', async () => {
    const { $fields, api, $formState } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === undefined) {
          return { firstName: 'error' };
        }
      },
    });

    {
      const field = api.registerField({ name: 'firstName', subscribeOn: ['value'] });
      await field.api.changeFx(undefined);

      expect($fields.getState().firstName.value).toBe(undefined);
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'error' });
      });
    }

    {
      await api.restart();

      expect($fields.getState().firstName.value).toBe('');

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      });
    }
  });
  test('with initialValues', async () => {
    const { $fields, api, $formState } = createForm<{ firstName: string }, ['values', 'initialValues', 'errors']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values', 'initialValues', 'errors'],
      validate: (f) => {
        if (f?.firstName === 'John') {
          return { firstName: 'error' };
        }
      },
    });

    {
      const field = api.registerField({ name: 'firstName', subscribeOn: ['value'] });
      field.api.changeFx('John');

      expect($fields.getState().firstName.value).toBe('John');
      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({ firstName: 'error' });
      });
    }

    {
      await api.restart();

      expect($fields.getState().firstName.value).toBe(undefined);

      await waitForExpect(() => {
        expect($formState.getState().errors).toStrictEqual({});
      });
    }
  });
});
