import { createEvent, createStore, sample } from 'effector';

import { notEquals } from './utils';

import type { FieldState as FFFieldState, FormApi as FFFormApi } from 'final-form';

const createFields = <FormValues>(config: { finalForm: FFFormApi<FormValues> }) => {
  const { finalForm } = config;

  type Field = NonNullable<ReturnType<(typeof finalForm)['getFieldState']>>;
  type FieldName = keyof FormValues;
  type State = { [T in FieldName]: Field };

  const fieldsApi = {
    update: createEvent<FFFieldState<FormValues[keyof FormValues]>>(),
  };

  const $fields = createStore<State>(
    // @ts-expect-error
    {},
    { updateFilter: notEquals },
  );
  const $registeredFields = $fields.map((kv) => Object.keys(kv) as FieldName[] | []);

  sample({
    clock: fieldsApi.update,
    source: $fields,
    fn: (src, x) => ({ ...src, [x.name]: x }),
    target: $fields,
  });

  return { $fields, fieldsApi, $registeredFields };
};

export { createFields };
