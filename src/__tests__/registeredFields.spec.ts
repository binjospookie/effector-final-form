import { createForm } from '../index';

const onSubmitMock = () => {};

describe('api.registerField', () => {
  test('without initialValues', async () => {
    const { api, $registeredFields } = createForm<{ firstName: string }, ['values']>({
      onSubmit: onSubmitMock,
      subscribeOn: ['values'],
    });

    expect($registeredFields.getState()).toStrictEqual([]);

    api.registerField({ name: 'firstName', subscribeOn: ['value'], config: { defaultValue: 'defaultValue' } });
    expect($registeredFields.getState()).toStrictEqual(['firstName']);
  });

  test('with initialValues', async () => {
    const { $registeredFields, domain, api } = createForm({
      onSubmit: onSubmitMock,
      initialValues: { firstName: '' },
      subscribeOn: ['values'],
    });

    expect($registeredFields.getState()).toStrictEqual([]);
    api.registerField({ name: 'firstName', subscribeOn: ['value'] });
    expect($registeredFields.getState()).toStrictEqual(['firstName']);
  });
});
