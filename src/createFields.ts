import { sample } from 'effector';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';

const createFields = <FormValues>(config: { domain: Domain; finalForm: FFFormApi<FormValues> }) => {
  const { domain, finalForm } = config;

  type Field = NonNullable<ReturnType<(typeof finalForm)['getFieldState']>>;
  type FieldName = keyof FormValues;
  type State = { [T in FieldName]: Field };

  const calculateFields = () =>
    finalForm.getRegisteredFields().reduce(
      (acc, name) =>
        Object.assign({}, acc, {
          [name]: finalForm.getFieldState(name as FieldName),
        }),
      {} as State,
    );

  const fieldsApi = {
    update: domain.event(),
  };

  const $fields = domain.store<State>(calculateFields());
  const $registeredFields = $fields.map((kv) => Object.keys(kv) as FieldName[] | []);

  sample({ clock: fieldsApi.update, fn: calculateFields, target: $fields });

  return { $fields, fieldsApi, $registeredFields };
};

export { createFields };
