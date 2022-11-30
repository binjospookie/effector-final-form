import { Field } from 'types';

import { createValues } from 'values';

// todo: fields meta
// todo: form meta
// todo: fields validation
// todo: form validation
// todo: form sending
export const createForm = (fields: readonly Field[]) => {
  const { api: valuesApi, $values } = createValues(fields);

  return {
    $values,
    api: {
      values: valuesApi,
    },
  };
};
