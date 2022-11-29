import { Field } from 'types';

import { createValues } from 'valuesFactory';

export const createForm = (fields: readonly Field[]) => {
  const { api: valuesApi, $values } = createValues(fields);

  return {
    $values,
    api: {
      values: valuesApi,
    },
  };
};
