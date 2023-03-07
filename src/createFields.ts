import { createEvent, createStore, sample } from 'effector';

import type { FieldState as FFFieldState, FormApi as FFFormApi } from 'final-form';

const createFields = <FormValues>(config: { finalForm: FFFormApi<FormValues> }) => {
  const { finalForm } = config;

  type Field = NonNullable<ReturnType<(typeof finalForm)['getFieldState']>>;
  type FieldName = keyof FormValues;
  type State = { [T in FieldName]: Field };

  const fieldsApi = {
    update: createEvent<FFFieldState<FormValues[keyof FormValues]>>(),
  };

  // @ts-expect-error
  const $fields = createStore<State>({});
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
