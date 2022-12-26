import type { Nullable } from 'shared/types';

type FieldName = string;
type FieldValue = string;

type ValidationResult = {
  valid: boolean;
  errorText?: string;
};

type Field = {
  name: FieldName;
  initialValue?: FieldValue;
  validator: (value: FieldValue) => ValidationResult;
};

type Meta = {
  // true when the value of the field is not equal to the initial value
  dirty: boolean;
  // the current validation error for this field
  errorText: Nullable<ValidationResult['errorText']>;
  // true if this field's value has ever been changed. false otherwise
  modified: boolean;
  // true if this field has no validation or submission errors
  valid: ValidationResult['valid'];
};

type FormField = Pick<Field, 'name'> & {
  meta: Meta;
  value: FieldValue;
};

export type { Field, FieldValue, FormField };
