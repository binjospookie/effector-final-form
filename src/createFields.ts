import { createEvent, sample } from 'effector';

import type { Domain } from 'effector';
import type { FormApi as FFFormApi } from 'final-form';

const createFields = <FormValues, InitialFormValues = Partial<FormValues>>(
  domain: Domain,
  form: FFFormApi<FormValues, InitialFormValues>,
) => {
  type Field = NonNullable<ReturnType<typeof form['getFieldState']>>;
  type State = { [T in keyof FormValues]: Field };

  const calculateFields = () =>
    // @ts-expect-error
    form.getRegisteredFields().reduce((acc, name) => ({ ...acc, [name]: form.getFieldState(name) }), {} as State);

  const fieldsApi = {
    update: createEvent(),
  };

  const $fields = domain.store<State>(calculateFields());

  sample({ clock: fieldsApi.update, fn: calculateFields, target: $fields });

  return { $fields, fieldsApi };
};

export { createFields };
