import { createEvent, createStore } from 'effector';
import { equals } from 'ramda';

import type { FailedValidation, Field, FieldValue, ValidationResult } from 'types';

type Meta = {
  // true when the value of the field is not equal to the initial value
  dirty: boolean;
  // the current validation error for this field
  error: FailedValidation['errorText'] | null;
  // true if this field's value has ever been changed. false otherwise
  modified: boolean;
  // true if this field has no validation or submission errors
  valid: ValidationResult['isValid'];
};

type FormField = {
  name: Field['name'];
  meta: Meta;
  value: FieldValue;
};

export const createFormField = (field: Field) => {
  const api = {
    setValue: createEvent<FieldValue>(),
  };

  const initialValue = field.initialValue ?? '';
  const initialValidation = field.validator(initialValue);

  const $field = createStore<FormField>({
    name: field.name,
    meta: {
      dirty: false,
      error: 'errorText' in initialValidation ? initialValidation.errorText : null,
      modified: false,
      valid: initialValidation.isValid,
    },
    value: initialValue,
  });

  $field.on(api.setValue, (state, value) => {
    const validationResult = field.validator(value);
    const meta = {
      dirty: !equals($field.defaultState.value, value),
      error: 'errorText' in validationResult ? validationResult.errorText : null,
      modified: true,
      valid: validationResult.isValid,
    };

    return { name: state.name, meta, value };
  });

  return {
    $field,
    api,
  };
};
