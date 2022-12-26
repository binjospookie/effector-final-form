import { createEvent, createStore } from 'effector';

import type { Field, FieldValue, FormField } from './types';

const createFormField = (field: Field) => {
  const api = {
    setValue: createEvent<FieldValue>(),
  };

  const initialValue = field.initialValue ?? '';
  const initialValidation = field.validator(initialValue);

  const $field = createStore<FormField>({
    name: field.name,
    meta: {
      dirty: false,
      errorText: 'errorText' in initialValidation ? initialValidation.errorText : null,
      modified: false,
      valid: initialValidation.valid,
    },
    value: initialValue,
  });

  $field.on(api.setValue, (state, value) => {
    const { errorText = null, valid } = field.validator(value);
    const meta = {
      dirty: $field.defaultState.value !== value,
      errorText,
      modified: true,
      valid,
    };

    return { name: state.name, meta, value };
  });

  return {
    $field,
    api,
  };
};

export { createFormField };
export type { Field } from './types';
