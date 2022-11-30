import { createStore, createEvent, sample } from 'effector';
import { isEmpty, mergeRight } from 'ramda';

import type { Field, FieldId, FieldValue } from 'types';

type State = Record<FieldId, FieldValue>;

const parseFields = (fields: readonly Field[]) =>
  fields.reduce((acc, { id, value }) => ({ ...acc, [id]: value ?? '' }), {});

export const createValues = (fields: readonly Field[]) => {
  const api = {
    set: createEvent<{ readonly id: FieldId; readonly value: FieldValue }>(),
    update: createEvent<readonly Field[]>(),
  };
  const $values = createStore<State>(parseFields(fields));

  sample({
    clock: api.set,
    source: $values,
    filter: (state, { id }) => id in state,
    fn: (state, { id, value }) => mergeRight(state, { [id]: value }),
    target: $values,
  });

  sample({
    clock: api.update,
    source: $values,
    fn: (state, payload) =>
      payload.reduce((acc, { id, value = '' }) => mergeRight(acc, { [id]: isEmpty(value) ? state[id] : value }), {}),
    target: $values,
  });

  return {
    api,
    $values,
  };
};
