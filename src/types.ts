type FieldName = string;
type FieldValue = string;

type FailedValidation = {
  isValid: false;
  errorText: string;
};
type SuccessedValidation = {
  isValid: true;
};

type ValidationResult = FailedValidation | SuccessedValidation;

type Validator = (value: FieldValue) => ValidationResult;

type Field = {
  name: FieldName;
  initialValue?: FieldValue;
  validator: Validator;
};

export type { Field, FieldName, FieldValue, ValidationResult, FailedValidation };
