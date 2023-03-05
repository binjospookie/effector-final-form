import { sample } from 'effector';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';

const createFields = <FormValues>(config: { domain: Domain; finalForm: FFFormApi<FormValues> }) => {
  const { domain, finalForm } = config;

  type Field = NonNullable<ReturnType<(typeof finalForm)['getFieldState']>>;
  type State = { [T in keyof FormValues]: Field };

  const calculateFields = () =>
    finalForm.getRegisteredFields().reduce(
      (acc, name) =>
        Object.assign({}, acc, {
          [name]: finalForm.getFieldState(name as keyof FormValues),
        }),
      {} as State,
    );

  const fieldsApi = {
    update: domain.event(),
  };

  const $fields = domain.store<State>(calculateFields());

  sample({ clock: fieldsApi.update, fn: calculateFields, target: $fields });

  return { $fields, fieldsApi };
};

export { createFields };
